import Link from 'next/link'
import Badge from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'
import { BookOpen } from 'lucide-react'

interface MemoCardProps {
  memo: {
    id: string
    title: string
    quarter: string
    status: string
    dueDate: Date
    sentAt?: Date | null
    _count?: { responses: number }
  }
}

const statusVariant: Record<string, 'gray' | 'blue' | 'green'> = {
  DRAFT: 'gray',
  SENT: 'green',
  ARCHIVED: 'blue',
}

export default function MemoCard({ memo }: MemoCardProps) {
  return (
    <Link href={`/memos/${memo.id}`}>
      <div className="bg-white rounded-xl border border-gray-200 p-4 hover:border-indigo-300 hover:shadow-sm transition-all cursor-pointer">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-gray-400" />
            <h3 className="text-sm font-semibold text-gray-900">{memo.title}</h3>
          </div>
          <Badge variant={statusVariant[memo.status] ?? 'gray'}>{memo.status}</Badge>
        </div>
        <p className="text-xs text-gray-500 mb-2">{memo.quarter}</p>
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span>Due {formatDate(memo.dueDate)}</span>
          {memo.sentAt && <span>Sent {formatDate(memo.sentAt)}</span>}
          {memo._count && <span>{memo._count.responses} response{memo._count.responses !== 1 ? 's' : ''}</span>}
        </div>
      </div>
    </Link>
  )
}
