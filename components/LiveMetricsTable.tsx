'use client'

import { useMemo, useState } from 'react'
import { TrackFile } from '@/lib/types'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

export default function LiveMetricsTable({ tracks, currentTime }: { tracks: TrackFile, currentTime: number }) {
  const [teamFilter, setTeamFilter] = useState<string>('__all')
  const teams = useMemo(() => {
    const set = new Set<string>()
    for (const f of tracks.frames) {
      for (const p of f.players) {
        if (p.team !== undefined && p.team !== null) set.add(String(p.team))
      }
    }
    return Array.from(set).sort()
  }, [tracks])
  console.log('Teams:', teams)
  const currentFrame = useMemo(() => {
    if (!tracks?.frames.length) return null
    // Find the frame that is closest to the current video time
    return tracks.frames.reduce((prev, curr) => {
      return (Math.abs(curr.t - currentTime) < Math.abs(prev.t - currentTime) ? curr : prev)
    })
  }, [tracks, currentTime])

  if (!currentFrame) {
    return <div className="text-sm text-muted-foreground">No tracking data for this timestamp.</div>
  }

  const filteredPlayers = currentFrame.players.filter(p => teamFilter === '__all' || String(p.team) === teamFilter)

  return (
    <div className="overflow-auto flex flex-col gap-2">
      <div className="flex items-center gap-2 text-xs">
        <label htmlFor="teamFilter" className="text-muted-foreground">Team:</label>
        <select
          id="teamFilter"
          className="bg-background border border-border rounded px-2 py-1 text-xs"
          value={teamFilter}
          onChange={e => setTeamFilter(e.target.value)}
        >
          <option value="__all">All</option>
          {teams.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Player</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Ball</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPlayers.map(p => (
            <TableRow key={p.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <span>#{p.id}</span>
                  {p.team && <Badge variant="secondary">{p.team}</Badge>}
                </div>
              </TableCell>
              <TableCell>{p.x.toFixed(2)}, {p.y.toFixed(2)}</TableCell>
              <TableCell>{p.has_ball ? 'Yes' : 'No'}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <p className="mt-2 text-xs text-neutral-400">Displaying data for frame at {currentFrame.t.toFixed(2)}s.</p>
    </div>
  )
}
