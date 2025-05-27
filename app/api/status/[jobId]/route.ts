import { NextResponse } from 'next/server'

export async function GET(request: Request, { params }: { params: { jobId: string } }) {
  const { jobId } = params
  const backendRes = await fetch(
    `${process.env.BACKEND_URL}/status/${jobId}`
  )
  if (!backendRes.ok) {
    return NextResponse.json({ error: await backendRes.text() }, { status: backendRes.status })
  }
  const payload = await backendRes.json()
  return NextResponse.json(payload)
}
