'use client'

import { useRouter } from 'next/navigation'
import Card from '@/components/ui/Card'
import SegmentBadge from './SegmentBadge'
import StageBadge from './StageBadge'
import { Building2, Mail, Phone } from 'lucide-react'

interface ContactCardProps {
  contact: {
    id: string
    name: string
    email?: string | null
    phone?: string | null
    company?: string | null
    title?: string | null
    segment: string
    stage: string
    _count?: { notes: number; activities: number }
  }
}

export default function ContactCard({ contact }: ContactCardProps) {
  const router = useRouter()
  return (
    <Card onClick={() => router.push(`/contacts/${contact.id}`)} className="p-4">
      <div className="flex items-start justify-between mb-2">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">{contact.name}</h3>
          {(contact.title || contact.company) && (
            <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
              <Building2 className="h-3 w-3" />
              {[contact.title, contact.company].filter(Boolean).join(' · ')}
            </p>
          )}
        </div>
        <SegmentBadge segment={contact.segment} />
      </div>
      <div className="flex flex-col gap-1 mb-3">
        {contact.email && (
          <p className="text-xs text-gray-400 flex items-center gap-1">
            <Mail className="h-3 w-3" /> {contact.email}
          </p>
        )}
        {contact.phone && (
          <p className="text-xs text-gray-400 flex items-center gap-1">
            <Phone className="h-3 w-3" /> {contact.phone}
          </p>
        )}
      </div>
      <div className="flex items-center justify-between">
        <StageBadge stage={contact.stage} />
        {contact._count && (
          <span className="text-xs text-gray-400">
            {contact._count.notes}n · {contact._count.activities}a
          </span>
        )}
      </div>
    </Card>
  )
}
