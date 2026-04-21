import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Segment, Stage } from '@/generated/prisma/client'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const segment = searchParams.get('segment') as Segment | null
  const stage = searchParams.get('stage') as Stage | null
  const q = searchParams.get('q')

  const contacts = await prisma.contact.findMany({
    where: {
      ...(segment && { segment }),
      ...(stage && { stage }),
      ...(q && {
        OR: [
          { name: { contains: q } },
          { email: { contains: q } },
          { company: { contains: q } },
        ],
      }),
    },
    include: {
      _count: { select: { notes: true, activities: true } },
    },
    orderBy: { updatedAt: 'desc' },
  })
  return NextResponse.json(contacts)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const contact = await prisma.contact.create({ data: body })
  return NextResponse.json(contact, { status: 201 })
}
