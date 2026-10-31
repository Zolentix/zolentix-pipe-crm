import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const tasks = await prisma.task.findMany({
    include: {
      deal: { select: { name: true } },
      user: { select: { name: true, avatar: true } },
    },
    orderBy: [{ completed: 'asc' }, { dueDate: 'asc' }],
  })
  return NextResponse.json({ tasks })
}

export async function PATCH(req: NextRequest) {
  const { id, completed } = await req.json()
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  const task = await prisma.task.update({ where: { id }, data: { completed } })
  return NextResponse.json({ task })
}
