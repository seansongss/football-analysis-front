import { NextResponse } from 'next/server'

export async function GET(_req: Request, { params }: { params: { jobId: string } }) {
  const resp = await fetch(`${process.env.BACKEND_URL}/status/${params.jobId}`, {
    headers: { 'x-internal-api-key': process.env.INTERNAL_API_KEY ?? '' },
    cache: 'no-store',
  })
  const text = await resp.text()
  if (!resp.ok) return new NextResponse(text, { status: resp.status })
  return NextResponse.json(JSON.parse(text))
}
