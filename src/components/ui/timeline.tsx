/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/ui/timeline/index.tsx
import React from 'react'
import { cn } from '@/lib/utils'

interface TimelineItemProps {
    time?: Date | string
    title: string
    description?: string
    icon?: React.ReactNode
    isActive?: boolean
    isLast?: boolean
    children?: React.ReactNode
}

interface TimelineProps {
    children: React.ReactNode
    className?: string
}

const TimelineItem = ({
    time,
    title,
    description,
    icon,
    isActive = false,
    isLast = false,
    children
}: TimelineItemProps) => {
    return (
        <li className={cn('relative flex gap-6 pb-8', isLast ? 'pb-0' : '')}>
            {/* Timeline Line */}
            {!isLast && (
                <div className='absolute left-[1.625rem] top-[2.375rem] -bottom-[0.875rem] w-[1px] bg-border' />
            )}

            {/* Timeline Icon/Dot */}
            <div
                className={cn(
                    'relative flex h-[3.25rem] w-[3.25rem] items-center justify-center rounded-full border bg-background',
                    isActive ? 'border-primary' : 'border-border'
                )}
            >
                {icon ? (
                    <div
                        className={cn(
                            'h-5 w-5',
                            isActive ? 'text-primary' : 'text-muted-foreground'
                        )}
                    >
                        {icon}
                    </div>
                ) : (
                    <div
                        className={cn(
                            'h-2.5 w-2.5 rounded-full',
                            isActive ? 'bg-primary' : 'bg-muted-foreground'
                        )}
                    />
                )}
            </div>

            {/* Timeline Content */}
            <div className='flex-1 pt-2'>
                <div className='flex flex-col gap-1'>
                    {time && (
                        <time className='text-sm text-muted-foreground'>
                            {typeof time === 'string' ? time : time.toLocaleString()}
                        </time>
                    )}
                    <h3
                        className={cn(
                            'text-base font-semibold',
                            isActive ? 'text-primary' : 'text-foreground'
                        )}
                    >
                        {title}
                    </h3>
                    {description && <p className='text-sm text-muted-foreground'>{description}</p>}
                </div>
                {children && <div className='mt-4'>{children}</div>}
            </div>
        </li>
    )
}

const Timeline = React.forwardRef<
    HTMLUListElement,
    React.HTMLAttributes<HTMLUListElement> & TimelineProps
>(({ children, className, ...props }, ref) => {
    return (
        <ul ref={ref} className={cn('space-y-4', className)} {...props}>
            {children}
        </ul>
    )
})

Timeline.displayName = 'Timeline'
;(Timeline as any).Item = TimelineItem

export { Timeline, TimelineItem }
export type { TimelineProps, TimelineItemProps }
