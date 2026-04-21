import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import PageHeader from '@/components/layout/PageHeader'
import MemoForm from '@/components/memos/MemoForm'

export default async function EditMemoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const memo = await prisma.memo.findUnique({ where: { id } })
  if (!memo) notFound()

  return (
    <div>
      <PageHeader title="Edit Memo" />
      <MemoForm
        initial={{
          id: memo.id,
          title: memo.title,
          quarter: memo.quarter,
          dueDate: memo.dueDate.toISOString().slice(0, 10),
          content: memo.content,
        }}
      />
    </div>
  )
}
