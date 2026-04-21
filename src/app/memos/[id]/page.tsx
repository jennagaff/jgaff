import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import PageHeader from '@/components/layout/PageHeader'
import ResponseList from '@/components/memos/ResponseList'
import MemoStatusButtons from '@/components/memos/MemoStatusButtons'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const memo = await prisma.memo.findUnique({ where: { id }, select: { title: true } })
  return { title: `${memo?.title ?? 'Memo'} — Pin Labs CRM` }
}

export default async function MemoDetailPage({ params }: { params: Promise<{ id: string }> }) {
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
  if (!memo) notFound()

  const innerCircle = await prisma.contact.findMany({
    where: { segment: 'INNER_CIRCLE' },
    select: { id: true, name: true, company: true },
    orderBy: { name: 'asc' },
  })

  const statusVariant: Record<string, 'gray' | 'blue' | 'green'> = {
    DRAFT: 'gray', SENT: 'green', ARCHIVED: 'blue',
  }

  return (
    <div>
      <PageHeader
        title={memo.title}
        description={`${memo.quarter} · Due ${formatDate(memo.dueDate)}`}
        action={
          <div className="flex gap-2">
            <Link href={`/memos/${id}/edit`}>
              <Button variant="secondary" size="sm">Edit</Button>
            </Link>
          </div>
        }
      />

      <div className="flex items-center gap-3 mb-6">
        <Badge variant={statusVariant[memo.status] ?? 'gray'}>{memo.status}</Badge>
        {memo.sentAt && <span className="text-sm text-gray-500">Sent {formatDate(memo.sentAt)}</span>}
        <MemoStatusButtons memoId={id} currentStatus={memo.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Memo content */}
        <div className="lg:col-span-3">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Memo Content</h2>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">{memo.content}</pre>
          </div>
        </div>

        {/* Responses */}
        <div className="lg:col-span-2">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">
            Inner Circle Responses ({memo.responses.length}/{innerCircle.length})
          </h2>
          <ResponseList
            memoId={id}
            responses={memo.responses}
            innerCircle={innerCircle}
          />
        </div>
      </div>
    </div>
  )
}
