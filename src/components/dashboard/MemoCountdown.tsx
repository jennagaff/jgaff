import Countdown from '@/components/ui/Countdown'
import Link from 'next/link'

interface MemoCountdownProps {
  dueDate?: string
  quarter?: string
}

export default function MemoCountdown({ dueDate, quarter }: MemoCountdownProps) {
  if (!dueDate) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 p-4 text-center">
        <p className="text-sm text-gray-500">
          No memo due date set.{' '}
          <Link href="/settings" className="text-indigo-600 underline">Configure in Settings</Link>
        </p>
      </div>
    )
  }

  return (
    <Countdown
      targetDate={dueDate}
      label={quarter ? `Until ${quarter} Inner Circle Memo` : 'Until next Inner Circle Memo'}
    />
  )
}
