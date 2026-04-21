import PageHeader from '@/components/layout/PageHeader'
import LinkedInImport from '@/components/contacts/LinkedInImport'

export const metadata = { title: 'Import from LinkedIn — Pin Labs CRM' }

export default function ImportPage() {
  return (
    <div>
      <PageHeader
        title="Import from LinkedIn"
        description="Upload a LinkedIn connections CSV export to bulk-add contacts"
      />
      <LinkedInImport />
    </div>
  )
}
