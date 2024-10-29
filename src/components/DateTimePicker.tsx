import * as React from 'react'
import { CalendarIcon } from '@radix-ui/react-icons'
import { format } from 'date-fns'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

const DateTimePicker: React.FC<{
    placeholder?: string
    value: Date | undefined
    disabled?: boolean
    onChange: (value: Date | undefined) => void
}> = ({ onChange, value, placeholder, disabled = false }) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant={'transparent'}
                    className={cn(
                        'max-w-[240px] w-full justify-start text-left font-normal overflow-hidden',
                        !value && 'text-muted-foreground'
                    )}
                    disabled={disabled}
                >
                    <CalendarIcon className='mr-2 h-4 w-4' />
                    {value ? (
                        format(value, 'dd/MM/yyyy')
                    ) : (
                        <span>{placeholder ?? 'Pick a date'}</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0' align='start'>
                <Calendar mode='single' selected={value} onSelect={onChange} initialFocus />
            </PopoverContent>
        </Popover>
    )
}

export default DateTimePicker
