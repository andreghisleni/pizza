import { FooterHome } from '@/components/footer-home'
import { HeaderHome } from '@/components/header-home'

export default async function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-screen overflow-auto">
      <div className="flex min-h-screen flex-col">
        <HeaderHome />
        <div className="flex flex-1 flex-col gap-4 pt-6">{children}</div>

        <FooterHome />
      </div>
    </div>
  )
}
