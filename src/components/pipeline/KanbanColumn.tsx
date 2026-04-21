'use client'

import { useRouter } from 'next/navigation'
import SegmentBadge from '@/components/contacts/SegmentBadge'
import { formatRelative } from '@/lib/utils'

interface Contact {
  id: string
  name: string
  company?: string | null
  title?: string | null
  segment: string
  updatedAt: Date
  _count: { activities: number }
}

interface KanbanColumnProps {
  title: string
  stage: string
  contacts: Contact[]
  colorClass: string
}

export default function KanbanColumn({ title, contacts, colorClass }: KanbanColumnProps) {
  const router = useRouter()

  return (
    <div className="flex flex-col min-w-0">
      <div className={`rounded-t-lg px-3 py-2 ${colorClass}`}>
        <span className="text-xs font-semibold uppercase tracking-wide">{title}</span>
        <span className="ml-2 text-xs opacity-70">{contacts.length}</span>
      </div>
      <div className="bg-gray-50 rounded-b-lg flex-1 p-2 space-y-2 min-h-[200px]">
        {contacts.map((c) => (
          <div
            key={c.id}
            onClick={() => router.push(`/contacts/${c.id}`)}
            className="bg-white rounded-lg border border-gray-200 p-3 cursor-pointer hover:border-indigo-300 hover:shadow-sm transition-all"
          >
            <p className="text-sm font-medium text-gray-900">{c.name}</p>
            {(c.title || c.company) && (
              <p className="text-xs text-gray-500 mt-0.5">{[c.title, c.company].filter(Boolean).join(' · ')}</p>
            )}
            <div className="flex items-center justify-between mt-2">
              <SegmentBadge segment={c.segment} />
              <span className="text-xs text-gray-400">{formatRelative(c.updatedAt)}</span>
            </div>
          </div>
        ))}
        {contacts.length === 0 && <p className="text-xs text-gray-400 text-center py-4">Empty</p>}
      </div>
    </div>
  )
}
