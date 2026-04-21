import { prisma } from '@/lib/prisma'
import PageHeader from '@/components/layout/PageHeader'
import NoteCard from '@/components/notes/NoteCard'
import EmptyState from '@/components/ui/EmptyState'
import Button from '@/components/ui/Button'
import NotesSearch from '@/components/notes/NotesSearch'
import { FileText } from 'lucide-react'
import Link from 'next/link'

export const metadata = { title: 'Notes — Pin Labs CRM' }

interface Props {
  searchParams: Promise<{ q?: string }>
}

export default async function NotesPage({ searchParams }: Props) {
  const { q } = await searchParams

  const notes = await prisma.note.findMany({
    where: q ? { content: { contains: q } } : undefined,
    include: { contact: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <PageHeader
        title="Notes"
        description={`${notes.length} note${notes.length !== 1 ? 's' : ''}`}
        action={
          <Link href="/notes/new">
            <Button size="sm">+ Add note</Button>
          </Link>
        }
      />
      <NotesSearch defaultValue={q} />
      {notes.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No notes yet"
          description="Paste meeting notes from Granola, email excerpts, or WhatsApp conversations."
          action={{ label: '+ Add note', href: '/notes/new' }}
        />
      ) : (
        <div className="space-y-3 mt-4">
          {notes.map((n) => (
            <NoteCard key={n.id} note={n} contactName={n.contact?.name} />
          ))}
        </div>
      )}
    </div>
  )
}
