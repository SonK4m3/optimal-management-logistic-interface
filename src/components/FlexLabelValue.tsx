interface FlexLabelValueProps {
    label: string
    value: string | number | undefined | React.ReactNode
    className?: string
}

const FlexLabelValue = ({ label, value, className }: FlexLabelValueProps): React.ReactElement => {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <div className='text-sm font-medium text-gray-400'>{label}: </div>
            <div className='text-sm text-gray-200'>{value ?? 'N/A'}</div>
        </div>
    )
}

export default FlexLabelValue
