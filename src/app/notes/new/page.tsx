import PageHeader from '@/components/layout/PageHeader'
import NoteForm from '@/components/notes/NoteForm'

export const metadata = { title: 'New Note — Pin Labs CRM' }

interface Props {
  searchParams: Promise<{ contactId?: string }>
}

export default async function NewNotePage({ searchParams }: Props) {
  const { contactId } = await searchParams
  return (
    <div>
      <PageHeader title="New Note" description="Paste from Granola, WhatsApp, email, or type manually" />
      <NoteForm preContactId={contactId} />
    </div>
  )
}
