import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const contactId = searchParams.get('contactId')
  const q = searchParams.get('q')

  const notes = await prisma.note.findMany({
    where: {
      ...(contactId && { contactId }),
      ...(q && { content: { contains: q } }),
    },
    include: { contact: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(notes)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const note = await prisma.note.create({
    data: body,
    include: { contact: { select: { id: true, name: true } } },
  })
  return NextResponse.json(note, { status: 201 })
}
