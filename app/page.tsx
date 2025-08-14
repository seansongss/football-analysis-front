'use client'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'

export default function Landing() {
  const [file, setFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [progress, setProgress] = useState(0)
  const router = useRouter()

  useEffect(() => {
    document.title = 'Football Analytics - Home'
  }, [])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return
    setSubmitting(true)
    setProgress(10)
    const form = new FormData()
    form.append('file', file)
    const res = await fetch('/api/process', { method: 'POST', body: form })
    setProgress(60)
    if (!res.ok) {
      setSubmitting(false)
      alert(`Upload failed: ${await res.text()}`)
      return
    }
    const { job_id } = await res.json()
    setProgress(100)
    router.push(`/job/${job_id}`)
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <section className="grid gap-6 lg:grid-cols-2 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            Football video analytics in your browser
          </h1>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Upload a match video. We detect players & the ball, compute player metrics,
            and return a processed video plus per–player metrics.
          </p>
          
          <div className="mt-6">
            <Button variant="secondary" size="lg" asChild>
              <a href="/demo">See a demo</a>
            </Button>
          </div>
          <div className="mt-6">
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="flex gap-3 items-center justify-center">
                <Input 
                  type="file" 
                  accept="video/*" 
                  onChange={e => setFile(e.target.files?.[0] ?? null)}
                  className="flex-1"
                  placeholder="Select a video file..."
                />
                <Button 
                  type="submit" 
                  disabled={!file || submitting}
                  size="lg"
                >
                  {submitting ? 'Processing…' : 'Upload to Process'}
                </Button>
              </div>
              {submitting && <Progress value={progress} className="h-2" />}
            </form>
          </div>

        </div>
        
        <Card className="bg-card text-card-foreground border-border">
          <CardHeader><CardTitle>How it works</CardTitle></CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div><span className="font-medium text-foreground">1.</span> Upload your video (mp4/mov). We hand it to a FastAPI + EC2 worker.</div>
            <Separator />
            <div><span className="font-medium text-foreground">2.</span> The worker runs YOLO tracking and writes the processed video + JSON tracks to S3.</div>
            <Separator />
            <div><span className="font-medium text-foreground">3.</span> The site waits and then shows the video with per–player metrics computed in the browser.</div>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
