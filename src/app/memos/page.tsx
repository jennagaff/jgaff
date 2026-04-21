import { prisma } from '@/lib/prisma'
import PageHeader from '@/components/layout/PageHeader'
import MemoCard from '@/components/memos/MemoCard'
import EmptyState from '@/components/ui/EmptyState'
import Button from '@/components/ui/Button'
import { BookOpen } from 'lucide-react'
import Link from 'next/link'

export const metadata = { title: 'Memos — Pin Labs CRM' }

export default async function MemosPage() {
  const memos = await prisma.memo.findMany({
    include: { _count: { select: { responses: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <PageHeader
        title="Inner Circle Memos"
        description="Quarterly investment memos sent to your Inner Circle"
        action={
          <Link href="/memos/new">
            <Button size="sm">+ New memo</Button>
          </Link>
        }
      />
      {memos.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No memos yet"
          description="Create your first quarterly Inner Circle memo. Paste your template in Settings first."
          action={{ label: '+ New memo', href: '/memos/new' }}
        />
      ) : (
        <div className="space-y-3">
          {memos.map((m) => <MemoCard key={m.id} memo={m} />)}
        </div>
      )}
    </div>
  )
}
