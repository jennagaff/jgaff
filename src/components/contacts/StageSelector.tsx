'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const stages = [
  { value: 'LEAD', label: 'Lead', color: 'bg-blue-100 text-blue-700 border-blue-200' },
  { value: 'OPPORTUNITY', label: 'Opportunity', color: 'bg-green-100 text-green-700 border-green-200' },
  { value: 'CLOSED_WON', label: 'Closed Won', color: 'bg-teal-100 text-teal-700 border-teal-200' },
  { value: 'CLOSED_LOST', label: 'Closed Lost', color: 'bg-red-100 text-red-700 border-red-200' },
]

export default function StageSelector({ contactId, currentStage }: { contactId: string; currentStage: string }) {
  const router = useRouter()
  const [stage, setStage] = useState(currentStage)
  const [saving, setSaving] = useState(false)

  async function update(newStage: string) {
    setSaving(true)
    await fetch(`/api/contacts/${contactId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage: newStage }),
    })
    setStage(newStage)
    setSaving(false)
    router.refresh()
  }

  return (
    <div className="space-y-1.5">
      {stages.map((s) => (
        <button
          key={s.value}
          onClick={() => update(s.value)}
          disabled={saving}
          className={cn(
            'w-full text-left px-3 py-2 rounded-lg text-xs font-medium border transition-all',
            stage === s.value ? s.color : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
          )}
        >
          {stage === s.value ? '✓ ' : ''}{s.label}
        </button>
      ))}
    </div>
  )
}
