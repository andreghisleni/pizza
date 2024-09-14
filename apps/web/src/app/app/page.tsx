// import { auth } from '@pizza/auth'
import { auth } from '@pizza/auth'
import { redirect } from 'next/navigation'

export default async function Homepage() {
  const session = await auth()

  if (session) {
    if (session.user.type === 'ADMIN') {
      redirect(`/app/dashboard`)
    }
    if (session.user.type === 'DEFAULT') {
      redirect(`/app/aa`)
    }
  }

  redirect('/')
}
