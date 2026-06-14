import nodemailer from 'nodemailer'

export function createTransporter() {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  })
}

export function buildEmailHtml(data: {
  name: string
  email: string
  phone: string
  company?: string
  enquiryType: string
  contactMethod: string
  message: string
  timestamp: string
}) {
  return `
    <div style="font-family:sans-serif;max-width:600px;background:#050505;color:#EDEBE6;padding:40px;border-left:3px solid #C4973D;">
      <h1 style="color:#C4973D;font-size:24px;margin-bottom:24px;">New Website Enquiry</h1>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:12px 0;border-bottom:1px solid #1A1A1A;color:#9A9090;font-size:12px;letter-spacing:2px;text-transform:uppercase;">Name</td><td style="padding:12px 0;border-bottom:1px solid #1A1A1A;">${data.name}</td></tr>
        <tr><td style="padding:12px 0;border-bottom:1px solid #1A1A1A;color:#9A9090;font-size:12px;letter-spacing:2px;text-transform:uppercase;">Email</td><td style="padding:12px 0;border-bottom:1px solid #1A1A1A;">${data.email}</td></tr>
        <tr><td style="padding:12px 0;border-bottom:1px solid #1A1A1A;color:#9A9090;font-size:12px;letter-spacing:2px;text-transform:uppercase;">Phone</td><td style="padding:12px 0;border-bottom:1px solid #1A1A1A;">${data.phone}</td></tr>
        <tr><td style="padding:12px 0;border-bottom:1px solid #1A1A1A;color:#9A9090;font-size:12px;letter-spacing:2px;text-transform:uppercase;">Company</td><td style="padding:12px 0;border-bottom:1px solid #1A1A1A;">${data.company || '—'}</td></tr>
        <tr><td style="padding:12px 0;border-bottom:1px solid #1A1A1A;color:#9A9090;font-size:12px;letter-spacing:2px;text-transform:uppercase;">Enquiry Type</td><td style="padding:12px 0;border-bottom:1px solid #1A1A1A;color:#C4973D;">${data.enquiryType}</td></tr>
        <tr><td style="padding:12px 0;border-bottom:1px solid #1A1A1A;color:#9A9090;font-size:12px;letter-spacing:2px;text-transform:uppercase;">Contact Via</td><td style="padding:12px 0;border-bottom:1px solid #1A1A1A;">${data.contactMethod}</td></tr>
        <tr><td style="padding:12px 0;color:#9A9090;font-size:12px;letter-spacing:2px;text-transform:uppercase;vertical-align:top;">Message</td><td style="padding:12px 0;">${data.message}</td></tr>
      </table>
      <p style="margin-top:24px;font-size:11px;color:#5A5650;">Received: ${data.timestamp} IST · Silverring Ventures Website</p>
    </div>
  `
}
