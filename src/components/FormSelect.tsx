import React from 'react'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger
} from '@/components/ui/select.tsx'

interface FormSelectProps<T extends string> {
    selected: T
    options: T[]
    onSelect: (option: T) => void
}

const FormSelect = <T extends string>({
    options,
    onSelect,
    selected
}: FormSelectProps<T>): React.ReactElement => {
    return (
        <Select
            onValueChange={value => {
                onSelect(value as T)
            }}
        >
            <SelectTrigger className='w-auto h-5 gap-1 pl-2 pr-1 py-1 rounded-3xl border '>
                {/*<SelectValue placeholder={selected} />*/}
                <div className='self-stretch text-center text-color-neutral-900 text-xs font-normal leading-3'>
                    {selected}
                </div>
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    {options.map((option, index) => (
                        <SelectItem key={`${option}-${index}`} value={`${option}`}>
                            {option}
                        </SelectItem>
                    ))}
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}

export default FormSelect
