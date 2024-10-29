import React, { useEffect, useState } from 'react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group.tsx'
import { clsx } from 'clsx'

type SettingItem = {
    name: string
    value: string
}

const SettingGroup: React.FC<{
    name: string
    items: SettingItem[]
    single: boolean
    valueSingle?: string
    onChange?: (value: string | string[]) => void
}> = ({ name, items, single, onChange, valueSingle = '' }) => {
    const [selectedValues, setSelectedValues] = useState<string[]>([])
    const [selectedValue, setSelectedValue] = useState<string>('')

    useEffect(() => {
        setSelectedValue(valueSingle)
    }, [valueSingle])

    if (single)
        return (
            <div className='w-full flex-col justify-start items-start gap-2 inline-flex'>
                <div className='self-stretch h-4 rounded-lg flex-col justify-center items-start flex'>
                    <div className='self-stretch text-color-neutral-500 text-xs font-light leading-none'>
                        {name}
                    </div>
                </div>
                <ToggleGroup
                    className='flex flex-wrap gap-2 justify-start'
                    type='single'
                    value={selectedValue}
                    onValueChange={(value: string) => {
                        setSelectedValue(value)
                        onChange && onChange(value)
                    }}
                >
                    {items.map(({ name, value }) => (
                        <ToggleGroupItem
                            key={name}
                            value={value}
                            aria-label={`Toggle ${value}`}
                            className={clsx(
                                'h-7 px-2.5 py-1 rounded border justify-start items-center gap-1 inline-flex',
                                {
                                    'border-color-neutral-900': value === selectedValue,
                                    'border-color-neutral-250': value !== selectedValue
                                }
                            )}
                        >
                            <div className='pb-0.5 rounded-lg flex-col justify-center items-start inline-flex'>
                                <div className='self-stretch text-color-neutral-900 text-sm font-normal leading-tight'>
                                    {name}
                                </div>
                            </div>
                        </ToggleGroupItem>
                    ))}
                </ToggleGroup>
            </div>
        )

    return (
        <div className='w-full flex-col justify-start items-start gap-2 inline-flex'>
            <div className='self-stretch h-4 rounded-lg flex-col justify-center items-start flex'>
                <div className='self-stretch text-color-neutral-500 text-xs font-light leading-none'>
                    {name}
                </div>
            </div>
            <ToggleGroup
                className='flex flex-wrap gap-2 justify-start'
                type='multiple'
                value={selectedValues}
                onValueChange={(value: string[]) => {
                    setSelectedValues(value)
                    onChange && onChange(value)
                }}
            >
                {items.map(({ name, value }) => (
                    <ToggleGroupItem
                        key={name}
                        value={value}
                        aria-label={`Toggle ${value}`}
                        className={clsx(
                            'h-7 px-2.5 py-1 rounded border justify-start items-center gap-1 inline-flex',
                            {
                                'border-color-neutral-900': selectedValues.includes(value),
                                'border-color-neutral-250': !selectedValues.includes(value)
                            }
                        )}
                    >
                        <div className='pb-0.5 rounded-lg flex-col justify-center items-start inline-flex'>
                            <div className='self-stretch text-color-neutral-900 text-sm font-normal leading-tight'>
                                {name}
                            </div>
                        </div>
                    </ToggleGroupItem>
                ))}
            </ToggleGroup>
        </div>
    )
}

export default SettingGroup
