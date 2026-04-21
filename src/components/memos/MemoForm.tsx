'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

interface MemoFormProps {
  initial?: {
    id?: string
    title?: string
    quarter?: string
    dueDate?: string
    content?: string
  }
}

export default function MemoForm({ initial = {} }: MemoFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    title: initial.title ?? '',
    quarter: initial.quarter ?? '',
    dueDate: initial.dueDate ?? '',
    content: initial.content ?? '',
  })

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const body = { ...form, dueDate: new Date(form.dueDate).toISOString() }
    const url = initial.id ? `/api/memos/${initial.id}` : '/api/memos'
    const method = initial.id ? 'PATCH' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    const data = await res.json()
    setSaving(false)
    router.push(`/memos/${data.id}`)
    router.refresh()
  }

  return (
    <form onSubmit={submit} className="max-w-3xl space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <Input id="title" label="Memo title *" className="col-span-2" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} required />
        <Input id="quarter" label="Quarter" value={form.quarter} onChange={(e) => setForm((f) => ({ ...f, quarter: e.target.value }))} placeholder="Q2 2026" />
      </div>
      <Input id="dueDate" label="Due date" type="date" value={form.dueDate} onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))} />
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Memo content *</label>
        <textarea
          value={form.content}
          onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
          rows={20}
          required
          placeholder="Paste or type your memo content here…"
          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-y"
        />
      </div>
      <div className="flex gap-3">
        <Button type="submit" disabled={saving || !form.title || !form.content}>
          {saving ? 'Saving…' : initial.id ? 'Update memo' : 'Create memo'}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.back()}>Cancel</Button>
      </div>
    </form>
  )
}
