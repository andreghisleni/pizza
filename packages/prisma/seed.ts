import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function seed() {
  await Promise.all(
    [].map(
      async (name) =>
        await prisma.$queryRawUnsafe(
          `Truncate "${name}" restart identity cascade;`,
        ),
    ),
  )

  const hashedPassword = await hash('PZ@Andre4321', 10)

  // const user =
  await prisma.user.create({
    data: {
      id: '8fe74579-01c3-4c98-bd24-9e86aebe507b',
      name: 'André Ghisleni Raimann',
      email: 'andre@andreg.com.br',
      image: 'https://github.com/andreghisleni.png',
      passwordHash: hashedPassword,
    },
  })
}

seed().then(() => {
  console.log('Seed finished')
})
