'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import Button from '@/components/ui/Button'

export default function MemoStatusButtons({ memoId, currentStatus }: { memoId: string; currentStatus: string }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)

  async function updateStatus(status: string) {
    setSaving(true)
    const body: Record<string, unknown> = { status }
    if (status === 'SENT') body.sentAt = new Date().toISOString()
    await fetch(`/api/memos/${memoId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    setSaving(false)
    router.refresh()
  }

  return (
    <div className="flex gap-2">
      {currentStatus === 'DRAFT' && (
        <Button size="sm" disabled={saving} onClick={() => updateStatus('SENT')}>
          Mark as sent
        </Button>
      )}
      {currentStatus === 'SENT' && (
        <Button size="sm" variant="secondary" disabled={saving} onClick={() => updateStatus('ARCHIVED')}>
          Archive
        </Button>
      )}
    </div>
  )
}
