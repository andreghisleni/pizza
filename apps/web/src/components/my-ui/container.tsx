import React from 'react'

import { cn } from '@/lib/utils'

export type DivProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>

const Container = React.forwardRef<HTMLDivElement, DivProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        className={cn('container max-w-5xl px-8 md:px-4', className)}
        ref={ref}
        {...props}
      />
    )
  },
)
Container.displayName = 'Container'

export { Container }
