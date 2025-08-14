import { useMemo } from 'react'
import { computeMetrics } from '@/lib/metrics'
import { TrackFile } from '@/lib/types'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

export default function MetricsTable({ tracks }: { tracks: TrackFile }) {
  const metrics = useMemo(() => computeMetrics(tracks), [tracks])

  if (!metrics.length) return <div className="text-sm text-neutral-300">No metrics yet.</div>
  return (
    <div className="overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Player</TableHead>
            <TableHead>Team</TableHead>
            <TableHead>Avg Speed</TableHead>
            <TableHead>Max Speed</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {metrics.map(m => (
            <TableRow key={m.playerId}>
              <TableCell className="font-medium">#{m.playerId}</TableCell>
              <TableCell>{m.team ? <Badge variant="secondary">{m.team}</Badge> : '-'}</TableCell>
              <TableCell>{m.avgSpeed.toFixed(2)}</TableCell>
              <TableCell>{m.maxSpeed.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <p className="mt-2 text-xs text-neutral-400">Speed units depend on backend coordinates (e.g., m/s if positions are meters).</p>
    </div>
  )
}
