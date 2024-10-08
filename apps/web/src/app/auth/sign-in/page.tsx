import { Metadata } from 'next'
import Link from 'next/link'
import { z } from 'zod'

import { SignInForm } from './credentials/sign-in-form'

export const metadata: Metadata = {
  title: 'Sign In',
}

const SearchParamsSchema = z.object({
  user: z.string(),
  pass: z.string(),
})

export default async function SignInPage({
  searchParams,
}: {
  searchParams?: z.infer<typeof SearchParamsSchema>
}) {
  if (searchParams && 'user' in searchParams && 'pass' in searchParams) {
    const { user, pass } = SearchParamsSchema.parse(searchParams)

    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center">
        <div className="mx-auto flex w-full max-w-[350px] flex-col justify-center space-y-6">
          <div className="flex flex-col items-center space-y-8">
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Pizza extra
              </h1>
            </div>
          </div>
          <div>
            <SignInForm {...{ user, pass }} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full max-w-[350px] flex-col justify-center space-y-6">
        <div className="flex flex-col items-center space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Pizza extra
            </h1>
          </div>
        </div>
        <div>
          <SignInForm />

          <div className="mt-8 flex flex-col items-center gap-2">
            <h1 className="text-lg font-bold">Não tem uma conta?</h1>
            <span>
              Crie uma conta{' '}
              <Link href="/auth/register" className="font-bold">
                Clicando aqui!
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
