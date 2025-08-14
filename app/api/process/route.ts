import { NextResponse } from 'next/server'
export const runtime = 'nodejs'

export async function POST(req: Request) {
  const form = await req.formData()
  const resp = await fetch(`${process.env.BACKEND_URL}/process/`, {
    method: 'POST',
    body: form,
    headers: { 'x-internal-api-key': process.env.INTERNAL_API_KEY ?? '' },
  })
  const text = await resp.text()
  if (!resp.ok) return new NextResponse(text, { status: resp.status })
  return NextResponse.json(JSON.parse(text))
}
