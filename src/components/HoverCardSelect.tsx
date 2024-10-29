import * as React from 'react'
import { clsx } from 'clsx'
import { ChevronDown } from 'lucide-react'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card.tsx'

interface HoverCardSelectProps<T extends string> {
    selected: T
    options: T[]
    onSelect: (option: T) => void
}

const HoverCardSelect = <T extends string>({
    options,
    onSelect,
    selected
}: HoverCardSelectProps<T>): React.ReactElement => {
    return (
        <HoverCard openDelay={10} closeDelay={10}>
            <HoverCardTrigger asChild>
                <div
                    className={clsx(
                        'group flex items-center gap-2 cursor-pointer',
                        'text-center font-semibold'
                    )}
                >
                    {selected}
                    <ChevronDown width={15} height={15} />
                </div>
            </HoverCardTrigger>
            <HoverCardContent className='w-fit'>
                <div className='flex flex-col gap-2'>
                    {options.map(option => (
                        <div
                            key={option}
                            className='font-semibold cursor-pointer'
                            onClick={e => {
                                e.preventDefault()
                                e.stopPropagation()
                                onSelect(option)
                            }}
                        >
                            {option}
                        </div>
                    ))}
                </div>
            </HoverCardContent>
        </HoverCard>
    )
}

export default HoverCardSelect
