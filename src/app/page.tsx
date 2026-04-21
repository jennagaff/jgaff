import { prisma } from '@/lib/prisma'
import StatCard from '@/components/dashboard/StatCard'
import PipelineProgress from '@/components/dashboard/PipelineProgress'
import MemoCountdown from '@/components/dashboard/MemoCountdown'
import ActivityTimeline from '@/components/activities/ActivityTimeline'
import { Users, Star, Heart, TrendingUp } from 'lucide-react'

export const metadata = { title: 'Dashboard — Pin Labs CRM' }

export default async function DashboardPage() {
  const [totalContacts, dream50, innerCircle, opportunities, recentActivities, pipelineCounts, settings, lastMemo] =
    await Promise.all([
      prisma.contact.count(),
      prisma.contact.count({ where: { segment: 'DREAM_50' } }),
      prisma.contact.count({ where: { segment: 'INNER_CIRCLE' } }),
      prisma.contact.count({ where: { stage: 'OPPORTUNITY' } }),
      prisma.activity.findMany({
        take: 10,
        orderBy: { date: 'desc' },
        include: { contact: { select: { id: true, name: true } } },
      }),
      prisma.contact.groupBy({ by: ['stage'], _count: { id: true } }),
      prisma.setting.findMany(),
      prisma.memo.findFirst({ where: { status: 'SENT' }, orderBy: { sentAt: 'desc' } }),
    ])

  const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]))
  const stageCounts = Object.fromEntries(pipelineCounts.map((p) => [p.stage, p._count.id]))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Welcome back to Pin Labs CRM</p>
      </div>

      {/* Memo countdown */}
      <MemoCountdown
        dueDate={settingsMap.nextMemoDueDate}
        quarter={settingsMap.nextMemoQuarter}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total contacts" value={totalContacts} icon={Users} href="/contacts" />
        <StatCard label="Dream 50" value={dream50} icon={Star} href="/contacts?segment=DREAM_50" />
        <StatCard label="Inner Circle" value={innerCircle} icon={Heart} href="/contacts?segment=INNER_CIRCLE" />
        <StatCard
          label="Opportunities"
          value={opportunities}
          icon={TrendingUp}
          href="/pipeline"
          sub="open in pipeline"
        />
      </div>

      {/* Pipeline + Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <PipelineProgress counts={stageCounts} />
          {lastMemo && (
            <div className="bg-white rounded-xl border border-gray-200 p-4 text-sm text-gray-600">
              Last memo sent: <span className="font-medium text-gray-900">{lastMemo.title}</span>
            </div>
          )}
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Recent Activity</h3>
          <ActivityTimeline activities={recentActivities} />
        </div>
      </div>
    </div>
  )
}
