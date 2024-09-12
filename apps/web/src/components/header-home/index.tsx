import { Container } from '../my-ui/container'
import { Separator } from '../ui/separator'
import { MenuLink } from './menu-link'
import { ThemeSwitcher } from './theme-switcher'

export function HeaderHome() {
  return (
    <div className="border-b">
      <Container>
        <div className="mt-8 flex flex-col items-center px-8">
          <div className="flex flex-col items-center md:flex-row md:items-end md:gap-8">
            {/* <LogoEvento /> */}

            <nav className="flex flex-col items-center md:flex-row md:space-x-2 lg:space-x-3">
              <MenuLink href="/">home</MenuLink>
              {/* <MenuLink href="/presentation">Apresentação</MenuLink> */}
              {/* <MenuLink href="/preliminary-schedule">
                Programação Preliminar
              </MenuLink> */}
              {/* <MenuLink href="/schedule">Programação</MenuLink> */}

              {/* <MenuLink href="/contact">Contato</MenuLink> */}
            </nav>

            <Separator
              orientation="vertical"
              className="hidden h-12 md:block"
            />
            <ThemeSwitcher />
          </div>
        </div>
      </Container>
    </div>
  )
}
