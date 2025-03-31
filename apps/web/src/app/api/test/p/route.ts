import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

import { z } from 'zod';
import axios from 'axios';
import { env } from '@pizza/env';

import fs from 'node:fs';

export async function GET(request: NextRequest) {
  try {
    const response = await axios.post(
      `${env.API_PDF_URL}/1/pdf`,
      {
        url: `${env.WEB_PDF_HTML_URL}/api/test?start=1&end=1000`,
        export: {
          // width: '515px',
          // height: '735px',
          format: 'A3',
          printBackground: true,
          margin: {
            top: '0',
            right: '0',
            bottom: '0',
            left: '0',
          },
        },
      },
      {
        responseType: 'arraybuffer',
      },
    );

    // console.log('response', response); // eslint-disable-line no-console
    const arrayBuffer = response.data;
    const filePath = 'output.pdf'; // Specify the file path where you want to save the PDF

    const buffer = Buffer.from(arrayBuffer); // Convert ArrayBuffer to Buffer
  fs.writeFile(filePath, buffer, (err) => {
    if (err) {
      console.error('Error saving ArrayBuffer to file:', err);
      return;
    }
    console.log(`ArrayBuffer saved to ${filePath}`);
  });

    const headers = new Headers();

    headers.append('Content-Type', 'application/pdf');

    return new Response(response.data, {
      headers,
    });
  } catch (error: any) {
    console.log('error', error); // eslint-disable-line no-console
    return new Response(error.message, { status: 400 });
  }
}
