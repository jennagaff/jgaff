'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Star,
  Heart,
  TrendingUp,
  FileText,
  BookOpen,
  Settings,
  Pin,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard, exact: true },
  { label: 'All Contacts', href: '/contacts', icon: Users, exact: true },
  { label: 'Dream 50', href: '/contacts?segment=DREAM_50', icon: Star, exact: false },
  { label: 'Inner Circle', href: '/contacts?segment=INNER_CIRCLE', icon: Heart, exact: false },
  { label: 'Pipeline', href: '/pipeline', icon: TrendingUp, exact: true },
  { label: 'Notes', href: '/notes', icon: FileText, exact: true },
  { label: 'Memos', href: '/memos', icon: BookOpen, exact: true },
  { label: 'Settings', href: '/settings', icon: Settings, exact: true },
]

export default function Sidebar() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const segment = searchParams.get('segment')

  function isActive(item: (typeof navItems)[0]) {
    if (item.href.includes('segment=')) {
      const itemSegment = new URL(item.href, 'http://x').searchParams.get('segment')
      return pathname === '/contacts' && segment === itemSegment
    }
    if (item.exact) return pathname === item.href
    return pathname.startsWith(item.href)
  }

  return (
    <aside className="w-56 shrink-0 flex flex-col bg-gray-900 min-h-screen">
      <div className="flex items-center gap-2 px-5 py-5 border-b border-gray-700">
        <Pin className="h-5 w-5 text-indigo-400" />
        <span className="text-white font-semibold text-sm">Pin Labs CRM</span>
      </div>
      <nav className="flex-1 py-4 px-3 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                active
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
