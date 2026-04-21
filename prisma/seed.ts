import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

const adapter = new PrismaLibSql({ url: process.env.DATABASE_URL ?? 'file:./prisma/dev.db' })
const prisma = new PrismaClient({ adapter })

async function main() {
  // Contacts
  const sarah = await prisma.contact.create({
    data: {
      name: 'Sarah Chen',
      email: 'sarah.chen@venturecap.io',
      company: 'Venture Capital Partners',
      title: 'Partner',
      segment: 'INNER_CIRCLE',
      stage: 'OPPORTUNITY',
      source: 'LINKEDIN',
    },
  })

  const marcus = await prisma.contact.create({
    data: {
      name: 'Marcus Rivera',
      email: 'marcus@techbridge.co',
      company: 'TechBridge',
      title: 'CEO',
      segment: 'INNER_CIRCLE',
      stage: 'CLOSED_WON',
      source: 'MANUAL',
    },
  })

  const priya = await prisma.contact.create({
    data: {
      name: 'Priya Nair',
      email: 'p.nair@founderfund.com',
      company: 'Founder Fund',
      title: 'Principal',
      segment: 'DREAM_50',
      stage: 'LEAD',
      source: 'LINKEDIN',
    },
  })

  const james = await prisma.contact.create({
    data: {
      name: 'James Okafor',
      email: 'james@scalable.ai',
      company: 'Scalable AI',
      title: 'CTO',
      segment: 'DREAM_50',
      stage: 'OPPORTUNITY',
      source: 'LINKEDIN',
    },
  })

  const nina = await prisma.contact.create({
    data: {
      name: 'Nina Watts',
      email: 'nina.watts@growthco.com',
      company: 'GrowthCo',
      title: 'VP Marketing',
      segment: 'DREAM_50',
      stage: 'LEAD',
      source: 'LINKEDIN',
    },
  })

  const david = await prisma.contact.create({
    data: {
      name: 'David Kim',
      email: 'dkim@portco.xyz',
      company: 'Portfolio Co',
      title: 'Founder',
      segment: 'GENERAL',
      stage: 'LEAD',
      source: 'MANUAL',
    },
  })

  const alex = await prisma.contact.create({
    data: {
      name: 'Alex Torres',
      email: 'alex@labs42.com',
      company: 'Labs42',
      title: 'Head of Product',
      segment: 'GENERAL',
      stage: 'CLOSED_LOST',
      source: 'HAPPENSTANCE',
    },
  })

  const maya = await prisma.contact.create({
    data: {
      name: 'Maya Patel',
      email: 'maya@pinecone.vc',
      company: 'Pinecone Ventures',
      title: 'Associate',
      segment: 'GENERAL',
      stage: 'LEAD',
      source: 'LINKEDIN',
    },
  })

  // Notes
  const now = new Date()
  const daysAgo = (n: number) => new Date(now.getTime() - n * 86400000)

  await prisma.note.create({
    data: {
      title: 'Q1 Strategy Call — Sarah Chen',
      content: `Had a 45 min call with Sarah to discuss the Q1 roadmap and partnership opportunities.

Key takeaways:
- VCP is actively deploying $50M in Series A rounds this quarter
- Sarah is particularly interested in AI infrastructure plays
- She mentioned that TechBridge's trajectory has been impressive since our intro
- Follow-up: Send her the deck on Lab's new advisory framework by Friday

Sarah seemed genuinely excited about the inner circle memo format. She'd love to be looped in on future opportunities.

Action items:
1. Send deck by Friday
2. Schedule coffee for mid-Feb
3. Intro to Priya at Founder Fund pending her approval`,
      source: 'GRANOLA',
      contactId: sarah.id,
    },
  })

  await prisma.note.create({
    data: {
      title: 'Re: Intro request — Marcus',
      content: `Marcus replied to my email intro request within 2 hours. Very positive tone. He's open to a 30-min call to explore whether there's a fit for the fractional advisory work. He mentioned budget is tight until the Series B closes but he sees value in the structured approach.`,
      source: 'EMAIL',
      contactId: marcus.id,
    },
  })

  await prisma.note.create({
    data: {
      title: 'LinkedIn DM notes — Priya',
      content: `Priya responded to my connection request with a thoughtful message. She's seen the work at Founder Fund from a distance and is curious about the pin labs methodology. Suggested we connect at the VC conference in March.`,
      source: 'MANUAL',
      contactId: priya.id,
    },
  })

  await prisma.note.create({
    data: {
      title: 'WhatsApp — James Okafor post-demo',
      content: `James: "Really impressed by the demo today. The AI layer is exactly what we've been missing. Can you send me the pricing tiers again?"

Me: "Sent! Let me know if you want to jump on a call to walk through the enterprise tier specifically."

James: "Will loop in our CFO next week. This could be a Q2 thing."`,
      source: 'WHATSAPP',
      contactId: james.id,
    },
  })

  await prisma.note.create({
    data: {
      title: 'First meeting notes — Nina Watts',
      content: `Coffee meeting at Workshop Coffee, Clerkenwell.

Nina is running growth for a 60-person scale-up. Significant budget for external advisors but wants proof of past results first. Asked for 3 case studies. Currently evaluating 2 other fractional operators. Decision timeline: 6-8 weeks.`,
      source: 'GRANOLA',
      contactId: nina.id,
    },
  })

  // Activities
  await prisma.activity.create({
    data: {
      type: 'MEETING',
      date: daysAgo(2),
      subject: 'Q1 strategy call',
      body: '45-minute video call to review Q1 roadmap',
      contactId: sarah.id,
    },
  })

  await prisma.activity.create({
    data: {
      type: 'EMAIL',
      date: daysAgo(5),
      subject: 'Re: Advisory framework deck',
      body: 'Sent the updated deck. Sarah acknowledged receipt.',
      contactId: sarah.id,
    },
  })

  await prisma.activity.create({
    data: {
      type: 'CALL',
      date: daysAgo(7),
      subject: 'Intro call — exploring advisory fit',
      body: '30-min call. Discussed Series B timeline and advisory scope.',
      contactId: marcus.id,
    },
  })

  await prisma.activity.create({
    data: {
      type: 'WHATSAPP',
      date: daysAgo(1),
      subject: 'Post-demo follow-up',
      body: 'James confirmed interest in enterprise tier. CFO loop-in next week.',
      contactId: james.id,
    },
  })

  await prisma.activity.create({
    data: {
      type: 'MEETING',
      date: daysAgo(10),
      subject: 'Coffee — first meeting',
      body: 'In-person at Workshop Coffee. Positive first impression.',
      contactId: nina.id,
    },
  })

  await prisma.activity.create({
    data: {
      type: 'EMAIL',
      date: daysAgo(14),
      subject: 'Cold outreach',
      body: 'Sent personalised cold outreach referencing her recent podcast appearance.',
      contactId: priya.id,
    },
  })

  // Memo
  const memo = await prisma.memo.create({
    data: {
      title: 'Q2 2026 Inner Circle Investment Memo',
      quarter: 'Q2 2026',
      status: 'DRAFT',
      dueDate: new Date('2026-06-30'),
      content: `# Q2 2026 Inner Circle Memo

**To:** Inner Circle
**From:** [Your Name], Pin Labs
**Date:** [Draft]
**Quarter:** Q2 2026

---

## Portfolio Overview

[Summary of current engagements and key metrics this quarter]

## Deal Flow Highlights

### Opportunities Reviewed
- [Company A] — [Stage] — [Brief thesis]
- [Company B] — [Stage] — [Brief thesis]

## Key Relationships Update

[Updates on key network movements, new introductions made, and relationships deepened]

## Ask of the Inner Circle

1. [Specific intro request]
2. [Feedback request]
3. [Co-investment interest check]

## What's Coming in Q3

[Pipeline preview and upcoming focus areas]

---

*Reply to this memo with any leads, intros, or feedback. All responses tracked.*`,
    },
  })

  await prisma.memoResponse.create({
    data: {
      content: 'Great memo! I can intro you to the CTO at Company B — they just closed Series A and are looking for fractional help.',
      contactId: sarah.id,
      memoId: memo.id,
    },
  })

  // Settings
  await prisma.setting.create({
    data: { key: 'nextMemoDueDate', value: '2026-06-30' },
  })
  await prisma.setting.create({
    data: { key: 'nextMemoQuarter', value: 'Q2 2026' },
  })
  await prisma.setting.create({
    data: {
      key: 'memoTemplate',
      value: `# [Quarter] Inner Circle Investment Memo

**To:** Inner Circle
**From:** [Your Name], Pin Labs
**Date:** [Draft]
**Quarter:** [Quarter]

---

## Portfolio Overview

[Summary of current engagements and key metrics this quarter]

## Deal Flow Highlights

### Opportunities Reviewed
- [Company A] — [Stage] — [Brief thesis]
- [Company B] — [Stage] — [Brief thesis]

## Key Relationships Update

[Updates on key network movements, new introductions made, and relationships deepened]

## Ask of the Inner Circle

1. [Specific intro request]
2. [Feedback request]
3. [Co-investment interest check]

## What's Coming in Next Quarter

[Pipeline preview and upcoming focus areas]

---

*Reply to this memo with any leads, intros, or feedback. All responses tracked.*`,
    },
  })

  console.log('Seed complete.')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
