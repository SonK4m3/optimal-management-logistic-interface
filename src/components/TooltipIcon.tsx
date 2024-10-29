import { clsx } from 'clsx'
import React from 'react'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from '@/components/ui/tooltip.tsx'

interface TooltipProps {
    trigger: React.ReactNode
    content: string
}

const TooltipIcon = (props: TooltipProps) => {
    const { trigger, content } = props

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>{trigger}</TooltipTrigger>
                <TooltipContent
                    sideOffset={4}
                    className={clsx(
                        'inline-flex items-center rounded-md px-4 py-2.5',
                        'bg-gray-700 dark:bg-gray-800'
                    )}
                >
                    <span className='block text-xs leading-none text-primary-foreground dark:text-gray-100'>
                        {content}
                    </span>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

export default TooltipIcon
