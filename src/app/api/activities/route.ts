import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const contactId = searchParams.get('contactId')
  const limit = parseInt(searchParams.get('limit') ?? '50')

  const activities = await prisma.activity.findMany({
    where: { ...(contactId && { contactId }) },
    include: { contact: { select: { id: true, name: true } } },
    orderBy: { date: 'desc' },
    take: limit,
  })
  return NextResponse.json(activities)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const activity = await prisma.activity.create({
    data: body,
    include: { contact: { select: { id: true, name: true } } },
  })
  return NextResponse.json(activity, { status: 201 })
}
