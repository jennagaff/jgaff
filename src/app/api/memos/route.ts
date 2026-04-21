import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const memos = await prisma.memo.findMany({
    include: { _count: { select: { responses: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(memos)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const memo = await prisma.memo.create({
    data: body,
    include: { _count: { select: { responses: true } } },
  })
  return NextResponse.json(memo, { status: 201 })
}
