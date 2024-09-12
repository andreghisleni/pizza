import { CopyObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { env } from '@pizza/env'

import { r2 } from './r2'

export async function moveFile(from: string, to: string): Promise<void> {
  try {
    await r2.send(
      new CopyObjectCommand({
        Bucket: env.CLOUDFLARE_UPLOAD_BUCKET_NAME,
        Key: `${to}`,
        CopySource: `${env.CLOUDFLARE_UPLOAD_BUCKET_NAME}/${from}`,
      }),
    )

    await r2.send(
      new DeleteObjectCommand({
        Bucket: env.CLOUDFLARE_UPLOAD_BUCKET_NAME,
        Key: `${from}`,
      }),
    )
  } catch (error) {
    throw new Error(
      `Error moving file, from: ${from}, to: ${to}, all error: ${error}`,
    )
  }
}

export async function deleteFile(file: string): Promise<void> {
  await r2.send(
    new DeleteObjectCommand({
      Bucket: env.CLOUDFLARE_UPLOAD_BUCKET_NAME,
      Key: `${file}`,
    }),
  )
}
