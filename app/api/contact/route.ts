import { NextRequest, NextResponse } from 'next/server'
import { createTransporter, buildEmailHtml } from '@/lib/mailer'
import { sendWhatsAppEnquiry } from '@/lib/whatsapp'
import { appendLeadToSheet } from '@/lib/sheets'

// Simple in-memory rate limiting (upgrade to Redis in production)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 5
const RATE_WINDOW = 60 * 60 * 1000 // 1 hour

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(ip)

  if (!record || record.resetAt < now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW })
    return true
  }

  if (record.count >= RATE_LIMIT) return false

  record.count++
  return true
}

export async function POST(req: NextRequest) {
  // Rate limit by IP
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? '0.0.0.0'
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Too many submissions. Please try again later.' },
      { status: 429 }
    )
  }

  let body: Record<string, string>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const { name, email, phone, company, enquiryType, message, contactMethod } = body

  // Validate required fields
  if (!name?.trim() || !email?.trim() || !phone?.trim() || !message?.trim()) {
    return NextResponse.json({ error: 'Required fields missing' }, { status: 400 })
  }

  // Sanitize inputs
  const safe = (s: string) => String(s ?? '').trim().slice(0, 1000)

  const data = {
    name: safe(name),
    email: safe(email),
    phone: safe(phone),
    company: safe(company),
    enquiryType: safe(enquiryType),
    message: safe(message),
    contactMethod: safe(contactMethod),
    timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
  }

  // Run all 3 integrations in parallel, fail gracefully
  const results = await Promise.allSettled([
    // 1. Email via Nodemailer
    (async () => {
      const transporter = createTransporter()
      await transporter.sendMail({
        from: `"Silverring Website" <${process.env.GMAIL_USER}>`,
        to: 'raviraj.g@silverringventures.com',
        subject: `New Enquiry: ${data.enquiryType || 'General'} — ${data.name}`,
        html: buildEmailHtml(data),
      })
    })(),

    // 2. WhatsApp via Twilio
    sendWhatsAppEnquiry(data),

    // 3. Google Sheets
    appendLeadToSheet([
      data.timestamp,
      data.name,
      data.email,
      data.phone,
      data.company,
      data.enquiryType,
      data.contactMethod,
      data.message,
      'New',
    ]),
  ])

  // Log any failures (don't expose to client)
  results.forEach((result, i) => {
    const labels = ['Email', 'WhatsApp', 'Google Sheets']
    if (result.status === 'rejected') {
      console.error(`${labels[i]} error:`, result.reason)
    }
  })

  return NextResponse.json({ success: true })
}
