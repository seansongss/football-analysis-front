'use client'
import { useEffect, useState } from 'react'
import VideoWithMetrics from '@/components/VideoWithMetrics'
import { TrackFile } from '@/lib/types'

const SAMPLE_VIDEO_URL = '/sample.mp4'
const SAMPLE_DATA_URL  = '/sample_tracks.json'

export default function DemoPage() {
  const [tracks, setTracks] = useState<TrackFile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const r = await fetch(SAMPLE_DATA_URL, { cache: 'no-store' })
        if (!r.ok) throw new Error(`Failed to fetch sample data: ${r.statusText}`)
        const json: TrackFile = await r.json()
        if (mounted) setTracks(json)
      } catch (err) {
        console.error(err)
      } finally {
        if (mounted) setLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Loading demo...</div>
  }

  if (!tracks) {
    return <div className="p-8 text-center text-destructive">Failed to load tracking data.</div>
  }

  return <VideoWithMetrics videoUrl={SAMPLE_VIDEO_URL} tracks={tracks} />
}
