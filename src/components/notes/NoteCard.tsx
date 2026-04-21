import SourceBadge from './SourceBadge'
import { formatRelative } from '@/lib/utils'

interface NoteCardProps {
  note: {
    id: string
    title?: string | null
    content: string
    source: string
    createdAt: Date
  }
  contactName?: string
}

export default function NoteCard({ note, contactName }: NoteCardProps) {
  const preview = note.content.length > 300 ? note.content.slice(0, 300) + '…' : note.content

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1 min-w-0">
          {note.title && <h3 className="text-sm font-semibold text-gray-900 truncate">{note.title}</h3>}
          {contactName && <p className="text-xs text-indigo-600">{contactName}</p>}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <SourceBadge source={note.source} />
          <span className="text-xs text-gray-400">{formatRelative(note.createdAt)}</span>
        </div>
      </div>
      <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">{preview}</p>
    </div>
  )
}
