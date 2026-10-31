import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const stage = req.nextUrl.searchParams.get('stage')
  const ownerId = req.nextUrl.searchParams.get('ownerId')
  const search = req.nextUrl.searchParams.get('search')

  const where: any = {}
  if (stage) where.stage = stage
  if (ownerId) where.ownerId = ownerId
  if (search) where.name = { contains: search }

  const deals = await prisma.deal.findMany({
    where,
    include: {
      owner: { select: { id: true, name: true, avatar: true } },
      contact: { select: { id: true, name: true, email: true } },
      company: { select: { id: true, name: true } },
    },
    orderBy: { updatedAt: 'desc' },
  })

  return NextResponse.json({ deals })
}

export async function POST(req: NextRequest) {
  const data = await req.json()
  const deal = await prisma.deal.create({ data })
  return NextResponse.json({ deal }, { status: 201 })
}

export async function PATCH(req: NextRequest) {
  const { id, ...data } = await req.json()
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  const deal = await prisma.deal.update({ where: { id }, data })
  return NextResponse.json({ deal })
}
