'use client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [progress, setProgress] = useState(0)
  const router = useRouter()

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
    <main className="mx-auto max-w-2xl px-4 py-10">
      <Card className="bg-card text-card-foreground border-border">
        <CardHeader>
          <CardTitle>Upload a video</CardTitle>
          <CardDescription>
            We’ll process it in the background and notify this page when it’s done.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <Input type="file" accept="video/*" onChange={e => setFile(e.target.files?.[0] ?? null)} />
            <div className="flex gap-2">
              <Button type="submit" disabled={!file || submitting}>
                {submitting ? 'Submitting…' : 'Upload & Process'}
              </Button>
            </div>
            {submitting && <Progress value={progress} className="h-2" />}
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
