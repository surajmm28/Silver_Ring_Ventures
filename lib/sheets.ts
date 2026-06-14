import { google } from 'googleapis'

export async function appendLeadToSheet(row: string[]) {
  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY!),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })

  const sheets = google.sheets({ version: 'v4', auth })

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: 'Leads!A:I',
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [row] },
  })
}
