import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const backendRes = await fetch(
    `${process.env.BACKEND_URL}/process/`,
    { method: 'POST', body: await request.formData() }
  )
  if (!backendRes.ok) {
    return NextResponse.json({ error: await backendRes.text() }, { status: backendRes.status })
  }
  const payload = await backendRes.json()
  return NextResponse.json(payload)
}
