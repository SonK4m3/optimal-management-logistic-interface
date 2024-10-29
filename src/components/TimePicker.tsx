import * as React from 'react'
import { cn } from '@/lib/utils.ts'

const TimePicker: React.FC<{
    value: string | undefined
    disabled?: boolean
    onChange: (value: string | undefined) => void
}> = ({ onChange, value, disabled = false }) => {
    return (
        <input
            type='time'
            value={value}
            onChange={e => onChange(e.target.value)}
            className={cn(
                'max-w-[240px] w-full h-10 px-4 py-2',
                'bg-white/10 rounded-md focus:outline-none',
                'justify-start text-left font-normal overflow-hidden',
                !value && 'text-muted-foreground',
                'disabled:pointer-events-none disabled:opacity-50'
            )}
            disabled={disabled}
        />
    )
}

export default TimePicker
