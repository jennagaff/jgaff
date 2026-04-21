import { prisma } from '@/lib/prisma'
import PageHeader from '@/components/layout/PageHeader'
import MemoForm from '@/components/memos/MemoForm'
import { getCurrentQuarter, getQuarterEndDate } from '@/lib/utils'

export const metadata = { title: 'New Memo — Pin Labs CRM' }

export default async function NewMemoPage() {
  const settings = await prisma.setting.findMany()
  const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]))

  const quarter = getCurrentQuarter()
  const dueDate = settingsMap.nextMemoDueDate
    ? new Date(settingsMap.nextMemoDueDate).toISOString().slice(0, 10)
    : getQuarterEndDate(quarter).toISOString().slice(0, 10)

  return (
    <div>
      <PageHeader title="New Quarterly Memo" description="Pre-filled from your template in Settings" />
      <MemoForm
        initial={{
          title: `${quarter} Inner Circle Investment Memo`,
          quarter,
          dueDate,
          content: settingsMap.memoTemplate ?? '',
        }}
      />
    </div>
  )
}
