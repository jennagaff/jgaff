import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const memo = await prisma.memo.findUnique({
    where: { id },
    include: {
      responses: {
        include: { contact: { select: { id: true, name: true, company: true } } },
        orderBy: { createdAt: 'desc' },
      },
    },
  })
  if (!memo) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const innerCircle = await prisma.contact.findMany({
    where: { segment: 'INNER_CIRCLE' },
    select: { id: true, name: true, company: true },
  })

  return NextResponse.json({ ...memo, innerCircle })
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()
  const memo = await prisma.memo.update({ where: { id }, data: body })
  return NextResponse.json(memo)
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await prisma.memo.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
