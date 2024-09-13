import { Settings, Ticket, User2, Users } from 'lucide-react'
import { ReactNode } from 'react'

import { Screen } from '@/components/screen'

import { AsideLink } from './aside-link'

export default async function Layout({ children }: { children: ReactNode }) {
  return (
    <Screen>
      <div className="grid grid-cols-10 gap-12 px-8">
        <aside className="col-span-1 -mx-4 space-y-4">
          <h2 className="mx-4 text-2xl font-bold tracking-tight">Settings</h2>

          <nav className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <span className="mb-2 px-4 text-xxs font-semibold uppercase text-muted-foreground">
                General
              </span>
              <AsideLink href="/app/settings">
                <Settings className="mr-2 size-4" />
                Settings
              </AsideLink>
              <AsideLink href="/app/settings/profile">
                <User2 className="mr-2 size-4" />
                Profile
              </AsideLink>
              <AsideLink href="/app/settings/users">
                <Users className="mr-2 size-4" />
                Users
              </AsideLink>
              <AsideLink href="/app/settings/sessions">
                <Users className="mr-2 size-4" />
                Seções
              </AsideLink>
              <AsideLink href="/app/settings/members">
                <Users className="mr-2 size-4" />
                Membros
              </AsideLink>
              <AsideLink href="/app/settings/tickets/import">
                <Ticket className="mr-2 size-4" />
                Tickets
              </AsideLink>
            </div>
            {/* <div className="flex flex-col gap-1">
              <span className="mb-2 px-4 text-xxs font-semibold uppercase text-muted-foreground">
                Developers
              </span>
              <AsideLink href="/app/settings/developers">
                <Code2 className="mr-2 size-4" />
                API & Webhooks
              </AsideLink>
              <AsideLink href="/app/settings/developers/logs">
                <SquareDashedBottomCode className="mr-2 size-4" />
                Webhook Logs
              </AsideLink>
            </div> */}
          </nav>
        </aside>

        <div className="col-span-9">{children}</div>
      </div>
    </Screen>
  )
}
