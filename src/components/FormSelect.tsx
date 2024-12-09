import React from 'react'

interface FormSelectProps<T extends string> {
    selected: T | undefined
    options: { label: string; value: T }[]
    onSelect: (option: T) => void
}

const FormSelect = <T extends string>({
    options,
    onSelect,
    selected
}: FormSelectProps<T>): React.ReactElement => {
    return (
        <select
            value={selected || ''}
            onChange={e => onSelect(e.target.value as T)}
            className='w-auto gap-1 pl-2 pr-1 py-1 rounded-3xl border border-color-neutral-alpha-300 text-xs font-normal leading-3 text-center text-color-neutral-900 bg-background cursor-pointer hover:border-color-neutral-500'
        >
            {!selected && (
                <option value='' disabled>
                    Select an option
                </option>
            )}
            {options.map((option, index) => (
                <option key={`${option.value}-${index}`} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    )
}

export default FormSelect
