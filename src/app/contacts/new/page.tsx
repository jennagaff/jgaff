import PageHeader from '@/components/layout/PageHeader'
import ContactForm from '@/components/contacts/ContactForm'

export const metadata = { title: 'New Contact — Pin Labs CRM' }

export default function NewContactPage() {
  return (
    <div>
      <PageHeader title="New Contact" description="Add someone to your network" />
      <ContactForm />
    </div>
  )
}
