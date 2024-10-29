import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
    'relative inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
    {
        variants: {
            variant: {
                default: 'bg-primary text-primary-foreground hover:bg-primary/90',
                destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
                outline:
                    'border border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground',
                secondary:
                    'bg-secondary text-secondary-foreground hover:bg-secondary/80 dark:text-gray-400',
                ghost: 'text-muted-foreground hover:bg-transparent hover:text-foreground',
                link: 'text-primary underline-offset-4 hover:underline',
                primary:
                    'bg-blue-600 text-primary-foreground hover:bg-blue-600/90 dark:text-primary',
                accentGhost:
                    'bg-color-accent-red-100 text-color-accent-red-900 hover:bg-color-accent-red-200',
                accentSolid: 'bg-color-accent-red-700 text-primary hover:bg-color-accent-red-500',
                successGhost:
                    'bg-color-accent-green-100 text-color-accent-green-900 hover:bg-color-accent-green-200',
                successSolid:
                    'bg-color-accent-green-700 text-primary hover:bg-color-accent-green-500',
                transparent: 'bg-white/10 justify-start items-center gap-1 inline-flex',
                brand: 'bg-gradient-to-r from-[#9BDA9D] via-[#F6F46E] to-[#FAF9C6] rounded-3xl shadow-inner justify-center items-center gap-2 inline-flex self-stretch text-center text-color-neutral-alpha-900 text-sm font-semibold leading-tight',
                emerald: 'bg-color-emerald text-primary hover:bg-color-emerald/90'
            },
            size: {
                default: 'h-10 px-4 py-2',
                sm: 'h-9 rounded-md px-3',
                lg: 'h-11 rounded-md px-8',
                icon: 'h-6 w-6 px-1',
                iconGroup: 'px-2 py-1 rounded-lg gap-1',
                iconGroupLg: 'h-10 px-4 rounded-md gap-1',
                md: 'h-10 px-6 py-2.5'
            }
        },
        defaultVariants: {
            variant: 'default',
            size: 'default'
        }
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : 'button'
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
