import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const activities = await prisma.activity.findMany({
    include: {
      user: { select: { name: true, avatar: true } },
      deal: { select: { name: true } },
      contact: { select: { name: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 20,
  })
  return NextResponse.json({ activities })
}
