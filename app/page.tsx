'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FileForm } from '@/components/file-form'

export default function HomePage() {
  const [uploading, setUploading] = useState(false)
  const [file, setFile] = useState<File| null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Submitting file:', file)
    if (!file) return
    const form = new FormData()
    form.append('file', file)
    setUploading(true)
    const res = await fetch('/api/process', {
      method: 'POST',
      body: form,
    })
    const { job_id } = await res.json()
    router.push(`/status/${job_id}`)
  }

  return (
    <>
      <div className='flex-col max-w-1/3 items-center'>
        <FileForm setFile={setFile} onSubmit={handleSubmit}  />
      </div>
      {uploading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="text-white">Uploading...</div>
        </div>
      )}
    </>
  )
}
