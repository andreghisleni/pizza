// import { auth } from '@pizza/auth'
import { redirect } from 'next/navigation'

export default async function Homepage() {
  // const session = await auth()

  // if (session) {
  //   if (session.user.activityId) {
  //     redirect(`/activity/${session.user.activityId}`)
  //   }
  // }

  redirect('/app/dashboard')
  return (
    <div className="flex h-screen items-center justify-center px-6">
      <div className="w-full max-w-[400px] space-y-8">
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-medium">Pizza extra</h1>
        </div>
      </div>
    </div>
  )
}
