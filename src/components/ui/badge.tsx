import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const badgeVariants = cva(
    'absolute right-[5%] top-[5%] inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
    {
        variants: {
            variant: {
                default:
                    'border-transparent bg-primary text-primary-foreground hover:bg-primary/80',
                secondary:
                    'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
                destructive:
                    'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
                outline: 'text-foreground',
                brand: 'bg-color-brand-500',
                successSolid:
                    'border-transparent bg-green-400 text-primary-foreground hover:bg-green-400/80 dark:bg-green-600 dark:text-primary',
                accentSolid:
                    'border-transparent bg-red-300 text-primary-foreground hover:bg-red-300/80 dark:bg-red-600 dark:text-primary'
            },
            size: {
                default: 'size-1.5 rounded-lg p-1 m-0',
                sm: 'h-9 rounded-md px-3'
            }
        },
        defaultVariants: {
            variant: 'default',
            size: 'default'
        }
    }
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
    return <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
}

export { Badge, badgeVariants }
