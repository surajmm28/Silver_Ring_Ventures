import twilio from 'twilio'

export async function sendWhatsAppEnquiry(data: {
  name: string
  phone: string
  email: string
  enquiryType: string
  contactMethod: string
  message: string
  timestamp: string
}) {
  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  )

  await client.messages.create({
    from: `whatsapp:${process.env.TWILIO_WHATSAPP_FROM}`,
    to: `whatsapp:${process.env.CLIENT_WHATSAPP_NUMBER}`,
    body: `🏗 *New Silverring Enquiry*\n\n*Name:* ${data.name}\n*Phone:* ${data.phone}\n*Email:* ${data.email}\n*Type:* ${data.enquiryType}\n*Contact via:* ${data.contactMethod}\n*Message:* ${data.message}\n\n_${data.timestamp} IST_`,
  })
}
