import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const search = req.nextUrl.searchParams.get('search')
  const where: any = {}
  if (search) where.OR = [
    { name: { contains: search } },
    { email: { contains: search } },
  ]

  const contacts = await prisma.contact.findMany({
    where,
    include: { company: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json({ contacts })
}
