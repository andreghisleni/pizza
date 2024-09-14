import { Container } from '@/components/my-ui/container'
import { Section } from '@/components/my-ui/section'

import { FindMemberTickets } from './find-member-tickets'

export default function Homepage() {
  return (
    <div className="space-y-2">
      <Section variant="callaction">
        <Container className="flex flex-col items-center gap-8 text-center">
          <h1 className="text-4xl font-bold text-primary">
            10º Edição EXTRA da pizza escoteira do G.E. Xapecó
          </h1>

          {/* <Button>Consulte o status dos ingrenços dos membros juvenil</Button> */}

          <FindMemberTickets />
        </Container>
      </Section>
    </div>
  )
}
