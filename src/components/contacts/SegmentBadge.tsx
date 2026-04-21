import Badge from '@/components/ui/Badge'

const labels: Record<string, string> = {
  DREAM_50: 'Dream 50',
  INNER_CIRCLE: 'Inner Circle',
  GENERAL: 'General',
}

const variants: Record<string, 'purple' | 'amber' | 'gray'> = {
  DREAM_50: 'purple',
  INNER_CIRCLE: 'amber',
  GENERAL: 'gray',
}

export default function SegmentBadge({ segment }: { segment: string }) {
  return <Badge variant={variants[segment] ?? 'gray'}>{labels[segment] ?? segment}</Badge>
}
