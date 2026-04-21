'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'

interface ContactFormProps {
  initial?: {
    id?: string
    name?: string
    email?: string
    phone?: string
    company?: string
    title?: string
    linkedinUrl?: string
    segment?: string
    stage?: string
    source?: string
  }
}

export default function ContactForm({ initial = {} }: ContactFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: initial.name ?? '',
    email: initial.email ?? '',
    phone: initial.phone ?? '',
    company: initial.company ?? '',
    title: initial.title ?? '',
    linkedinUrl: initial.linkedinUrl ?? '',
    segment: initial.segment ?? 'GENERAL',
    stage: initial.stage ?? 'LEAD',
    source: initial.source ?? 'MANUAL',
  })

  function set(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const body = {
      ...form,
      email: form.email || undefined,
      phone: form.phone || undefined,
      company: form.company || undefined,
      title: form.title || undefined,
      linkedinUrl: form.linkedinUrl || undefined,
    }
    const url = initial.id ? `/api/contacts/${initial.id}` : '/api/contacts'
    const method = initial.id ? 'PATCH' : 'POST'
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    const data = await res.json()
    setSaving(false)
    router.push(`/contacts/${data.id}`)
    router.refresh()
  }

  return (
    <form onSubmit={submit} className="space-y-4 max-w-lg">
      <Input id="name" label="Full name *" value={form.name} onChange={(e) => set('name', e.target.value)} required />
      <div className="grid grid-cols-2 gap-4">
        <Input id="email" label="Email" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} />
        <Input id="phone" label="Phone" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input id="company" label="Company" value={form.company} onChange={(e) => set('company', e.target.value)} />
        <Input id="title" label="Title" value={form.title} onChange={(e) => set('title', e.target.value)} />
      </div>
      <Input id="linkedinUrl" label="LinkedIn URL" value={form.linkedinUrl} onChange={(e) => set('linkedinUrl', e.target.value)} placeholder="https://linkedin.com/in/..." />
      <div className="grid grid-cols-3 gap-4">
        <Select id="segment" label="Segment" value={form.segment} onChange={(e) => set('segment', e.target.value)}>
          <option value="GENERAL">General</option>
          <option value="DREAM_50">Dream 50</option>
          <option value="INNER_CIRCLE">Inner Circle</option>
        </Select>
        <Select id="stage" label="Stage" value={form.stage} onChange={(e) => set('stage', e.target.value)}>
          <option value="LEAD">Lead</option>
          <option value="OPPORTUNITY">Opportunity</option>
          <option value="CLOSED_WON">Closed Won</option>
          <option value="CLOSED_LOST">Closed Lost</option>
        </Select>
        <Select id="source" label="Source" value={form.source} onChange={(e) => set('source', e.target.value)}>
          <option value="MANUAL">Manual</option>
          <option value="LINKEDIN">LinkedIn</option>
          <option value="HAPPENSTANCE">Happenstance</option>
        </Select>
      </div>
      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={saving || !form.name}>
          {saving ? 'Saving…' : initial.id ? 'Update contact' : 'Add contact'}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
