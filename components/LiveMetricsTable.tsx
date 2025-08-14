'use client'

import { useMemo, useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { TrackFile } from '@/lib/types'
import { PlayerMetrics, computeMetrics } from '@/lib/metrics'
import { DataTable } from '@/components/ui/data-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

type PlayerData = {
  id: number
  team?: string
  metrics?: PlayerMetrics
}

export default function LiveMetricsTable({ tracks, currentTime }: { tracks: TrackFile, currentTime: number }) {
  const [teamFilter, setTeamFilter] = useState<string>('__all')
  
  // Compute metrics for all players up to current time
  const playerMetrics = useMemo(() => {
    console.log('Computing metrics for currentTime:', currentTime)
    const metrics = computeMetrics(tracks, currentTime)
    console.log('Computed metrics:', metrics)
    return metrics
  }, [tracks, currentTime])

  const currentFrame = useMemo(() => {
    if (!tracks?.frames.length) return null
    // Find the frame that is closest to the current video time
    return tracks.frames.reduce((prev, curr) => {
      return (Math.abs(curr.t - currentTime) < Math.abs(prev.t - currentTime) ? curr : prev)
    })
  }, [tracks, currentTime])

  // Combine current frame data with calculated metrics
  const tableData = useMemo(() => {
    if (!currentFrame) return []
    
    return currentFrame.players
      .filter(p => teamFilter === '__all' || String(p.team) === teamFilter)
      .map(player => {
        const metrics = playerMetrics.find(m => m.playerId === player.id)
        return {
          id: player.id,
          team: player.team,
          metrics
        }
      })
  }, [currentFrame, teamFilter, playerMetrics])

  const columns: ColumnDef<PlayerData>[] = [
    {
      accessorKey: "id",
      header: "Player",
      cell: ({ row }) => {
        const player = row.original
        return (
          <div className="flex items-center gap-2">
            <span>#{player.id}</span>
            {player.team && <Badge variant="secondary">{player.team}</Badge>}
          </div>
        )
      },
    },
    {
      accessorKey: "currentSpeed",
      header: "Speed",
      cell: ({ row }) => {
        const metrics = row.original.metrics
        if (!metrics) return 'N/A'
        return `${metrics.currentSpeed.toFixed(2)}`
      },
    },
    {
      accessorKey: "avgSpeed",
      header: "Avg Speed",
      cell: ({ row }) => {
        const metrics = row.original.metrics
        if (!metrics) return 'N/A'
        return `${metrics.avgSpeed.toFixed(2)}`
      },
    },
    {
      accessorKey: "maxSpeed",
      header: "Max Speed",
      cell: ({ row }) => {
        const metrics = row.original.metrics
        if (!metrics) return 'N/A'
        return `${metrics.maxSpeed.toFixed(2)}`
      },
    },
  ]

  if (!currentFrame) {
    return <div className="text-sm text-muted-foreground">No tracking data for this timestamp.</div>
  }

  return (
    <div className="flex flex-col gap-2 h-full">
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">Team:</span>
        <div className="flex gap-1">
          <Button
            variant={teamFilter === '__all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTeamFilter('__all')}
            className="h-8 px-3 text-xs"
          >
            All
          </Button>
          <Button
            variant={teamFilter === '1' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTeamFilter('1')}
            className="h-8 px-3 text-xs"
          >
            Home
          </Button>
          <Button
            variant={teamFilter === '2' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setTeamFilter('2')}
            className="h-8 px-3 text-xs"
          >
            Away
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        <DataTable columns={columns} data={tableData} />
      </div>
      
      <p className="mt-2 text-xs text-neutral-400">Displaying data for frame at {currentFrame.t.toFixed(2)}s. Current time: {currentTime.toFixed(2)}s</p>
    </div>
  )
}
