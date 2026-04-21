'use client'

import { useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

interface SettingsFormProps {
  initial: Record<string, string>
}

export default function SettingsForm({ initial }: SettingsFormProps) {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    nextMemoDueDate: initial.nextMemoDueDate ?? '',
    nextMemoQuarter: initial.nextMemoQuarter ?? '',
    memoTemplate: initial.memoTemplate ?? '',
  })

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <form onSubmit={submit} className="max-w-2xl space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <Input
          id="nextMemoQuarter"
          label="Current memo quarter"
          value={form.nextMemoQuarter}
          onChange={(e) => setForm((f) => ({ ...f, nextMemoQuarter: e.target.value }))}
          placeholder="Q2 2026"
        />
        <Input
          id="nextMemoDueDate"
          label="Next memo due date"
          type="date"
          value={form.nextMemoDueDate}
          onChange={(e) => setForm((f) => ({ ...f, nextMemoDueDate: e.target.value }))}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">
          Memo template
        </label>
        <p className="text-xs text-gray-500 mb-1">
          Paste your standard Inner Circle memo template here. It will pre-fill every new memo you create.
        </p>
        <textarea
          value={form.memoTemplate}
          onChange={(e) => setForm((f) => ({ ...f, memoTemplate: e.target.value }))}
          rows={20}
          placeholder="Paste your memo template here…"
          className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-mono text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-y"
        />
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving…' : 'Save settings'}
        </Button>
        {saved && <span className="text-sm text-green-600">Saved!</span>}
      </div>
    </form>
  )
}
