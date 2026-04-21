const stages = [
  { key: 'LEAD', label: 'Leads', color: 'bg-blue-400' },
  { key: 'OPPORTUNITY', label: 'Opps', color: 'bg-green-400' },
  { key: 'CLOSED_WON', label: 'Won', color: 'bg-teal-400' },
  { key: 'CLOSED_LOST', label: 'Lost', color: 'bg-red-300' },
]

interface PipelineProgressProps {
  counts: Record<string, number>
}

export default function PipelineProgress({ counts }: PipelineProgressProps) {
  const total = Object.values(counts).reduce((a, b) => a + b, 0)

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Pipeline</h3>
      {total === 0 ? (
        <p className="text-sm text-gray-400">No contacts yet</p>
      ) : (
        <>
          <div className="flex h-2 rounded-full overflow-hidden mb-3">
            {stages.map((s) => {
              const pct = total > 0 ? (counts[s.key] ?? 0) / total * 100 : 0
              return pct > 0 ? (
                <div key={s.key} className={`${s.color}`} style={{ width: `${pct}%` }} />
              ) : null
            })}
          </div>
          <div className="grid grid-cols-4 gap-2">
            {stages.map((s) => (
              <div key={s.key} className="text-center">
                <p className="text-lg font-bold text-gray-900">{counts[s.key] ?? 0}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
