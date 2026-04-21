'use client'

import { useRouter, usePathname } from 'next/navigation'
import { useState } from 'react'
import { Search } from 'lucide-react'

export default function NotesSearch({ defaultValue }: { defaultValue?: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const [value, setValue] = useState(defaultValue ?? '')

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const p = new URLSearchParams()
    if (value) p.set('q', value)
    router.push(`${pathname}?${p.toString()}`)
  }

  return (
    <form onSubmit={onSubmit} className="relative mb-2">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search notes…"
        className="w-full max-w-sm rounded-lg border border-gray-300 pl-9 pr-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
      />
    </form>
  )
}
