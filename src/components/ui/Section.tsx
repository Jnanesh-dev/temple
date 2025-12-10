import { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SectionProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode
  background?: 'white' | 'off-white' | 'maroon'
}

export default function Section({
  children,
  background = 'white',
  className,
  ...props
}: SectionProps) {
  return (
    <section
      className={cn(
        'py-12 md:py-16 lg:py-20',
        {
          'bg-white': background === 'white',
          'bg-temple-off-white': background === 'off-white',
          'bg-temple-maroon text-white': background === 'maroon',
        },
        className
      )}
      {...props}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  )
}

