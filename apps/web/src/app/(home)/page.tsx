import { Link2 } from 'lucide-react'
import Link from 'next/link'

import { Container } from '@/components/my-ui/container'
import { Section } from '@/components/my-ui/section'
import { Button } from '@/components/ui/button'

export default function Homepage() {
  return (
    <div className="space-y-2">
      <Section variant="callaction">
        <Container className="flex flex-col items-center gap-8 text-center">
          <h1 className="text-4xl font-bold text-primary">
            III Mutirão no CEPE - Campo Escoteiro Padre Edgard
          </h1>
          <Button asChild className="bg-primary hover:bg-primary/75" size="lg">
            <Link href="/auth/register/scout-group">
              Crie uma conta para inscrever o seu grupo escoteiro
            </Link>
          </Button>
          <Button asChild className="bg-primary hover:bg-primary/75" size="lg">
            <Link href="/app/scout-group">
              Caso já tenha uma conta, faça login.
            </Link>
          </Button>
          {/* <h2 className="text-2xl font-bold">Inscrições encerradas.</h2> */}
        </Container>
      </Section>
      <Section variant="callaction">
        <Container className="flex flex-col items-center gap-8 text-center">
          <h1 className="text-3xl font-bold text-primary">Informativos</h1>
          <ul>
            <li>
              <a
                href="https://drive.google.com/file/d/1vYkxWU9hQ9ddIqCCih-msJwdMGF3k7Wp/view?usp=sharing"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2"
              >
                <Link2 />
                Primeiro Informativo III Mutirão 2024
              </a>
            </li>
          </ul>
        </Container>
      </Section>
    </div>
  )
}
