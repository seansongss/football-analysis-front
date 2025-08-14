import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

export default function Landing() {
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
          <div className="mt-6 flex gap-3">
            <Button size="lg" asChild><Link href="/upload">Upload a video</Link></Button>
            <Button variant="secondary" size="lg" asChild><Link href="/demo">See a demo</Link></Button>
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
