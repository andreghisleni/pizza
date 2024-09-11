import { X } from 'lucide-react'

import { UploadFile } from '@/hooks/useUploadFile'

import { Dropzone } from './Dropzone'
import { FileViewer } from './file-viewer'
import { Button } from './ui/button'
import { Card } from './ui/card'

type ButtonProps = {
  isFileUploading: boolean
  fileUploadedName?: string
}

type FileUploadProps = {
  file: UploadFile
  fileUploaded?: {
    name: string
    url: string
    file_name: string
  }

  buttonTexts?: (b: ButtonProps) => string

  uploadType?: 'image' | 'pdf' | 'all'
}

export function FileUpload({
  file,
  fileUploaded,
  buttonTexts,
  uploadType,
}: FileUploadProps) {
  return (
    <div className="flex w-full max-w-[600px] flex-col gap-4">
      <Card className="relative flex h-[502px] w-full max-w-[700px] flex-col rounded-lg">
        {fileUploaded ? (
          <FileViewer
            url={fileUploaded.url}
            file_name={fileUploaded.file_name}
            name={fileUploaded.name}
          />
        ) : file.fileUrl && file.localFile ? (
          <>
            <div className="absolute right-0 top-0 z-10 rounded-bl-lg rounded-tr-lg bg-white dark:bg-black">
              <button
                type="button"
                onClick={() => {
                  file.handleRemoveFile()
                }}
                className="rounded-bl-lg rounded-tr-lg bg-primary p-2 text-white hover:bg-primary/95 disabled:bg-primary/35"
                disabled={!!file.fileUploadedName}
              >
                <X />
              </button>
            </div>
            {file.localFile.type === 'application/pdf' ? (
              <iframe
                src={file.fileUrl}
                frameBorder="0"
                title={file.fileUrl}
                className="h-full w-full rounded-lg"
              />
            ) : (
              <img
                src={file.fileUrl}
                alt=""
                className="w-full overflow-x-auto rounded-lg"
              />
            )}
          </>
        ) : (
          <div className="h-full w-full p-4">
            <Dropzone onUpload={file.handleUpload} uploadType={uploadType} />
          </div>
        )}
      </Card>

      {!fileUploaded && (
        <Button
          onClick={file.handleUploadFile}
          disabled={file.isFileUploading || !!file.fileUploadedName}
        >
          {
            buttonTexts
              ? buttonTexts({
                  isFileUploading: file.isFileUploading,
                  fileUploadedName: file.fileUploadedName,
                })
              : file.isFileUploading
                ? 'Enviando...'
                : file.fileUploadedName
                ? 'Arquivo enviado' // eslint-disable-line
                : 'Enviar arquivo'/*eslint-disable-line*/
          }
        </Button>
      )}
    </div>
  )
}
