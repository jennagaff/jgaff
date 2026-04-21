import { prisma } from '@/lib/prisma'
import PageHeader from '@/components/layout/PageHeader'
import ContactCard from '@/components/contacts/ContactCard'
import ContactFilters from '@/components/contacts/ContactFilters'
import EmptyState from '@/components/ui/EmptyState'
import Button from '@/components/ui/Button'
import { Users } from 'lucide-react'
import Link from 'next/link'
import { Segment, Stage } from '@/generated/prisma/client'

export const metadata = { title: 'Contacts — Pin Labs CRM' }

interface Props {
  searchParams: Promise<{ segment?: string; stage?: string; q?: string }>
}

export default async function ContactsPage({ searchParams }: Props) {
  const { segment, stage, q } = await searchParams

  const contacts = await prisma.contact.findMany({
    where: {
      ...(segment && { segment: segment as Segment }),
      ...(stage && { stage: stage as Stage }),
      ...(q && {
        OR: [
          { name: { contains: q } },
          { email: { contains: q } },
          { company: { contains: q } },
        ],
      }),
    },
    include: { _count: { select: { notes: true, activities: true } } },
    orderBy: { updatedAt: 'desc' },
  })

  const title = segment === 'DREAM_50' ? 'Dream 50' : segment === 'INNER_CIRCLE' ? 'Inner Circle' : 'All Contacts'

  return (
    <div>
      <PageHeader
        title={title}
        description={`${contacts.length} contact${contacts.length !== 1 ? 's' : ''}`}
        action={
          <div className="flex gap-2">
            <Link href="/contacts/import">
              <Button variant="secondary" size="sm">Import LinkedIn CSV</Button>
            </Link>
            <Link href="/contacts/new">
              <Button size="sm">+ Add contact</Button>
            </Link>
          </div>
        }
      />
      <ContactFilters />
      {contacts.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No contacts yet"
          description="Add your first contact manually or import from a LinkedIn CSV export."
          action={{ label: '+ Add contact', href: '/contacts/new' }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {contacts.map((c) => (
            <ContactCard key={c.id} contact={c} />
          ))}
        </div>
      )}
    </div>
  )
}
