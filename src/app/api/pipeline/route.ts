import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  const stages = ['lead', 'contacted', 'qualified', 'proposal', 'won', 'lost']
  const deals = await prisma.deal.findMany({
    include: {
      owner: { select: { name: true, avatar: true } },
      contact: { select: { name: true } },
      company: { select: { name: true } },
    },
    orderBy: { updatedAt: 'desc' },
  })

  const pipeline: Record<string, typeof deals> = {}
  for (const s of stages) pipeline[s] = []
  for (const d of deals) {
    if (pipeline[d.stage]) pipeline[d.stage].push(d)
  }

  const totalValue = deals.filter(d => !['won', 'lost'].includes(d.stage)).reduce((s, d) => s + d.value, 0)
  const weightedForecast = deals.filter(d => !['won', 'lost'].includes(d.stage)).reduce((s, d) => s + d.value * d.probability / 100, 0)
  const wonDeals = deals.filter(d => d.stage === 'won')
  const lostDeals = deals.filter(d => d.stage === 'lost')
  const winRate = wonDeals.length + lostDeals.length > 0
    ? Math.round(wonDeals.length / (wonDeals.length + lostDeals.length) * 100) : 0
  const wonValue = wonDeals.reduce((s, d) => s + d.value, 0)

  return NextResponse.json({
    pipeline, totalValue, weightedForecast, winRate, wonValue,
    dealCount: deals.length, stageNames: stages,
  })
}
