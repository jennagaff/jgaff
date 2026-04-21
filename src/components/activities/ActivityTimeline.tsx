import { Mail, Users, Phone, MessageCircle, MessageSquare } from 'lucide-react'
import { formatRelative } from '@/lib/utils'

const icons: Record<string, React.ComponentType<{ className?: string }>> = {
  EMAIL: Mail,
  MEETING: Users,
  CALL: Phone,
  WHATSAPP: MessageCircle,
  TEXT: MessageSquare,
}

const colors: Record<string, string> = {
  EMAIL: 'bg-blue-100 text-blue-600',
  MEETING: 'bg-purple-100 text-purple-600',
  CALL: 'bg-green-100 text-green-600',
  WHATSAPP: 'bg-green-100 text-green-600',
  TEXT: 'bg-teal-100 text-teal-600',
}

interface Activity {
  id: string
  type: string
  date: Date
  subject: string
  body?: string | null
  contact?: { name: string } | null
}

export default function ActivityTimeline({ activities }: { activities: Activity[] }) {
  if (!activities.length) return <p className="text-sm text-gray-400 italic">No activity logged yet.</p>

  return (
    <div className="space-y-3">
      {activities.map((a) => {
        const Icon = icons[a.type] ?? Mail
        const color = colors[a.type] ?? 'bg-gray-100 text-gray-600'
        return (
          <div key={a.id} className="flex gap-3">
            <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${color}`}>
              <Icon className="h-3.5 w-3.5" />
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-sm font-medium text-gray-900 truncate">{a.subject}</p>
                <span className="text-xs text-gray-400 shrink-0">{formatRelative(a.date)}</span>
              </div>
              {a.body && <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{a.body}</p>}
              {a.contact && <p className="text-xs text-indigo-500 mt-0.5">{a.contact.name}</p>}
            </div>
          </div>
        )
      })}
    </div>
  )
}
