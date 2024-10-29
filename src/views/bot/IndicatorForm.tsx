import { Input } from '@/components/ui/input'
import { useTechnicalAnalysisContext } from '@/contexts/TechnicalAnalysisContext'
import { IndicatorFormValue, InputFieldNames } from '@/types'
import { Button } from '@/components/ui/button.tsx'
// import clsx from 'clsx'
import React, { useState } from 'react'
import { Control, Controller, FieldErrors } from 'react-hook-form'

const IndicatorInput: React.FC<{
    control: Control<IndicatorFormValue>
    errors: FieldErrors<IndicatorFormValue>
    name: InputFieldNames<IndicatorFormValue>
    label: string
    placeholder?: string
    type?: 'text' | 'number'
}> = ({ control, name, label, placeholder, type = 'number' }) => {
    return (
        <div className='col-span-1 flex-1 min-w-[100px]'>
            <label htmlFor={name as string} className='text-white text-nowrap'>
                {label}
            </label>
            <Controller
                name={name}
                control={control}
                rules={{ required: 'This field is required' }}
                render={({ field }) => (
                    <Input
                        id={name as string}
                        className='mt-2 bg-gray-800 text-white border border-gray-600 rounded-md p-2 hidden-input'
                        placeholder={placeholder ?? ''}
                        {...field}
                        type={type}
                    />
                )}
            />
        </div>
    )
}

const IndicatorSelect: React.FC<{
    control: Control<IndicatorFormValue>
    errors: FieldErrors<IndicatorFormValue>
    name: keyof IndicatorFormValue
    label: string
    placeholder?: string
    items: {
        value: string
        label: string
    }[]
    onChangeCallback?: (value: string) => void
}> = ({ control, errors, name, label, items, onChangeCallback }) => {
    return (
        <div className='col-span-1 flex-1 min-w-[100px]'>
            <label htmlFor={name as string} className='text-white text-nowrap'>
                {label}
            </label>
            <Controller
                name={name}
                control={control}
                rules={{ required: 'This field is required' }}
                render={({ field: { onChange, value } }) => (
                    <select
                        id={name as string}
                        value={value.toString()}
                        onChange={e => {
                            onChange(e)
                            if (onChangeCallback) onChangeCallback(e.target.value)
                        }}
                        className='mt-2 bg-gray-800 text-white border border-gray-600 rounded-md p-2 w-full'
                    >
                        {items.map(item => (
                            <option key={item.value} value={item.value}>
                                {item.label}
                            </option>
                        ))}
                    </select>
                )}
            />
            {errors[name] && <p className='text-red-500'>{errors[name]?.message as string}</p>}
        </div>
    )
}

const IndicatorForm: React.FC = () => {
    const {
        onSubmit,
        handleSubmit,
        control,
        formState: { errors },
        resetField
    } = useTechnicalAnalysisContext()
    const [showBBInput, setShowBBInput] = useState(false)

    const handleIndicatorChange = (value: string) => {
        if (value.includes('BB')) {
            setShowBBInput(true)
        } else {
            setShowBBInput(false)
            resetField('multiplier')
        }
    }

    return (
        <div className='flex justify-center items-center'>
            <form
                className='w-full max-w-md p-4 bg-gray-900 rounded-md'
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className='grid grid-cols-1 gap-4'>
                    <IndicatorSelect
                        control={control}
                        errors={errors}
                        name={'indicatorName'}
                        label={'Indicator Name'}
                        items={[
                            { label: 'ADX', value: 'ADX' },
                            { label: 'BBPercentB', value: 'BBPercentB' },
                            { label: 'CCI', value: 'CCI' },
                            { label: 'EMA', value: 'EMA' },
                            { label: 'RSI', value: 'RSI' },
                            { label: 'SMA', value: 'SMA' },
                            { label: 'ATR', value: 'ATR' },
                            { label: 'AroonUp', value: 'AroonUp' },
                            { label: 'AroonDown', value: 'AroonDown' },
                            { label: 'DCUpper', value: 'DCUpper' },
                            { label: 'DCMiddle', value: 'DCMiddle' },
                            { label: 'DCLower', value: 'DCLower' },
                            { label: 'CPO', value: 'CPO' },
                            { label: 'CMO', value: 'CMO' }

                        ]}
                        onChangeCallback={handleIndicatorChange}
                    />

                    {showBBInput && (
                        <IndicatorInput
                            control={control}
                            errors={errors}
                            name={'multiplier'}
                            label={'Multiplier'}
                        />
                    )}

                    <IndicatorInput
                        control={control}
                        errors={errors}
                        name={'period'}
                        label={'Period'}
                    />

                    <IndicatorSelect
                        control={control}
                        errors={errors}
                        name={'timeFrame'}
                        label={'Time Frame'}
                        items={[
                            { label: '1m', value: '1m' },
                            { label: '3m', value: '3m' },
                            { label: '5m', value: '5m' },
                            { label: '15m', value: '15m' },
                            { label: '30m', value: '30m' },
                            { label: '1h', value: '1h' },
                            { label: '2h', value: '2h' },
                            { label: '4h', value: '4h' },
                            { label: '6h', value: '6h' },
                            { label: '8h', value: '8h' },
                            { label: '12h', value: '12h' },
                            { label: '1d', value: '1d' },
                            { label: '3d', value: '3d' },
                            { label: '1w', value: '1w' }
                        ]}
                    />

                    <Button variant='emerald' type='submit' className='w-full'>
                        Submit
                    </Button>
                </div>
            </form>
        </div>
    )
}
export default IndicatorForm
