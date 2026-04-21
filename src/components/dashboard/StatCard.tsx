import { LucideIcon } from 'lucide-react'
import Link from 'next/link'

interface StatCardProps {
  label: string
  value: number | string
  icon: LucideIcon
  href?: string
  sub?: string
}

export default function StatCard({ label, value, icon: Icon, href, sub }: StatCardProps) {
  const inner = (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:border-indigo-300 hover:shadow-sm transition-all">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
        <div className="bg-indigo-50 rounded-lg p-2">
          <Icon className="h-4 w-4 text-indigo-600" />
        </div>
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
    </div>
  )

  return href ? <Link href={href}>{inner}</Link> : inner
}
