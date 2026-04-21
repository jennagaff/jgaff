import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import PageHeader from '@/components/layout/PageHeader'
import SegmentBadge from '@/components/contacts/SegmentBadge'
import StageBadge from '@/components/contacts/StageBadge'
import NoteCard from '@/components/notes/NoteCard'
import ActivityTimeline from '@/components/activities/ActivityTimeline'
import StageSelector from '@/components/contacts/StageSelector'
import ActivityForm from '@/components/activities/ActivityForm'
import Button from '@/components/ui/Button'
import { Building2, Mail, Phone, Link2, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const contact = await prisma.contact.findUnique({ where: { id }, select: { name: true } })
  return { title: `${contact?.name ?? 'Contact'} — Pin Labs CRM` }
}

export default async function ContactDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const contact = await prisma.contact.findUnique({
    where: { id },
    include: {
      notes: { orderBy: { createdAt: 'desc' } },
      activities: { orderBy: { date: 'desc' } },
    },
  })

  if (!contact) notFound()

  return (
    <div>
      <PageHeader
        title={contact.name}
        description={formatDate(contact.createdAt) + ' · added'}
        action={
          <Link href={`/contacts/${id}/edit`}>
            <Button variant="secondary" size="sm">Edit</Button>
          </Link>
        }
      />

      {/* Header info row */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <SegmentBadge segment={contact.segment} />
        <StageBadge stage={contact.stage} />
        {(contact.title || contact.company) && (
          <span className="text-sm text-gray-500 flex items-center gap-1">
            <Building2 className="h-4 w-4" />
            {[contact.title, contact.company].filter(Boolean).join(' · ')}
          </span>
        )}
        {contact.email && (
          <span className="text-sm text-gray-500 flex items-center gap-1">
            <Mail className="h-4 w-4" /> {contact.email}
          </span>
        )}
        {contact.phone && (
          <span className="text-sm text-gray-500 flex items-center gap-1">
            <Phone className="h-4 w-4" /> {contact.phone}
          </span>
        )}
        {contact.linkedinUrl && (
          <a href={contact.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 flex items-center gap-1 hover:underline">
            <Link2 className="h-4 w-4" /> LinkedIn <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: notes + timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Notes */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-900">Notes ({contact.notes.length})</h2>
              <Link href={`/notes/new?contactId=${id}`}>
                <Button size="sm" variant="secondary">+ Add note</Button>
              </Link>
            </div>
            {contact.notes.length === 0 ? (
              <p className="text-sm text-gray-400 italic">No notes yet.</p>
            ) : (
              <div className="space-y-3">
                {contact.notes.map((n) => <NoteCard key={n.id} note={n} />)}
              </div>
            )}
          </div>

          {/* Activity Timeline */}
          <div>
            <h2 className="text-sm font-semibold text-gray-900 mb-3">Activity ({contact.activities.length})</h2>
            <ActivityForm contactId={id} />
            <ActivityTimeline activities={contact.activities} />
          </div>
        </div>

        {/* Right: stage + quick info */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Pipeline Stage</h3>
            <StageSelector contactId={id} currentStage={contact.stage} />
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Source</h3>
            <p className="text-sm text-gray-700 capitalize">{contact.source.toLowerCase().replace('_', ' ')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
