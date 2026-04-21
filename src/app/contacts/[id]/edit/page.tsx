import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import PageHeader from '@/components/layout/PageHeader'
import ContactForm from '@/components/contacts/ContactForm'

export default async function EditContactPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const contact = await prisma.contact.findUnique({ where: { id } })
  if (!contact) notFound()

  return (
    <div>
      <PageHeader title="Edit Contact" />
      <ContactForm
        initial={{
          id: contact.id,
          name: contact.name,
          email: contact.email ?? '',
          phone: contact.phone ?? '',
          company: contact.company ?? '',
          title: contact.title ?? '',
          linkedinUrl: contact.linkedinUrl ?? '',
          segment: contact.segment,
          stage: contact.stage,
          source: contact.source,
        }}
      />
    </div>
  )
}
