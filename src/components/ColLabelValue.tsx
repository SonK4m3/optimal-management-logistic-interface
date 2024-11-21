interface ColLabelValueProps {
    label: string
    value: string | number | boolean | null
}

const ColLabelValue = ({ label, value }: ColLabelValueProps) => {
    return (
        <div className='flex flex-col gap-2'>
            <div className='text-sm font-medium'>{label}</div>
            <div className='text-sm text-color-neutral-500'>{value}</div>
        </div>
    )
}

export default ColLabelValue
