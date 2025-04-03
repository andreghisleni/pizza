/* eslint @typescript-eslint/no-explicit-any:off */

import fs from 'node:fs'

import { env } from '@pizza/env'
import axios from 'axios'
export async function GET() {
  try {
    const response = await axios.post(
      `${env.API_PDF_URL}/1/pdf`,
      {
        url: `${env.WEB_PDF_HTML_URL}/api/calabresa?start=1&end=1000`,
        export: {
          // width: '515px',
          // height: '735px',
          format: 'A4',
          printBackground: true,
          margin: {
            top: '0.5cm',
            right: '0',
            bottom: '0',
            left: '0.5cm',
          },
        },
      },
      {
        responseType: 'arraybuffer',
      },
    )

    // console.log('response', response); // eslint-disable-line no-console
    const arrayBuffer = response.data
    const filePath = 'output-calabresa.pdf' // Specify the file path where you want to save the PDF

    const buffer = Buffer.from(arrayBuffer) // Convert ArrayBuffer to Buffer
    fs.writeFile(filePath, buffer as any, (err) => {
      if (err) {
        console.error('Error saving ArrayBuffer to file:', err)
        return
      }
      console.log(`ArrayBuffer saved to ${filePath}`)
    })

    const headers = new Headers()

    headers.append('Content-Type', 'application/pdf')

    return new Response(response.data, {
      headers,
    })
  } catch (error: any) {
    console.log('error', error) // eslint-disable-line no-console
    return new Response(error.message, { status: 400 })
  }
}
