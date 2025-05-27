'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FileForm } from '@/components/file-form'
import { LabelDemo } from '@/components/term-checkbox'

export default function HomePage() {
  const [file, setFile] = useState<File| null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return
    const form = new FormData()
    form.append('file', file)
    const res = await fetch('/api/process', {
      method: 'POST',
      body: form,
    })
    const { job_id } = await res.json()
    router.push(`/status/${job_id}`)
  }

  return (
    <>
      <FileForm />
      <LabelDemo />
      <form onSubmit={handleSubmit}>
        <input type="file"
              accept="video/*"
              onChange={e => setFile(e.target.files?.[0] ?? null)}
        />
        <button type="submit" disabled={!file}>
          Upload & Process
        </button>
      </form>
    </>
  )
}
