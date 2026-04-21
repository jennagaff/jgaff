'use client'

import { useEffect, useState } from 'react'
import { daysUntil } from '@/lib/utils'

interface CountdownProps {
  targetDate: string
  label: string
}

export default function Countdown({ targetDate, label }: CountdownProps) {
  const [days, setDays] = useState(() => daysUntil(targetDate))

  useEffect(() => {
    setDays(daysUntil(targetDate))
    const interval = setInterval(() => setDays(daysUntil(targetDate)), 60000)
    return () => clearInterval(interval)
  }, [targetDate])

  const color =
    days <= 7 ? 'text-red-600' : days <= 30 ? 'text-amber-600' : 'text-green-600'

  const bgColor =
    days <= 7 ? 'bg-red-50 border-red-200' : days <= 30 ? 'bg-amber-50 border-amber-200' : 'bg-green-50 border-green-200'

  return (
    <div className={`rounded-xl border p-4 ${bgColor}`}>
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-3xl font-bold ${color}`}>
        {days > 0 ? `${days} days` : days === 0 ? 'Due today' : `${Math.abs(days)} days overdue`}
      </p>
    </div>
  )
}
