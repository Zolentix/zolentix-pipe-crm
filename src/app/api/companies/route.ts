import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const companies = await prisma.company.findMany({
    include: { _count: { select: { contacts: true, deals: true } } },
    orderBy: { name: 'asc' },
  })
  return NextResponse.json({ companies })
}
