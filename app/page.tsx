'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FileForm } from '@/components/file-form'

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
    <div className='flex-col max-w-1/3 items-center'>
      <FileForm />
    </div>
  )
}
