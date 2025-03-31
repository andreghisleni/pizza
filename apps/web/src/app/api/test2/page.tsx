/* eslint @next/next/no-img-element: off */
import { toBuffer } from 'bwip-js'
import { Metadata } from 'next'
import { z } from 'zod'

const propsSchema = z.object({
  searchParams: z.object({
    start: z.coerce.number(),
    end: z.coerce.number()
  }),
})

export async function generateMetadata(
  props: z.infer<typeof propsSchema>,
): Promise<Metadata> {
  const d = propsSchema.safeParse(props)
  if (!d.success) {
    return {
      title: {
        absolute: 'Ingressos pizzas',
      },
    }
  }

  return {
    title: {
      absolute: 'Ingressos pizzas',
    },
  }
}

export default async function PintSale(props: z.infer<typeof propsSchema>) {
  const d = propsSchema.safeParse(props)
  if (!d.success) {
    return <div>{d.error.message}</div>
  }

  const { start, end } = d.data.searchParams

  return (
    <div className="box-border flex h-screen w-screen flex-col bg-white font-sans text-black">
      <div className="flex w-[500px] flex-wrap items-start gap-x-[3mm] break-words ">
        {gerarArrayStrings4Caracteres(start, end).map((n) => <PostiteItem
          {...{
            key: n,
            number: n,
          }}
        />)}
      </div>
    </div>
  )
}
async function PostiteItem({
  number,
}: {
  number: string
}) {
  const barcode = (
    await toBuffer({
      bcid: 'code128', // Tipo de código de barras
      text: number || 'hi', // Texto a ser codificado
      scale: 3, // Escala do código de barras
      height: 7, // Altura do código de barras
      includetext: true, // Incluir o texto no código de barras
      textxalign: 'center', // Alinhamento do texto
    })
  ).toString('base64')

  return (
    <div className="w-[500px] h-[246px] overflow-auto whitespace-nowrap text-[8px] bg-white">
      {barcode && (
        <img
          src={`data:image/png;base64, ${barcode}`}
          alt="Barcode"
          className="w-full h-full"
        />
      )}
    </div>
  )
}


function gerarArrayStrings4Caracteres(start: number, end: number): string[] {
  /**
   * Gera um array de números convertidos em strings com 4 caracteres.
   *
   * @param start O número inicial da sequência.
   * @param end O número final da sequência.
   * @returns Uma lista de strings representando os números no intervalo [start, end],
   * com cada string tendo 4 caracteres.
   */

  if (!Number.isInteger(start) || !Number.isInteger(end)) {
    throw new Error("Os valores de 'start' e 'end' devem ser inteiros.");
  }

  if (start > end) {
    throw new Error("O valor de 'start' deve ser menor ou igual ao valor de 'end'.");
  }

  const arrayStrings: string[] = [];
  for (let numero = start; numero <= end; numero++) {
    const stringFormatada: string = String(numero).padStart(4, '0');
    arrayStrings.push(stringFormatada);
  }
  return arrayStrings;
}