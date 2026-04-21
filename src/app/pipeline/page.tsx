import { prisma } from '@/lib/prisma'
import PageHeader from '@/components/layout/PageHeader'
import KanbanColumn from '@/components/pipeline/KanbanColumn'

export const metadata = { title: 'Pipeline — Pin Labs CRM' }

const columns = [
  { stage: 'LEAD', title: 'Leads', colorClass: 'bg-blue-100 text-blue-800' },
  { stage: 'OPPORTUNITY', title: 'Opportunities', colorClass: 'bg-green-100 text-green-800' },
  { stage: 'CLOSED_WON', title: 'Closed Won', colorClass: 'bg-teal-100 text-teal-800' },
  { stage: 'CLOSED_LOST', title: 'Closed Lost', colorClass: 'bg-red-100 text-red-800' },
]

export default async function PipelinePage() {
  const contacts = await prisma.contact.findMany({
    select: {
      id: true,
      name: true,
      company: true,
      title: true,
      stage: true,
      segment: true,
      updatedAt: true,
      _count: { select: { activities: true } },
    },
    orderBy: { updatedAt: 'desc' },
  })

  const grouped = Object.fromEntries(
    columns.map((col) => [col.stage, contacts.filter((c) => c.stage === col.stage)])
  )

  return (
    <div>
      <PageHeader title="Pipeline" description={`${contacts.length} total contacts`} />
      <div className="grid grid-cols-4 gap-3">
        {columns.map((col) => (
          <KanbanColumn
            key={col.stage}
            title={col.title}
            stage={col.stage}
            contacts={grouped[col.stage] ?? []}
            colorClass={col.colorClass}
          />
        ))}
      </div>
    </div>
  )
}
