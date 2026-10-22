import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'

// Note: Direct database usage is deprecated for the website project.
const connectionString = process.env.DATABASE_URL

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

function createPrismaClient(): PrismaClient {
  if (connectionString) {
    const pool = new Pool({ connectionString })
    const adapter = new PrismaPg(pool)
    return new PrismaClient({ adapter })
  }

  // Safe fallback mock when database is disconnected / deprecated
  const createMock = (): any =>
    new Proxy(() => Promise.resolve([]), {
      get: (_target, prop) => {
        if (prop === 'then') return undefined
        return createMock()
      },
      apply: () => Promise.resolve([]),
    })

  return createMock() as unknown as PrismaClient
}

export const prisma = globalForPrisma.prisma || createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

