/* eslint-disable @typescript-eslint/no-explicit-any */
import Select, { ClassNamesConfig } from 'react-select'

interface AppSearchDropdownProps {
    items: {
        value: string | number
        label: string
    }[]
    placeholder?: string
    onInputChange?: (value: string) => void
    onSelect?: (value: string | number) => void
}

const customStyles: ClassNamesConfig = {
    control: () => 'px-4 py-2 bg-neutral-900 rounded-lg border border-neutral-300',
    input: () => 'text-neutral-600 text-[17px] leading-[22px] font-medium',
    menu: () => ' bg-neutral-900',
    menuList: () => 'bg-neutral-900',
    option: () => 'text-neutral-600 hover:bg-neutral-800 focus:bg-neutral-900 bg-neutral-900',
    singleValue: () => 'text-neutral-600',
    indicatorSeparator: () => 'bg-transparent w-0'
}

const AppSearchDropdown = ({
    items,
    placeholder = 'Search...',
    onInputChange,
    onSelect
}: AppSearchDropdownProps) => {
    return (
        <Select
            className='w-full'
            classNamePrefix='select'
            options={items}
            placeholder={placeholder}
            isSearchable={true}
            isClearable={true}
            maxMenuHeight={200}
            classNames={customStyles}
            onInputChange={(value, actionMeta) => {
                if (actionMeta.action === 'input-change') {
                    onInputChange?.(value)
                }
            }}
            onChange={value => {
                if (value) {
                    onSelect?.((value as any).value)
                }
            }}
        />
    )
}

export default AppSearchDropdown
