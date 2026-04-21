'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'

interface NoteFormProps {
  preContactId?: string
}

export default function NoteForm({ preContactId }: NoteFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [contactSearch, setContactSearch] = useState('')
  const [contacts, setContacts] = useState<{ id: string; name: string; company?: string | null }[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [form, setForm] = useState({
    title: '',
    content: '',
    source: 'MANUAL',
    contactId: preContactId ?? '',
    contactName: '',
  })

  useEffect(() => {
    if (preContactId) {
      fetch(`/api/contacts/${preContactId}`)
        .then((r) => r.json())
        .then((c) => setForm((f) => ({ ...f, contactName: c.name })))
    }
  }, [preContactId])

  async function searchContacts(q: string) {
    if (!q) { setContacts([]); setShowDropdown(false); return }
    const res = await fetch(`/api/contacts?q=${encodeURIComponent(q)}`)
    const data = await res.json()
    setContacts(data.slice(0, 6))
    setShowDropdown(true)
  }

  function selectContact(c: { id: string; name: string }) {
    setForm((f) => ({ ...f, contactId: c.id, contactName: c.name }))
    setContactSearch('')
    setShowDropdown(false)
  }

  function onPaste(e: React.ClipboardEvent<HTMLTextAreaElement>) {
    const text = e.clipboardData.getData('text')
    const firstLine = text.split('\n')[0].replace(/^#+\s*/, '').trim()
    if (firstLine && !form.title) {
      setTimeout(() => setForm((f) => ({ ...f, title: firstLine })), 0)
    }
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.content) return
    setSaving(true)
    await fetch('/api/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: form.title || undefined,
        content: form.content,
        source: form.source,
        contactId: form.contactId || undefined,
      }),
    })
    setSaving(false)
    if (form.contactId) router.push(`/contacts/${form.contactId}`)
    else router.push('/notes')
    router.refresh()
  }

  return (
    <form onSubmit={submit} className="max-w-2xl space-y-4">
      <Select id="source" label="Source" value={form.source} onChange={(e) => setForm((f) => ({ ...f, source: e.target.value }))}>
        <option value="GRANOLA">Granola (meeting notes)</option>
        <option value="EMAIL">Email</option>
        <option value="WHATSAPP">WhatsApp</option>
        <option value="SMS">SMS</option>
        <option value="MANUAL">Manual</option>
      </Select>

      <Input id="title" label="Title (optional)" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="Auto-fills from paste…" />

      {/* Contact picker */}
      <div className="relative flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Contact</label>
        {form.contactId ? (
          <div className="flex items-center gap-2">
            <span className="text-sm text-indigo-700 font-medium">{form.contactName}</span>
            <button type="button" className="text-xs text-gray-400 hover:text-red-500" onClick={() => setForm((f) => ({ ...f, contactId: '', contactName: '' }))}>✕</button>
          </div>
        ) : (
          <div className="relative">
            <input
              type="text"
              value={contactSearch}
              onChange={(e) => { setContactSearch(e.target.value); searchContacts(e.target.value) }}
              placeholder="Search by name…"
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
            {showDropdown && contacts.length > 0 && (
              <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                {contacts.map((c) => (
                  <li key={c.id}>
                    <button type="button" onClick={() => selectContact(c)} className="w-full text-left px-3 py-2 text-sm hover:bg-indigo-50">
                      {c.name} {c.company && <span className="text-gray-400">· {c.company}</span>}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Note *</label>
        <textarea
          value={form.content}
          onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
          onPaste={onPaste}
          rows={10}
          required
          placeholder="Paste from Granola, WhatsApp, email — or type your notes here…"
          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-y"
        />
      </div>

      <div className="flex gap-3">
        <Button type="submit" disabled={saving || !form.content}>
          {saving ? 'Saving…' : 'Save note'}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.back()}>Cancel</Button>
      </div>
    </form>
  )
}
