// import { MenuLink } from './header-home/menu-link'
import { Container } from './my-ui/container'

export function FooterHome() {
  return (
    <footer className="border-t">
      <Container>
        <div className="flex flex-col items-center gap-4 px-8 py-8">
          <p className="text-sm text-muted-foreground">
            © 2024 Pizza extra
          </p>

          <p>
            Designed by <a href="https://andreg.com.br">AGSolutions</a>
          </p>
          {/* <nav className="flex items-center space-x-4">
            <MenuLink href="/privacy">Política de privacidade</MenuLink>
            <MenuLink href="/terms">Termos de uso</MenuLink>
          </nav> */}
        </div>
      </Container>
    </footer>
  )
}
