import React, { useEffect, useState, useCallback } from 'react'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group.tsx'

type SettingItem = {
    name: string
    value: string
}

const CheckboxGroup: React.FC<{
    name: string
    value?: string
    items: SettingItem[]
    onChange?: (value: string) => void
}> = ({ value = '', name, items, onChange }) => {
    const [selectedValue, setSelectedValue] = useState<string>(value ?? '')

    const handleChange = useCallback(() => {
        onChange && onChange(selectedValue)
    }, [onChange, selectedValue])

    useEffect(() => {
        handleChange()
    }, [handleChange])

    return (
        <div className='w-full flex-col justify-start items-start gap-2 inline-flex'>
            <div className='self-stretch h-4 rounded-lg flex-col justify-center items-start flex'>
                <div className='self-stretch text-color-neutral-500 text-xs font-light leading-none'>
                    {name}
                </div>
            </div>
            <ToggleGroup
                className='flex flex-col gap-2'
                type='single'
                value={selectedValue}
                onValueChange={(value: string) => {
                    if (value) {
                        setSelectedValue(value)
                    }
                }}
            >
                {items.map(({ name, value }) => (
                    <ToggleGroupItem
                        key={name}
                        value={value}
                        aria-label={`Toggle ${value}`}
                        className='h-6 w-full gap-2 data-[state=on]:bg-transparent'
                    >
                        {value === selectedValue ? (
                            <div className='w-4 h-4 p-1 bg-color-neutral-250 rounded-full justify-center items-center inline-flex'>
                                <div className='w-2 h-2 relative bg-color-brand-500 rounded-full' />
                            </div>
                        ) : (
                            <div className='py-1 rounded-lg justify-center items-center flex'>
                                <div className='w-4 h-4 relative bg-color-neutral-250 rounded-full border border-color-neutral-250' />
                            </div>
                        )}
                        <div className='grow shrink basis-0 rounded-lg flex-col justify-center items-start inline-flex'>
                            <div className='text-start self-stretch text-color-neutral-900 text-sm font-normal leading-tight'>
                                {name}
                            </div>
                        </div>
                    </ToggleGroupItem>
                ))}
            </ToggleGroup>
        </div>
    )
}

export default CheckboxGroup
