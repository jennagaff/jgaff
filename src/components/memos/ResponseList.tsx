'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import { formatRelative } from '@/lib/utils'
import { CheckCircle, Circle } from 'lucide-react'

interface Contact {
  id: string
  name: string
  company?: string | null
}

interface Response {
  id: string
  content: string
  createdAt: Date
  contact: Contact
}

interface ResponseListProps {
  memoId: string
  responses: Response[]
  innerCircle: Contact[]
}

export default function ResponseList({ memoId, responses, innerCircle }: ResponseListProps) {
  const router = useRouter()
  const [addingFor, setAddingFor] = useState<string | null>(null)
  const [text, setText] = useState('')
  const [saving, setSaving] = useState(false)

  const respondedIds = new Set(responses.map((r) => r.contact.id))
  const pending = innerCircle.filter((c) => !respondedIds.has(c.id))

  async function addResponse(contactId: string) {
    if (!text.trim()) return
    setSaving(true)
    await fetch(`/api/memos/${memoId}/responses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contactId, content: text }),
    })
    setSaving(false)
    setAddingFor(null)
    setText('')
    router.refresh()
  }

  return (
    <div className="space-y-6">
      {/* Received responses */}
      {responses.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Responses received ({responses.length})
          </h3>
          <div className="space-y-3">
            {responses.map((r) => (
              <div key={r.id} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium text-gray-900">{r.contact.name}</span>
                  {r.contact.company && <span className="text-xs text-gray-500">· {r.contact.company}</span>}
                  <span className="text-xs text-gray-400 ml-auto">{formatRelative(r.createdAt)}</span>
                </div>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{r.content}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pending inner circle */}
      {pending.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Awaiting response ({pending.length})
          </h3>
          <div className="space-y-2">
            {pending.map((c) => (
              <div key={c.id} className="bg-white rounded-xl border border-gray-200 p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Circle className="h-4 w-4 text-gray-300" />
                    <span className="text-sm text-gray-700">{c.name}</span>
                    {c.company && <span className="text-xs text-gray-400">· {c.company}</span>}
                  </div>
                  <Button size="sm" variant="secondary" onClick={() => setAddingFor(c.id)}>
                    Log response
                  </Button>
                </div>
                {addingFor === c.id && (
                  <div className="mt-3 space-y-2">
                    <textarea
                      autoFocus
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      rows={3}
                      placeholder="Paste or type their response…"
                      className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    <div className="flex gap-2">
                      <Button size="sm" disabled={saving || !text.trim()} onClick={() => addResponse(c.id)}>
                        {saving ? 'Saving…' : 'Save'}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => { setAddingFor(null); setText('') }}>Cancel</Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {innerCircle.length === 0 && (
        <p className="text-sm text-gray-400 italic">Add contacts to your Inner Circle segment to track memo responses.</p>
      )}
    </div>
  )
}
