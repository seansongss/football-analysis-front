'use client'

import Link from 'next/link'
import {
  NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList,
} from '@/components/ui/navigation-menu'
import { Button } from '@/components/ui/button'

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-tight">Football Vision</Link>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground">
                <Link href="/upload">Upload</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground">
                <Link href="/demo">Demo</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className="flex gap-2">
          <Button asChild size="sm">
            <Link href="/upload">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
