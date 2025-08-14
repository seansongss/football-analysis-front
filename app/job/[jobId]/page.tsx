'use client'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import VideoWithMetrics from '@/components/VideoWithMetrics'
import { TrackFile, JobStatus } from '@/lib/types'

const REFRESH_MS = 3000

export default function JobPage() {
  const { jobId } = useParams<{ jobId: string }>()
  const [track, setTrack] = useState<TrackFile | null>(null)

  useEffect(() => {
    document.title = `Football Analytics - Analysis`
  }, [jobId])

  const { data: status } = useQuery<JobStatus>({
    queryKey: ['status', jobId],
    queryFn: async () => {
      const res = await fetch(`/api/status/${jobId}`, { cache: 'no-store' })
      if (!res.ok) throw new Error(await res.text())
      return res.json()
    },
    refetchInterval: (q) => (q.state.data?.status === 'done' ? false : REFRESH_MS),
  })

  useEffect(() => {
    if (status && status.status === 'done' && status.dataUrl) {
      fetch(status.dataUrl).then(r => r.json()).then((json: TrackFile) => setTrack(json)).catch(console.error)
    }
  }, [status])

  if (!status || status.status !== 'done') {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <Card className="bg-card text-card-foreground border-border">
          <CardContent className="py-10 text-center space-y-2">
            <div className="text-xl font-semibold">Processing your video…</div>
            <div className="text-muted-foreground">
              Job ID: <Badge variant="secondary">{jobId}</Badge>
            </div>
          </CardContent>
        </Card>
      </main>
    )
  }

  if (!track) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <Card className="bg-card text-card-foreground border-border">
          <CardContent className="py-10 text-center space-y-2">
            <div className="text-xl font-semibold">Waiting for video analysis…</div>
            <div className="text-muted-foreground">
              Job ID: <Badge variant="secondary">{jobId}</Badge>
            </div>
          </CardContent>
        </Card>
      </main>
    )
  }

  return (
    <VideoWithMetrics
      videoUrl={status.outputUrl}
      tracks={track}
    />
  )
}
