import { ButtonHTMLAttributes, AnchorHTMLAttributes, forwardRef } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  href?: string
}

const buttonClasses = (
  variant: 'primary' | 'secondary' | 'outline',
  size: 'sm' | 'md' | 'lg',
  className?: string
) =>
  cn(
    'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    {
      'bg-temple-maroon text-white hover:bg-temple-maroon-dark': variant === 'primary',
      'bg-temple-gold text-temple-maroon hover:bg-temple-gold-light': variant === 'secondary',
      'border-2 border-temple-maroon text-temple-maroon hover:bg-temple-maroon hover:text-white':
        variant === 'outline',
      'px-3 py-1.5 text-sm': size === 'sm',
      'px-4 py-2 text-base': size === 'md',
      'px-6 py-3 text-lg': size === 'lg',
    },
    className
  )

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', href, ...props }, ref) => {
    if (href) {
      return (
        <Link href={href} className={buttonClasses(variant, size, className)}>
          {props.children}
        </Link>
      )
    }

    return (
      <button
        className={buttonClasses(variant, size, className)}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'

export default Button

