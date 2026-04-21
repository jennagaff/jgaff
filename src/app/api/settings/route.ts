import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const settings = await prisma.setting.findMany()
  const obj = Object.fromEntries(settings.map((s) => [s.key, s.value]))
  return NextResponse.json(obj)
}

export async function POST(request: NextRequest) {
  const body = await request.json() as Record<string, string>
  const upserts = Object.entries(body).map(([key, value]) =>
    prisma.setting.upsert({ where: { key }, update: { value }, create: { key, value } })
  )
  await Promise.all(upserts)
  return NextResponse.json({ ok: true })
}
