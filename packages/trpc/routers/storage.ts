import {
  deleteFile,
  // GetObjectCommand,
  getSignedUrl,
  PutObjectCommand,
  r2,
} from '@pizza/cloudflare'
import { env } from '@pizza/env'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'

import { createTRPCRouter, publicProcedure } from '../trpc'

const FILE_EXTENSIONS = [
  {
    extension: 'pdf',
    type: 'application/pdf',
  },
  {
    extension: 'png',
    type: 'image/png',
  },
  {
    extension: 'jpg',
    type: 'image/jpeg',
  },
]

export const storageRouter = createTRPCRouter({
  requestUploadUrl: publicProcedure
    .input(
      z.object({
        type: z.enum(['application/pdf', 'image/png', 'image/jpeg']),
      }),
    )
    .query(async ({ input }) => {
      const { type } = input
      const file_extension = FILE_EXTENSIONS.find((ext) => ext.type === type)

      if (!file_extension) {
        throw new TRPCError({
          message: 'Invalid file type',
          code: 'BAD_REQUEST',
        })
      }
      const file_name = `${crypto.randomUUID()}.${file_extension.extension}`

      const signedUrl = await getSignedUrl(
        r2,
        new PutObjectCommand({
          Bucket: env.CLOUDFLARE_UPLOAD_BUCKET_NAME,
          Key: `${file_name}`,
          // ContentType: 'video/mp4',
        }),
        { expiresIn: 600 },
      )

      return { url: signedUrl, file_name }
    }),

  deleteFile: publicProcedure
    .input(
      z.object({
        files: z.array(z.string()),
      }),
    )
    .query(async ({ input }) => {
      const { files } = input

      // for (const file of files) {
      //   await deleteFile(file)
      // }

      await Promise.all(files.map(deleteFile))

      return { success: true }
    }),

  // requestMediaDownloadUrl: protectedProcedure
  //   .input(
  //     z.object({
  //       videoId: z.string().uuid(),
  //       media: z.enum(['video', 'audio']),
  //     }),
  //   )
  //   .query(async ({ input }) => {
  //     const { videoId, media } = input

  //     const videoToDownload = await db.query.upload.findFirst({
  //       where(fields, { eq }) {
  //         return eq(fields.id, videoId)
  //       },
  //     })

  //     if (!videoToDownload) {
  //       throw new TRPCError({
  //         message: 'Video not found.',
  //         code: 'BAD_REQUEST',
  //       })
  //     }

  //     const columnKey = media === 'video' ? 'storageKey' : 'audioStorageKey'
  //     const downloadKey = videoToDownload[columnKey]

  //     if (downloadKey === null) {
  //       throw new TRPCError({
  //         message: 'Media not found.',
  //         code: 'BAD_REQUEST',
  //       })
  //     }

  //     const downloadSignedUrl = await getSignedUrl(
  //       r2,
  //       new GetObjectCommand({
  //         Bucket: env.CLOUDFLARE_STORAGE_BUCKET_NAME,
  //         Key: downloadKey,
  //       }),
  //       { expiresIn: 60 * 60 /* 1 hour */ },
  //     )

  //     return { downloadUrl: downloadSignedUrl }
  //   }),
})
