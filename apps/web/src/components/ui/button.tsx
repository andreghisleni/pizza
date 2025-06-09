import { Slot } from '@radix-ui/react-slot'
import * as React from 'react'
import { twMerge } from 'tailwind-merge'
import { tv, type VariantProps } from 'tailwind-variants'

const buttonVariants = tv({
  base: 'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-zinc-950 dark:focus-visible:ring-zinc-800 disabled:cursor-not-allowed',
  variants: {
    variant: {
      default:
        'bg-zinc-900 text-zinc-50 hover:bg-zinc-900/90 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90',
      destructive: 'bg-red-500 text-zinc-50 hover:bg-red-500/90',
      outline:
        'border border-zinc-200 bg-white hover:bg-zinc-100 hover:text-zinc-900 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 disabled:cursor-not-allowed',
      secondary:
        'bg-zinc-100 text-zinc-900 hover:bg-zinc-100/80 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-800/80',
      ghost:
        'hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50',
      link: 'text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-50',
    },
    size: {
      default: 'h-10 px-4 py-2',
      sm: 'h-8 rounded-md px-3',
      xs: 'h-6 rounded px-2 text-xs',
      lg: 'h-11 rounded-md px-8',
      icon: 'size-8',
    },
    format: {
      default: '',
      rounded: 'rounded-full',
    },
    color: {
      default: '',
      blue: 'bg-blue-500 text-white hover:bg-blue-600 focus-visible:ring-blue-400 dark:bg-blue-600 dark:hover:bg-blue-700',
      green:
        'bg-green-500 text-white hover:bg-green-600 focus-visible:ring-green-400 dark:bg-green-600 dark:hover:bg-green-700',
      red: 'bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-400 dark:bg-red-600 dark:hover:bg-red-700',
      yellow:
        'bg-yellow-500 text-white hover:bg-yellow-600 focus-visible:ring-yellow-400 dark:bg-yellow-600 dark:hover:bg-yellow-700',
      purple:
        'bg-purple-500 text-white hover:bg-purple-600 focus-visible:ring-purple-400 dark:bg-purple-600 dark:hover:bg-purple-700',
      pink: 'bg-pink-500 text-white hover:bg-pink-600 focus-visible:ring-pink-400 dark:bg-pink-600 dark:hover:bg-pink-700',
      indigo:
        'bg-indigo-500 text-white hover:bg-indigo-600 focus-visible:ring-indigo-400 dark:bg-indigo-600 dark:hover:bg-indigo-700',
      teal: 'bg-teal-500 text-white hover:bg-teal-600 focus-visible:ring-teal-400 dark:bg-teal-600 dark:hover:bg-teal-700',
      orange:
        'bg-orange-500 text-white hover:bg-orange-600 focus-visible:ring-orange-400 dark:bg-orange-600 dark:hover:bg-orange-700',
      cyan: 'bg-cyan-500 text-white hover:bg-cyan-600 focus-visible:ring-cyan-400 dark:bg-cyan-600 dark:hover:bg-cyan-700',
      emerald:
        'bg-emerald-500 text-white hover:bg-emerald-600 focus-visible:ring-emerald-400 dark:bg-emerald-600 dark:hover:bg-emerald-700',
      rose: 'bg-rose-500 text-white hover:bg-rose-600 focus-visible:ring-rose-400 dark:bg-rose-600 dark:hover:bg-rose-700',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
    format: 'default',
    color: 'default',
  },
})

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant, size, format, color, asChild = false, ...props },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={twMerge(
          buttonVariants({ variant, size, format, color, className }),
        )}
        ref={ref}
        type={asChild ? undefined : props.type || 'button'}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'

export { Button, buttonVariants }
