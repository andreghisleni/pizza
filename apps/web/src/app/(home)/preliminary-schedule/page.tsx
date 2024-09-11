import { Metadata } from 'next'

import { Container } from '@/components/my-ui/container'
import { Section } from '@/components/my-ui/section'
import { Separator } from '@/components/ui/separator'

export const metadata: Metadata = {
  title: 'Programação Preliminar',
}

const schedule = [
  {
    title: 'Dia 19 de julho de 2024',
    times: [
      { time: '08h00', text: 'Credenciamento' },
      { time: '08h30', text: 'Abertura' },
      { time: '09h00', text: 'Palestra 1' },
      { time: '10h00', text: 'Intervalo' },
      { time: '10h20', text: 'Apresentações orais' },
      { time: '12h20', text: 'Informes' },
      { time: '12h30', text: 'Almoço' },
      {
        time: '14h00',
        text: 'Abertura da exposição de astrofotografias e sessão de pôsteres',
      },
      { time: '15h00', text: 'Palestra 2' },
      { time: '16h00', text: 'Intervalo' },
      { time: '16h20', text: 'Apresentações orais' },
      { time: '17h50', text: 'Informes' },
      { time: '18h00', text: 'Intervalo' },
      { time: '19h30', text: 'Atividade de observação e integração' },
    ],
  },
  {
    title: 'Dia 20 de julho de 2024',
    times: [
      { time: '08h30', text: 'Atividade cultural' },
      { time: '09h00', text: 'Palestra 3' },
      { time: '10h00', text: 'Intervalo' },
      { time: '10h20', text: 'Apresentações orais' },
      { time: '12h20', text: 'Informes' },
      { time: '12h30', text: 'Almoço' },
      { time: '14h00', text: 'Mesa redonda' },
      { time: '15h00', text: 'Apresentações das dos grupos de astronomia' },
      { time: '15h45', text: 'Assembleia' },
      { time: '17h00', text: 'Encerramento' },
    ],
  },
]

export default function PresentationPage() {
  return (
    <Section variant="callaction">
      <Container className="flex flex-col items-center">
        <h1 className="text-4xl font-bold text-primary">
          Programação Preliminar
        </h1>
        <h2 className="text-2xl">
          Local: EEB Bom Pastor - R. Florianópolis, 314 E - Centro, Chapecó
        </h2>

        {schedule.map((day) => (
          <>
            <h2 className="mt-8 text-2xl font-bold text-primary">
              {day.title}
            </h2>
            <ul className="mt-4 flex w-full flex-col items-center gap-8">
              {day.times.map((time) => (
                <li
                  key={time.time}
                  className="flex w-full  max-w-3xl items-center gap-8 rounded-lg bg-background px-12 py-16 shadow-lg"
                >
                  <span className="font-bold text-primary">{time.time}</span>
                  <Separator orientation="vertical" />
                  <span className="text-justify">{time.text}</span>
                </li>
              ))}
            </ul>
          </>
        ))}
      </Container>
    </Section>
  )
}
