import React from 'react'
import { tv, VariantProps } from 'tailwind-variants'

import { cn } from '@/lib/utils'

const sectionVariants = tv({
  base: 'flex w-full justify-center py-12',
  variants: {
    variant: {
      default: 'bg-transparent',
      callaction: 'bg-zinc-100 dark:bg-zinc-800',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export interface SectionProps
  extends React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement>,
      HTMLElement
    >,
    VariantProps<typeof sectionVariants> {}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <section
        className={cn(sectionVariants({ variant }), className)}
        ref={ref}
        {...props}
      />
    )
  },
)
Section.displayName = 'Section'

export { Section }
