import { GetObjectCommand, getSignedUrl, r2 } from '@pizza/cloudflare'
import { env } from '@pizza/env'
import { prisma } from '@pizza/prisma'
import { NextResponse } from 'next/server'
import { z } from 'zod'

const downloadMediaParamsSchema = z.object({
  id: z.string().uuid(),
  file: z.enum(['file']),
})

type DownloadMediaParamsSchema = z.infer<typeof downloadMediaParamsSchema>

export const dynamic = 'force-dynamic'

export async function GET(
  _: Request,
  { params }: { params: DownloadMediaParamsSchema },
) {
  const { id, file } = downloadMediaParamsSchema.parse(params)

  try {
    const scoutGroup = await prisma.scoutGroups.findUniqueOrThrow({
      where: {
        id,
      },
    })

    if (!scoutGroup) {
      return new Error('ScoutGroup not found')
    }

    const downloadSignedUrl = await getSignedUrl(
      r2,
      new GetObjectCommand({
        Bucket: env.CLOUDFLARE_UPLOAD_BUCKET_NAME,
        Key: `${scoutGroup.receipt_file}`,
      }),
      { expiresIn: 60 * 60 /* 1 hour */ },
    )

    return NextResponse.redirect(downloadSignedUrl, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  } catch (err) {
    console.log(err); // eslint-disable-line
  }
}
