import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { parseLinkedInCSV } from '@/lib/linkedin-parse'
import { Segment, ContactSource } from '@/generated/prisma/client'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { csv, segment } = body as { csv: string; segment: Segment }

  const parsed = parseLinkedInCSV(csv)
  if (!parsed.length) {
    return NextResponse.json({ error: 'No contacts found in CSV' }, { status: 400 })
  }

  const results = { imported: 0, skipped: 0 }

  for (const c of parsed) {
    if (c.email) {
      const existing = await prisma.contact.findFirst({ where: { email: c.email } })
      if (existing) { results.skipped++; continue }
    }
    await prisma.contact.create({
      data: {
        name: c.name,
        email: c.email,
        company: c.company,
        title: c.title,
        linkedinUrl: c.linkedinUrl,
        segment,
        source: ContactSource.LINKEDIN,
      },
    })
    results.imported++
  }

  return NextResponse.json(results, { status: 201 })
}
