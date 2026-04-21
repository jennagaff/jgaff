import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'green' | 'blue' | 'purple' | 'amber' | 'red' | 'teal' | 'gray'
  className?: string
}

export default function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        {
          'bg-indigo-100 text-indigo-700': variant === 'default',
          'bg-green-100 text-green-700': variant === 'green',
          'bg-blue-100 text-blue-700': variant === 'blue',
          'bg-purple-100 text-purple-700': variant === 'purple',
          'bg-amber-100 text-amber-700': variant === 'amber',
          'bg-red-100 text-red-700': variant === 'red',
          'bg-teal-100 text-teal-700': variant === 'teal',
          'bg-gray-100 text-gray-700': variant === 'gray',
        },
        className
      )}
    >
      {children}
    </span>
  )
}
