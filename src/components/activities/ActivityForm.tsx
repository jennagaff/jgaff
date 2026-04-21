'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Select from '@/components/ui/Select'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function ActivityForm({ contactId }: { contactId: string }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    type: 'EMAIL',
    subject: '',
    body: '',
    date: new Date().toISOString().slice(0, 16),
  })

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-xs text-indigo-600 hover:underline mb-4 block"
      >
        + Log activity
      </button>
    )
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await fetch('/api/activities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, date: new Date(form.date).toISOString(), contactId }),
    })
    setOpen(false)
    setSaving(false)
    setForm({ type: 'EMAIL', subject: '', body: '', date: new Date().toISOString().slice(0, 16) })
    router.refresh()
  }

  return (
    <form onSubmit={submit} className="bg-gray-50 rounded-xl p-4 mb-4 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Select id="type" label="Type" value={form.type} onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}>
          <option value="EMAIL">Email</option>
          <option value="MEETING">Meeting</option>
          <option value="CALL">Call</option>
          <option value="WHATSAPP">WhatsApp</option>
          <option value="TEXT">Text / SMS</option>
        </Select>
        <Input id="date" label="Date" type="datetime-local" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />
      </div>
      <Input id="subject" label="Subject *" value={form.subject} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} required />
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Notes</label>
        <textarea
          rows={2}
          value={form.body}
          onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={saving || !form.subject}>{saving ? 'Saving…' : 'Log'}</Button>
        <Button type="button" size="sm" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
      </div>
    </form>
  )
}
