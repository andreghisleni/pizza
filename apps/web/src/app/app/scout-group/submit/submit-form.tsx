'use client'

import axios from 'axios'
import { useRouter } from 'next/navigation'

import { FileUpload } from '@/components/file-upload'
import { useToast } from '@/components/ui/use-toast'
import { useUploadFile } from '@/hooks/useUploadFile'
import { nativeClient } from '@/lib/trpc/client'
import { trpc } from '@/lib/trpc/react'

export function SubmitForm() {
  const router = useRouter()

  const { toast } = useToast()

  const createSubmit = trpc.submitInscription.useMutation({
    onSuccess: () => {
      toast({
        title: 'Inscrição submetida com sucesso',
      })

      router.push(`/app/scout-group?t=${new Date().getTime()}`)
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      console.log(error) // eslint-disable-line no-console
      toast({
        title: 'Erro ao realizar submissão',
        description: error.response?.data as string,

        variant: 'destructive',
      })
    },
  })

  const file = useUploadFile({
    handleUploadFunction: async (file: File) => {
      const response = await nativeClient.requestUploadUrl.query({
        type: file.type as 'application/pdf' | 'image/png' | 'image/jpeg',
      })

      const uploadURL = response.url

      await axios.put(uploadURL, file, {
        headers: {
          'Content-Type': file.type,
        },
      })

      await createSubmit.mutateAsync({
        file_name: response.file_name,
      })

      return {
        file_name: response.file_name,
      }
    },
  })

  return (
    <div className="space-y-2">
      <div className="flex flex-col items-center gap-2">
        <span className="text-lg">Envie o comprovante de pagamento</span>
        <FileUpload
          file={file}
          buttonTexts={
            ({ isFileUploading, fileUploadedName }) =>
              isFileUploading
                ? 'Enviando...'
                : fileUploadedName
                ? 'Comprovante de pagamento enviado' // eslint-disable-line
                : 'Enviar comprovante e submeter inscrição'/*eslint-disable-line*/
          }
          uploadType="image"
        />
      </div>
    </div>
  )
}
