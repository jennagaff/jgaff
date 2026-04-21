'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const segments = [
  { label: 'All', value: '' },
  { label: 'Dream 50', value: 'DREAM_50' },
  { label: 'Inner Circle', value: 'INNER_CIRCLE' },
  { label: 'General', value: 'GENERAL' },
]

const stages = [
  { label: 'All stages', value: '' },
  { label: 'Lead', value: 'LEAD' },
  { label: 'Opportunity', value: 'OPPORTUNITY' },
  { label: 'Closed Won', value: 'CLOSED_WON' },
  { label: 'Closed Lost', value: 'CLOSED_LOST' },
]

export default function ContactFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const currentSegment = params.get('segment') ?? ''
  const currentStage = params.get('stage') ?? ''

  function nav(key: string, value: string) {
    const p = new URLSearchParams(params.toString())
    if (value) p.set(key, value)
    else p.delete(key)
    router.push(`${pathname}?${p.toString()}`)
  }

  return (
    <div className="flex flex-wrap gap-4 mb-2">
      <div className="flex gap-1 flex-wrap">
        {segments.map((s) => (
          <button
            key={s.value}
            onClick={() => nav('segment', s.value)}
            className={cn(
              'px-3 py-1 rounded-full text-xs font-medium transition-colors',
              currentSegment === s.value
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
          >
            {s.label}
          </button>
        ))}
      </div>
      <div className="flex gap-1 flex-wrap">
        {stages.map((s) => (
          <button
            key={s.value}
            onClick={() => nav('stage', s.value)}
            className={cn(
              'px-3 py-1 rounded-full text-xs font-medium transition-colors',
              currentStage === s.value
                ? 'bg-gray-700 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  )
}
