import Badge from '@/components/ui/Badge'

const labels: Record<string, string> = {
  LEAD: 'Lead',
  OPPORTUNITY: 'Opportunity',
  CLOSED_WON: 'Closed Won',
  CLOSED_LOST: 'Closed Lost',
}

const variants: Record<string, 'blue' | 'green' | 'teal' | 'red'> = {
  LEAD: 'blue',
  OPPORTUNITY: 'green',
  CLOSED_WON: 'teal',
  CLOSED_LOST: 'red',
}

export default function StageBadge({ stage }: { stage: string }) {
  return <Badge variant={variants[stage] ?? 'gray' as never}>{labels[stage] ?? stage}</Badge>
}
