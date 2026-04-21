import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: memoId } = await params
  const body = await request.json()
  const response = await prisma.memoResponse.create({
    data: { ...body, memoId },
    include: { contact: { select: { id: true, name: true, company: true } } },
  })
  return NextResponse.json(response, { status: 201 })
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: memoId } = await params
  const { searchParams } = new URL(request.url)
  const responseId = searchParams.get('responseId')
  if (!responseId) return NextResponse.json({ error: 'Missing responseId' }, { status: 400 })
  await prisma.memoResponse.delete({ where: { id: responseId, memoId } })
  return NextResponse.json({ ok: true })
}
