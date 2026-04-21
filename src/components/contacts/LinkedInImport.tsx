'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import { Upload } from 'lucide-react'

export default function LinkedInImport() {
  const router = useRouter()
  const [csv, setCsv] = useState('')
  const [segment, setSegment] = useState('GENERAL')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ imported: number; skipped: number } | null>(null)
  const [error, setError] = useState('')

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setCsv(ev.target?.result as string)
    reader.readAsText(file)
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setCsv(ev.target?.result as string)
    reader.readAsText(file)
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!csv) return
    setLoading(true)
    setError('')
    const res = await fetch('/api/contacts/import', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ csv, segment }),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error); setLoading(false); return }
    setResult(data)
    setLoading(false)
    router.refresh()
  }

  return (
    <form onSubmit={submit} className="max-w-lg space-y-4">
      <div
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-indigo-400 transition-colors"
      >
        <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        {csv ? (
          <p className="text-sm text-green-600 font-medium">CSV loaded — {csv.split('\n').length - 1} rows</p>
        ) : (
          <>
            <p className="text-sm text-gray-600 mb-1">Drag &amp; drop your LinkedIn CSV export here</p>
            <p className="text-xs text-gray-400 mb-3">or click to browse</p>
          </>
        )}
        <input type="file" accept=".csv" onChange={onFile} className="hidden" id="csv-upload" />
        <label htmlFor="csv-upload" className="cursor-pointer text-xs text-indigo-600 underline">
          {csv ? 'Replace file' : 'Browse'}
        </label>
      </div>

      <Select id="segment" label="Import as segment" value={segment} onChange={(e) => setSegment(e.target.value)}>
        <option value="GENERAL">General</option>
        <option value="DREAM_50">Dream 50</option>
        <option value="INNER_CIRCLE">Inner Circle</option>
      </Select>

      <p className="text-xs text-gray-500">
        Expected LinkedIn CSV columns: First Name, Last Name, Email Address, Company, Position, URL.
        Duplicate emails will be skipped.
      </p>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {result && (
        <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-sm text-green-800">
          Imported {result.imported} contacts · {result.skipped} duplicates skipped.
        </div>
      )}

      <Button type="submit" disabled={!csv || loading}>
        {loading ? 'Importing…' : 'Import contacts'}
      </Button>
    </form>
  )
}
