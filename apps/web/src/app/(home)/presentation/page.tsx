import { Metadata } from 'next'

import { Container } from '@/components/my-ui/container'
import { Section } from '@/components/my-ui/section'

export const metadata: Metadata = {
  title: 'Apresentação',
}

export default function PresentationPage() {
  return (
    <Section variant="callaction">
      <Container className="flex flex-col items-center">
        <h1 className="text-4xl font-bold text-primary">
          Apresentação a verificar
        </h1>
        <p>A verificar</p>

        {/* <p>
          As inscrições para participação sem apresentação de trabalhos vão até
          o dia <s>1° de julho</s>
          <span className="font-bold"> 31 de maio</span>.
        </p> */}
      </Container>
    </Section>
  )
}
