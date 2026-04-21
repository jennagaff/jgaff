import { prisma } from '@/lib/prisma'
import PageHeader from '@/components/layout/PageHeader'
import SettingsForm from '@/components/settings/SettingsForm'

export const metadata = { title: 'Settings — Pin Labs CRM' }

export default async function SettingsPage() {
  const settings = await prisma.setting.findMany()
  const map = Object.fromEntries(settings.map((s) => [s.key, s.value]))

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Configure your memo template and next quarterly due date"
      />
      <SettingsForm initial={map} />
    </div>
  )
}
