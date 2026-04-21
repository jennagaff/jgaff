import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const contacts = await prisma.contact.findMany({
    select: {
      id: true,
      name: true,
      company: true,
      title: true,
      stage: true,
      segment: true,
      updatedAt: true,
      _count: { select: { activities: true } },
    },
    orderBy: { updatedAt: 'desc' },
  })

  const grouped = {
    LEAD: contacts.filter((c) => c.stage === 'LEAD'),
    OPPORTUNITY: contacts.filter((c) => c.stage === 'OPPORTUNITY'),
    CLOSED_WON: contacts.filter((c) => c.stage === 'CLOSED_WON'),
    CLOSED_LOST: contacts.filter((c) => c.stage === 'CLOSED_LOST'),
  }

  return NextResponse.json(grouped)
}
