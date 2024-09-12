// For loading example data
import { env } from '@pizza/env'
import { prisma } from '@pizza/prisma'
import * as XLSX from 'xlsx'

import { inputPhoneMask } from '@/utils/inputMasks'
export async function GET() {
  // request: NextRequest,
  // { params }: { params: { table: string } },
  // Check auth & permission here

  // const searchParams = request.nextUrl.searchParams
  // const format = searchParams.get('format')

  try {
    // const { table } = params

    // if (!table) throw new Error('Table name required')

    // Pseudo-code steps:
    // 1. GET all table names from db

    // 2. Find the table that matches the param

    // 3. If table name doesn't exist, throw error

    // 4. If it does exist, use the matching table name
    // for the proper case
    const tableName = `export-data-${new Date().toISOString()}`

    // 5. Query the table data from database
    // ** Using static data in this example

    // Loading example data
    // const file = await fs.readFile(
    //   process.cwd() + '/example-data/data.json',
    //   'utf8',
    // )
    // const jsonTableData = JSON.parse(file)

    // console.log(jsonTableData)

    const scoutGroups = await prisma.scoutGroups.findMany({
      include: {
        responsible: true,
      },
      orderBy: {
        state: 'asc',
      },
      where: {
        submitedAt: {
          not: null,
        },
      },
    })

    const scoutGroupsWorkSheet = XLSX.utils.json_to_sheet(
      scoutGroups.map((item) => ({
        id: item.id,
        Nome: item.name,
        Numeral: item.numeral,
        Estado: item.state,
        Cidade: item.city,
        Distrito: item.districtName,
        Responsável: item.responsible?.name,
        'Email do responsável': item.responsible?.email,
        'Telefone do responsável': inputPhoneMask(
          item.responsible?.phone || '',
        ),
        'Submetido em': item.submitedAt,
        'Confirmado em': item.confirmedAt,
        'Pagamento confirmado em': item.paymentConfirmedAt,
        'Comprovante de pagamento': `${env.NEXT_PUBLIC_VERCEL_URL}/api/scout-group/download/${item.id}/file`,
      })),
    )

    const members = await prisma.members.findMany({
      orderBy: {
        name: 'asc',
      },
      include: {
        scoutGroup: true,
      },
      where: {
        scoutGroup: {
          submitedAt: {
            not: null,
          },
        },
      },
    })

    const membersWorkSheet = XLSX.utils.json_to_sheet(
      members.map((item) => ({
        id: item.id,
        Nome: item.name,
        Registro: `${item.registerNumber}-${item.registerVerifier}`,
        Sexo: item.sex === 'M' ? 'Masculino' : 'Feminino',
        'Numero de telefone': inputPhoneMask(item.phoneNumber),
        'Data de nascimento': item.birthDate?.toISOString().split('T')[0],
        'Tipo de membro':
          item.type === 'DONATION'
            ? 'Doação'
            : item.type === 'WITH_ALIMENTATION'
              ? 'Com alimentação'
              : 'Sem alimentação',
        'Grupo escoteiro': item.scoutGroup?.name,
        Numeral: `${item.scoutGroup?.numeral}-${item.scoutGroup?.state}`,
        'Restrições alimentares': item.alimentationRestrictions,
        'Restrições físicas': item.healthRestrictions,
        'Possui Insígnia da madeira': item.haveInsigniaDaMadeira
          ? 'Sim'
          : 'Não',
      })),
    )

    // if (format === 'csv') {
    //   const csv = XLSX.utils.sheet_to_csv(worksheet, {
    //     forceQuotes: true,
    //   })

    //   return new Response(csv, {
    //     status: 200,
    //     headers: {
    //       'Content-Disposition': `attachment; filename="${tableName}.csv"`,
    //       'Content-Type': 'text/csv',
    //     },
    //   })
    // } else if (format === 'txt') {
    //   // tab-separated values

    //   const txt = XLSX.utils.sheet_to_txt(worksheet, {
    //     forceQuotes: true,
    //   })

    //   return new Response(txt, {
    //     status: 200,
    //     headers: {
    //       'Content-Disposition': `attachment; filename="${tableName}.txt"`,
    //       'Content-Type': 'text/csv',
    //     },
    //   })
    // } else if (format === 'xlsx') {
    const workbook = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(
      workbook,
      scoutGroupsWorkSheet,
      'Grupos Escoteiros',
    )
    XLSX.utils.book_append_sheet(workbook, membersWorkSheet, 'Membros')

    const buf = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' })

    return new Response(buf, {
      status: 200,
      headers: {
        'Content-Disposition': `attachment; filename="${tableName}.xlsx"`,
        'Content-Type': 'application/vnd.ms-excel',
      },
    })
    // }
    // else if (format === 'json') {
    //   return Response.json(jsonTableData)
    // } else {
    //   const html = XLSX.utils.sheet_to_html(worksheet)

    //   return new Response(html, {
    //     status: 200,
    //     headers: {
    //       'Content-Type': 'text/html',
    //     },
    //   })
    // }
  } catch (e) {
    if (e instanceof Error) {
      console.error(e)
      return new Response(e.message, {
        status: 400,
      })
    }
  }
}
