'use client'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function StatusPage() {
  const { jobId } = useParams()
  const [status, setStatus] = useState<'pending'|'processing'|'done'>('pending')
  const [outputUrl, setOutputUrl] = useState<string>('')

  useEffect(() => {
    document.title = `Football Analytics - Status ${jobId}`
  }, [jobId])

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch(`/api/status/${jobId}`)
      const data = await res.json()
      setStatus(data.status)
      if (data.outputUrl) {
        setOutputUrl(data.outputUrl)
        clearInterval(interval)
      }
    }, 3000)
    return () => clearInterval(interval)
  }, [jobId])

  if (status === 'done') {
    return <video src={outputUrl} controls autoPlay style={{ maxWidth: '100%' }}/>
  }
  return <p>Processing… (status: {status})</p>
}
