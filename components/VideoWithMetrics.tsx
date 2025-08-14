import { useEffect, useMemo, useRef, useState } from 'react'

// Minimal typing for requestVideoFrameCallback (not yet in standard TS lib for all targets)
type VideoWithRFC = HTMLVideoElement & {
  // Some browsers also expose a cancel method; make it optional
  cancelVideoFrameCallback?: (handle: number) => void
}
import { TrackFile } from '@/lib/types'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import LiveMetricsTable from '@/components/LiveMetricsTable'

export default function VideoWithMetrics({
  videoUrl,
  tracks,
}: {
  videoUrl: string
  tracks: TrackFile
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const frameTimes = useMemo(() => tracks.frames.map(f => f.t), [tracks])
  const [frameIndex, setFrameIndex] = useState(0)

  const handleTimeUpdate = () => {
    const v = videoRef.current
    if (!v) return
    const t = v.currentTime
    setCurrentTime(t)
    // update frame index (binary search could be used; linear fine for small demo)
    let idx = frameTimes.findIndex(ft => ft > t)
    if (idx === -1) idx = frameTimes.length - 1
    else if (idx > 0) idx = idx - 1
    setFrameIndex(idx)
  }

  // High frequency sync using requestVideoFrameCallback if available
  useEffect(() => {
    const v = videoRef.current as VideoWithRFC | null
    if (!v || typeof v.requestVideoFrameCallback !== 'function') return
    let handle = 0
    const loop = (_now: number, metadata: { mediaTime: number }) => {
      const mediaTime = metadata.mediaTime
      setCurrentTime(mediaTime)
      let idx = frameTimes.findIndex(ft => ft > mediaTime)
      if (idx === -1) idx = frameTimes.length - 1
      else if (idx > 0) idx = idx - 1
      setFrameIndex(idx)
      handle = v.requestVideoFrameCallback!(loop)
    }
    handle = v.requestVideoFrameCallback(loop)
    return () => { if (handle) v.cancelVideoFrameCallback?.(handle) }
  }, [frameTimes])

  const stepFrame = (delta: number) => {
    const v = videoRef.current
    if (!v) return
    v.pause()
  const newIndex = Math.min(frameTimes.length - 1, Math.max(0, frameIndex + delta))
    setFrameIndex(newIndex)
    const t = frameTimes[newIndex]
    v.currentTime = t
    setCurrentTime(t)
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_400px] items-start">
        <div className="relative w-full">
          <div className="rounded-md overflow-hidden border border-border bg-black">
            <video
              ref={videoRef}
              src={videoUrl}
              className="w-full h-auto aspect-video"
              controls
              playsInline
              onTimeUpdate={handleTimeUpdate}
            />
          </div>
          <div className="mt-2 flex items-center gap-2 text-xs">
            <button
              onClick={() => stepFrame(-1)}
              className="px-2 py-1 rounded border border-border hover:bg-accent/30"
            >Prev Frame</button>
            <button
              onClick={() => stepFrame(1)}
              className="px-2 py-1 rounded border border-border hover:bg-accent/30"
            >Next Frame</button>
            <span className="text-muted-foreground">Time: {currentTime.toFixed(2)}s · Frame {frameIndex+1}/{frameTimes.length}</span>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <Card className="bg-card text-card-foreground border-border">
            <CardHeader><CardTitle>Metrics</CardTitle></CardHeader>
            <CardContent>
              <LiveMetricsTable tracks={tracks} currentTime={currentTime} />
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
