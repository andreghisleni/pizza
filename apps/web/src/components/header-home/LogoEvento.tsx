'use client'

import Image from 'next/image'

import Logo from '@/assets/logo.jpeg'
import { cn } from '@/lib/utils'

export function LogoEvento() {
  return (
    <div className={cn('w-36')}>
      <Image
        src={Logo}
        alt="Logo"
        placeholder="blur"
        className="block scale-100"
      />
    </div>
  )
}
