import Badge from '@/components/ui/Badge'

const config: Record<string, { label: string; variant: 'purple' | 'blue' | 'green' | 'teal' | 'gray' }> = {
  GRANOLA: { label: 'Granola', variant: 'purple' },
  EMAIL: { label: 'Email', variant: 'blue' },
  WHATSAPP: { label: 'WhatsApp', variant: 'green' },
  SMS: { label: 'SMS', variant: 'teal' },
  MANUAL: { label: 'Manual', variant: 'gray' },
}

export default function SourceBadge({ source }: { source: string }) {
  const c = config[source] ?? { label: source, variant: 'gray' as const }
  return <Badge variant={c.variant}>{c.label}</Badge>
}
