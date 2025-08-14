'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight">Football Vision</Link>
        <div className="flex gap-2">
          <Button asChild size="sm">
            <Link href="/demo">See a Demo</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
