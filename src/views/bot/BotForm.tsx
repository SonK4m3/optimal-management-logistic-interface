import React, { Fragment, useEffect, useMemo, useState } from 'react'
import { useCreateBotContext } from '@/contexts/CreateBotContext.tsx'
import { clsx } from 'clsx'
import { Input } from '@/components/ui/input.tsx'
import { Button } from '@/components/ui/button.tsx'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group.tsx'
import { Switch } from '@/components/ui/switch.tsx'
import {
    Control,
    Controller,
    FieldArrayWithId,
    FieldErrors,
    useFieldArray,
    UseFormSetValue,
    useWatch
} from 'react-hook-form'
import { ChainType, CreateBotFormValues, InputFieldNames } from '@/types'
import { Plus, X } from 'lucide-react'
import { formatNumberWithCommas, standardizeString, truncateString } from '@/lib/utils'
import { useWalletContext, WalletProvider } from '@/contexts/WalletContext'
import { useAuthContext } from '@/contexts/AuthContext'
import useOauth from '@/hooks/useOauth'
import { useNavigate } from 'react-router-dom'
import useFetchExchange from '@/hooks/useFetchExchange'
import useBalance from '@/hooks/useBalance'
import BalanceWidgetSkeleton from '@/components/skeleton/BalanceWidgetSkeleton'
import useNativeBalance from '@/hooks/useNativeBalance'
import {
    BBPercentBConditionName,
    BBPercentBConditionType,
    MAConditionName,
    MAConditionType,
    SimpleConditionType,
    SimpleIndicatorName
} from '@/types/enum'

const chainTypeMap: Record<ChainType, string> = {
    BSC_MAINNET: 'BSC Mainnet',
    BSC_TESTNET: 'BSC Testnet',
    BITCOIN_MAINNET: 'Bitcoin Mainnet',
    BITCOIN_TESTNET: 'Bitcoin Testnet',
    ETH_MAINNET: 'ETH Mainnet',
    ETH_TESTNET: 'ETH Testnet'
}

const WidgetContainer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div
            className={clsx('bg-secondary rounded-lg flex flex-col gap-4 shadow-lg', 'w-full p-4')}
        >
            {children}
        </div>
    )
}

const BInput: React.FC<{
    control: Control<CreateBotFormValues>
    errors: FieldErrors<CreateBotFormValues>
    name: keyof CreateBotFormValues
    label: string
    placeholder?: string
    type?: 'text' | 'number'
}> = ({ control, errors, name, label, placeholder, type = 'number' }) => {
    const _renderError = () => {
        const names = (name as string).split('.')

        if (names[0] === 'conditions' && names.length === 3) {
            const conditionIndex = parseInt(names[1], 10)
            const field = names[2]

            if (!errors || !errors.conditions) return null

            if ((errors?.conditions?.[conditionIndex] as Record<string, unknown>)?.[field]) {
                return (
                    <p className='text-red-400'>
                        {
                            (
                                errors.conditions[conditionIndex] as Record<
                                    string,
                                    { message: string }
                                >
                            )[field]?.message
                        }
                    </p>
                )
            }
        }

        return null
    }

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
                        value={field.value ? field.value.toString() : ''}
                    />
                )}
            />
            {name.startsWith('conditions')
                ? _renderError()
                : errors[name] && <p className='text-red-400'>{errors[name]?.message as string}</p>}
        </div>
    )
}

const BSelect: React.FC<{
    control: Control<CreateBotFormValues>
    errors: FieldErrors<CreateBotFormValues>
    setValue: UseFormSetValue<CreateBotFormValues>
    name: keyof CreateBotFormValues
    label: string
    placeholder?: string
    items: { value: string; label: string }[]
    onCallBack?: (value: string) => void
}> = ({ control, errors, name, label, items, onCallBack }) => {
    return (
        <div className='col-span-1 flex-1 min-w-[100px]'>
            <label htmlFor={name as string} className='text-white text-nowrap'>
                {label}
            </label>
            <Controller
                name={name}
                control={control}
                rules={{ required: 'This field is required' }}
                render={({ field: { value, onChange } }) => (
                    <select
                        id={name as string}
                        value={value ? value.toString() : ''}
                        onChange={e => {
                            onChange(e)
                            if (onCallBack) {
                                onCallBack(e.target.value)
                            }
                        }}
                        className='mt-2 bg-gray-800 text-white border border-gray-600 rounded-md p-2 w-full'
                    >
                        {items.map(item => (
                            <option
                                key={item.value}
                                value={item.value}
                                className='bg-gray-800 text-white'
                            >
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

const BToggle: React.FC<{
    control: Control<CreateBotFormValues>
    errors: FieldErrors<CreateBotFormValues>
    name: InputFieldNames<CreateBotFormValues>
    label: string
    items: { value: string; label: string }[]
}> = ({ control, errors, name, label, items }) => {
    return (
        <div className='col-span-1 flex-1'>
            <label htmlFor={name} className='text-white'>
                {label}
            </label>
            <Controller
                name={name}
                control={control}
                rules={{ required: 'This field is required' }}
                render={({ field: { onChange, value } }) => (
                    <ToggleGroup
                        type='single'
                        className='mt-2 w-full bg-gray-800 rounded-lg'
                        value={value.toString()}
                        onValueChange={onChange}
                        aria-label={label}
                    >
                        {items.map(item => (
                            <ToggleGroupItem
                                className='w-full bg-gray-800 text-white hover:bg-gray-600 m-1'
                                key={item.value}
                                value={item.value}
                                aria-label={item.label}
                            >
                                {item.label}
                            </ToggleGroupItem>
                        ))}
                    </ToggleGroup>
                )}
            />
            {errors[name] && <p className='text-red-500'>{errors[name]?.message as string}</p>}
        </div>
    )
}

const BSwitch: React.FC<{
    label: string
    content: React.ReactNode
    onSwitch?: (value: boolean) => void
    disabled?: boolean
    defaultValue?: boolean
}> = ({ label, content, onSwitch, disabled = false, defaultValue = true }) => {
    const [checked, setChecked] = useState(defaultValue)

    const handleSwitchChange = (checked: boolean) => {
        setChecked(checked)
        if (onSwitch) onSwitch(checked)
    }

    return (
        <div className='flex flex-col gap-4'>
            <div className='flex justify-start items-center gap-2'>
                <label htmlFor={`${label}-mode`}>{label}</label>
                <Switch
                    className='mt-2'
                    id={`${label}-mode`}
                    checked={checked}
                    onCheckedChange={handleSwitchChange}
                    disabled={disabled}
                />
            </div>
            {checked && <div>{content}</div>}
        </div>
    )
}

const ConditionInputItem = React.memo(
    ({
        field,
        index,
        remove
    }: {
        field: FieldArrayWithId<CreateBotFormValues, 'conditions', 'id'>
        index: number
        remove: (index: number) => void
    }) => {
        const {
            control,
            setValue,
            formState: { errors }
        } = useCreateBotContext()

        const conditionType = useWatch({
            control,
            name: `conditions.${index}.conditionType` as keyof CreateBotFormValues
        })

        const maconditionNameList = Object.values(MAConditionName)

        const simpleConditionTypeList = Object.values(SimpleConditionType)
        const maconditionTypeList = Object.values(MAConditionType)
        const bbPercentBconditionTypeList = Object.values(BBPercentBConditionType)

        const renderConditionTypeSpecificInputs = () => {
            if (maconditionTypeList.includes(conditionType as MAConditionType)) {
                return (
                    <>
                        <div className='col-span-2'>
                            <BSelect
                                control={control}
                                errors={errors}
                                setValue={setValue}
                                name={
                                    `conditions.${index}.indicatorName` as keyof CreateBotFormValues
                                }
                                label='MA Name'
                                items={maconditionNameList.map(name => ({
                                    label: name,
                                    value: name
                                }))}
                            />
                        </div>
                        <BInput
                            control={control}
                            errors={errors}
                            name={`conditions.${index}.fastPeriod` as keyof CreateBotFormValues}
                            label='Fast Period'
                        />
                        <BInput
                            control={control}
                            errors={errors}
                            name={`conditions.${index}.slowPeriod` as keyof CreateBotFormValues}
                            label='Slow Period'
                        />
                    </>
                )
            } else if (
                bbPercentBconditionTypeList.includes(conditionType as BBPercentBConditionType)
            ) {
                return (
                    <>
                        <div className='col-span-2 grid grid-cols-2 gap-2'>
                            <BInput
                                control={control}
                                errors={errors}
                                name={`conditions.${index}.period` as keyof CreateBotFormValues}
                                label='Period'
                            />
                            <BInput
                                control={control}
                                errors={errors}
                                name={`conditions.${index}.multiplier` as keyof CreateBotFormValues}
                                label='Multiplier'
                            />
                        </div>
                    </>
                )
            } else if (simpleConditionTypeList.includes(conditionType as SimpleConditionType)) {
                return (
                    <>
                        <BInput
                            control={control}
                            errors={errors}
                            name={`conditions.${index}.period` as keyof CreateBotFormValues}
                            label='Period'
                        />
                    </>
                )
            } else {
                return null
            }
        }

        useEffect(() => {
            if (maconditionTypeList.includes(conditionType as MAConditionType)) {
                setValue(`conditions.${index}.indicatorName`, MAConditionName.SMA)
            } else if (
                bbPercentBconditionTypeList.includes(conditionType as BBPercentBConditionType)
            ) {
                setValue(`conditions.${index}.indicatorName`, BBPercentBConditionName.BBPercentB)
            } else if (simpleConditionTypeList.includes(conditionType as SimpleConditionType)) {
                setValue(`conditions.${index}.indicatorName`, conditionType as SimpleIndicatorName)
            }
        }, [conditionType, setValue])

        return (
            <div key={field.id} className='grid grid-cols-2 gap-4 bg-background rounded-lg p-4'>
                <div>Condition {index + 1}</div>
                <div className='col-span-4 flex flex-wrap gap-4'>
                    <div className='w-full grid grid-cols-2 gap-4'>
                        <div className='col-span-2 grid grid-cols-2 gap-2'>
                            <div className='col-span-2 w-full flex-2 flex justify-between items-center gap-4'>
                                <BSelect
                                    control={control}
                                    setValue={setValue}
                                    errors={errors}
                                    name={
                                        `conditions.${index}.conditionType` as keyof CreateBotFormValues
                                    }
                                    label='Type'
                                    items={[
                                        ...simpleConditionTypeList,
                                        ...maconditionTypeList,
                                        ...bbPercentBconditionTypeList
                                    ].map(name => ({
                                        label: name,
                                        value: name
                                    }))}
                                />
                                <Button
                                    variant='destructive'
                                    size='icon'
                                    onClick={() => remove(index)}
                                    type='button'
                                    className='mt-6'
                                >
                                    <X size={16} />
                                </Button>
                            </div>
                            {renderConditionTypeSpecificInputs()}
                        </div>
                    </div>
                    <BSelect
                        control={control}
                        errors={errors}
                        setValue={setValue}
                        name={`conditions.${index}.timeFrame` as keyof CreateBotFormValues}
                        label='Timeframe'
                        items={[
                            { label: '1 second', value: '1s' },
                            { label: '1 minute', value: '1m' },
                            { label: '3 minutes', value: '3m' },
                            { label: '5 minutes', value: '5m' },
                            { label: '15 minutes', value: '15m' },
                            { label: '30 minutes', value: '30m' },
                            { label: '1 hour', value: '1h' },
                            { label: '2 hours', value: '2h' },
                            { label: '4 hours', value: '4h' },
                            { label: '6 hours', value: '6h' },
                            { label: '8 hours', value: '8h' },
                            { label: '12 hours', value: '12h' },
                            { label: '1 day', value: '1d' },
                            { label: '3 days', value: '3d' },
                            { label: '1 week', value: '1w' },
                            { label: '1 month', value: '1M' }
                        ]}
                    />
                    <BSelect
                        control={control}
                        errors={errors}
                        setValue={setValue}
                        name={`conditions.${index}.operator` as keyof CreateBotFormValues}
                        label='Operator'
                        items={[
                            { label: 'Greater than', value: 'GREATER_THAN' },
                            { label: 'Less than', value: 'LESS_THAN' },
                            { label: 'Equal', value: 'EQUAL' },
                            { label: 'Greater than or equal', value: 'GREATER_THAN_OR_EQUAL' },
                            { label: 'Less than or equal', value: 'LESS_THAN_OR_EQUAL' },
                            { label: 'Crossing up', value: 'CROSSING_UP' },
                            { label: 'Crossing down', value: 'CROSSING_DOWN' }
                        ]}
                    />
                    <BInput
                        control={control}
                        errors={errors}
                        name={`conditions.${index}.signalValue` as keyof CreateBotFormValues}
                        label='Signal value'
                    />
                </div>
            </div>
        )
    }
)

ConditionInputItem.displayName = 'ConditionInputItem'

const ConditionInput = () => {
    const { control, clearErrors } = useCreateBotContext()

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'conditions'
    })

    return (
        <div className='flex flex-col gap-4 p-4'>
            {fields.map((field, index) => (
                <Fragment key={field.id}>
                    <ConditionInputItem field={field} index={index} remove={remove} />
                </Fragment>
            ))}

            <Button
                variant={'emerald'}
                size={'icon'}
                type='button'
                onClick={() => {
                    clearErrors()
                    append({
                        pair: '',
                        indicatorName: SimpleIndicatorName.RSI,
                        conditionType: SimpleConditionType.RSI,
                        period: 0,
                        timeFrame: '1m',
                        operator: 'GREATER_THAN',
                        signalValue: 0
                    })
                }}
            >
                <Plus size={16} />
            </Button>
        </div>
    )
}

const ConditionsWidget = () => {
    const {
        control,
        formState: { errors }
    } = useCreateBotContext()

    return (
        <WidgetContainer>
            <div className='col-span-2'>
                <BInput
                    control={control}
                    errors={errors}
                    name={'takeProfitPercentage'}
                    label={'Take Profit'}
                />
                <BSwitch label={'Conditions'} content={<ConditionInput />} disabled={true} />
                <p className='text-red-500'>{errors.conditions?.message}</p>
            </div>
        </WidgetContainer>
    )
}
const StrategyWidget = () => {
    const {
        control,
        formState: { errors }
    } = useCreateBotContext()

    return (
        <WidgetContainer>
            <h2>Strategy</h2>
            <div className='grid grid-cols-1 form:grid-cols-2 bg-background rounded-lg p-4 gap-4'>
                <div className='col-span-1 flex space-x-4'>
                    <BToggle
                        control={control}
                        errors={errors}
                        name={'orderSide'}
                        label={'Strategy'}
                        items={[
                            { label: 'Long', value: 'BUY' },
                            { label: 'Short', value: 'SELL' }
                        ]}
                    />
                    <BToggle
                        control={control}
                        errors={errors}
                        name={'orderType'}
                        label={'Start order type'}
                        items={[
                            { label: 'Market', value: 'MARKET' },
                            { label: 'Limit', value: 'LIMIT' }
                        ]}
                    />
                </div>
                <div className='col-span-1 flex space-x-4'>
                    <BInput
                        control={control}
                        errors={errors}
                        name={'orderSize'}
                        label={'Order size'}
                    />
                    <div className='flex flex-col justify-end pb-2'>BTC</div>
                </div>
            </div>
        </WidgetContainer>
    )
}

const SummaryItem = ({ label, value }: { label: string; value: string | number | undefined }) => {
    return (
        <div className='flex-1 flex'>
            <div className='text-gray-500'>{label}</div>
            <div className='flex-1 border-b border-dashed border-gray-600'></div>
            <div className=''>{value ?? ''}</div>
        </div>
    )
}

const Summary = () => {
    const { control } = useCreateBotContext()
    const botInfo = useWatch({ control })
    const { isLogin } = useAuthContext()
    const { authenticate } = useOauth()

    const handleLogin = () => {
        if (!isLogin) {
            authenticate('GOOGLE').connectMethod()
        }
    }
    return (
        <WidgetContainer>
            <h2>Summary</h2>
            <div className='mt-4 flex flex-col gap-2'>
                <SummaryItem
                    label='Pool Id:'
                    value={botInfo.poolId ? truncateString(botInfo.poolId, 10, 3, 3) : ''}
                />
                <SummaryItem
                    label='Wallet:'
                    value={
                        botInfo.walletAddress ? truncateString(botInfo.walletAddress, 10, 3, 3) : ''
                    }
                />
                <SummaryItem
                    label='Base Address:'
                    value={botInfo.baseAddress ? truncateString(botInfo.baseAddress, 10, 3, 3) : ''}
                />
                <SummaryItem
                    label='Quote Address:'
                    value={
                        botInfo.quoteAddress ? truncateString(botInfo.quoteAddress, 10, 3, 3) : ''
                    }
                />
                <SummaryItem
                    label='Network:'
                    value={botInfo.network ? chainTypeMap[botInfo.network] : ''}
                />
                <SummaryItem label='Exchange:' value={botInfo.exchange} />
                <SummaryItem
                    label='Strategy:'
                    value={standardizeString(botInfo.orderSide === 'BUY' ? 'Long' : 'Short')}
                />
                <SummaryItem label='Order Type:' value={standardizeString(botInfo.orderType)} />
                <SummaryItem
                    label='Order Size:'
                    value={`${botInfo.orderSize} ${botInfo.baseOrderCurrency}`}
                />
                <SummaryItem label='Take Profit:' value={`${botInfo.takeProfitPercentage}%`} />
                <SummaryItem label='Stop Loss:' value={`${botInfo.stopLossPercentage}%`} />
                <SummaryItem label='Conditions:' value={botInfo.conditions?.length} />
            </div>
            <div className='w-full flex flex-col mt-4'>
                <Button
                    variant='emerald'
                    type={isLogin ? 'submit' : 'button'}
                    onClick={handleLogin}
                >
                    {isLogin ? 'Submit' : 'Login to submit'}
                </Button>
            </div>
        </WidgetContainer>
    )
}

const WalletAddressSelectField = () => {
    const {
        control,
        setValue,
        formState: { errors },
        watch
    } = useCreateBotContext()
    const { myWallets } = useWalletContext()
    const navigate = useNavigate()

    // Watch for changes in the 'network' field
    const selectedChain = watch('network')

    const filteredWallets = useMemo(() => {
        return myWallets?.filter(wallet => wallet.network === selectedChain) || []
    }, [myWallets, selectedChain])

    useEffect(() => {
        if (filteredWallets.length > 0) {
            setValue('walletAddress', filteredWallets[0].walletAddress)
        } else {
            // Clear the wallet address if there are no matching wallets
            setValue('walletAddress', '')
        }
    }, [filteredWallets, setValue])

    return (
        <div className='flex flex-col gap-2'>
            <div className='flex gap-4'>
                <BSelect
                    control={control}
                    errors={errors}
                    setValue={setValue}
                    name={'walletAddress'}
                    label={'Wallet Address'}
                    items={filteredWallets.map(wallet => ({
                        label: `${truncateString(wallet.walletAddress, 10, 5, 3)}`,
                        value: wallet.walletAddress
                    }))}
                />
                <div className='flex flex-col justify-end pb-1'>
                    <Button
                        variant={'brand'}
                        size={'sm'}
                        type='button'
                        onClick={() => {
                            navigate('/wallet/generate')
                        }}
                    >
                        Generate Wallet
                    </Button>
                </div>
            </div>
        </div>
    )
}

const BalanceWidget: React.FC<{
    network: ChainType
    walletAddress: string
    tokenAddress: string
}> = ({ network, walletAddress, tokenAddress }) => {
    const { balance, symbol, name, isLoading } = useBalance({
        network: network,
        walletAddress: walletAddress,
        tokenAddress: tokenAddress
    })

    if (isLoading) {
        return <BalanceWidgetSkeleton />
    }

    if (!balance || !symbol || !name) {
        return (
            <div className='w-full flex justify-between gap-2 text-sm text-gray-500'>
                No balance
            </div>
        )
    }

    return (
        <div className='w-full flex justify-between gap-2 text-sm'>
            <div className='text-gray-500'>{name}:</div>{' '}
            <div>
                {balance} {symbol}
            </div>
        </div>
    )
}

const NativeBalanceWidget: React.FC<{
    network: ChainType
    walletAddress: string
}> = ({ network, walletAddress }) => {
    const { balance, symbol, name, isLoading } = useNativeBalance({
        network: network,
        walletAddress: walletAddress
    })

    if (isLoading) {
        return <BalanceWidgetSkeleton />
    }

    if (!balance || !symbol || !name) {
        return (
            <div className='w-full flex justify-between gap-2 text-sm text-gray-500'>
                No native balance
            </div>
        )
    }

    return (
        <div className='w-full flex justify-between gap-2 text-sm'>
            <div className='text-gray-500'>{name}:</div>{' '}
            <div>
                {formatNumberWithCommas(balance)} {symbol}
            </div>
        </div>
    )
}

const GeneralSettingsWidget = () => {
    const {
        control,
        setValue,
        formState: { errors },
        watch
    } = useCreateBotContext()
    const { networks } = useFetchExchange()

    const selectedNetwork = watch('network')
    const selectedPool = watch('poolId')
    const walletAddress = watch('walletAddress')

    const poolItems = useMemo(() => {
        return (
            networks
                ?.filter(network => network.name === selectedNetwork)
                .flatMap(network =>
                    network.pools.map(pool => ({
                        name: network.name,
                        pool: pool
                    }))
                ) ?? []
        )
    }, [networks, selectedNetwork])

    const baseAddress = useMemo(() => {
        const address =
            networks
                ?.find(network => network.name === selectedNetwork)
                ?.pools.find(pool => pool.poolId === selectedPool)?.baseAddress ?? ''
        return address
    }, [networks, selectedNetwork, selectedPool])

    const quoteAddress = useMemo(() => {
        const address =
            networks
                ?.find(network => network.name === selectedNetwork)
                ?.pools.find(pool => pool.poolId === selectedPool)?.quoteAddress ?? ''
        return address
    }, [networks, selectedNetwork, selectedPool])

    useEffect(() => {
        if (networks && networks.length > 0) {
            setValue('network', networks[0].name)
        }
    }, [networks, setValue])

    useEffect(() => {
        if (poolItems.length > 0) {
            setValue('poolId', poolItems[0].pool.poolId)
        }
    }, [poolItems, setValue])

    useEffect(() => {
        if (quoteAddress) {
            setValue('quoteAddress', quoteAddress)
        }
    }, [quoteAddress, setValue])

    useEffect(() => {
        if (baseAddress) {
            setValue('baseAddress', baseAddress)
        }
    }, [baseAddress, setValue])

    useEffect(() => {
        if (selectedPool) {
            setValue(
                'poolName',
                poolItems.find(item => item.pool.poolId === selectedPool)?.pool.poolSymbol ?? ''
            )
        }
    }, [poolItems, selectedPool, setValue])

    return (
        <WidgetContainer>
            <h2>General Settings</h2>
            <div className='grid grid-cols-1 form:grid-cols-2 bg-background rounded-lg p-4 gap-4'>
                <div className='col-span-1 flex space-x-4'>
                    <BSelect
                        control={control}
                        errors={errors}
                        setValue={setValue}
                        name={'network'}
                        label={'Network'}
                        items={
                            networks?.map(network => ({
                                label: chainTypeMap[network.name],
                                value: network.name
                            })) ?? []
                        }
                    />
                    <BSelect
                        control={control}
                        errors={errors}
                        setValue={setValue}
                        name={'poolId'}
                        label={'Pool'}
                        items={poolItems.map(item => ({
                            label: `${item.pool.poolSymbol}`,
                            value: item.pool.poolId
                        }))}
                    />
                </div>
                <div className='col-span-1 grid grid-cols-2 gap-4'>
                    <NativeBalanceWidget network={selectedNetwork} walletAddress={walletAddress} />
                </div>
                <div className='col-span-1 flex flex-col gap-4'>
                    <WalletProvider>
                        <WalletAddressSelectField />
                        {selectedPool && (
                            <div className='w-full grid grid-cols-2 items-center gap-4'>
                                <BalanceWidget
                                    network={selectedNetwork}
                                    walletAddress={walletAddress}
                                    tokenAddress={baseAddress}
                                />
                                <BalanceWidget
                                    network={selectedNetwork}
                                    walletAddress={walletAddress}
                                    tokenAddress={quoteAddress}
                                />
                            </div>
                        )}
                    </WalletProvider>
                    <BSelect
                        control={control}
                        errors={errors}
                        setValue={setValue}
                        name={'exchange'}
                        label={'Exchange'}
                        items={[
                            { label: 'Pancake', value: 'pancake' },
                            { label: 'Binance', value: 'binance' }
                        ]}
                    />
                </div>
            </div>
        </WidgetContainer>
    )
}

const StopLossWidget = () => {
    const {
        control,
        formState: { errors }
    } = useCreateBotContext()

    return (
        <WidgetContainer>
            <BInput
                control={control}
                errors={errors}
                name={'stopLossPercentage'}
                label={'Stop Loss'}
            />
        </WidgetContainer>
    )
}

const BotForm: React.FC = () => {
    const { handleSubmit, onSubmit } = useCreateBotContext()

    return (
        <div className={clsx('bg-background rounded-lg', 'relative')}>
            <form className={clsx('grid grid-cols-3 gap-2')} onSubmit={handleSubmit(onSubmit)}>
                <div className='col-span-2 flex flex-col gap-4'>
                    <GeneralSettingsWidget />
                    <StrategyWidget />
                    <ConditionsWidget />
                    <StopLossWidget />
                </div>
                <div className='col-span-1'>
                    <div className='sticky top-10'>
                        <Summary />
                    </div>
                </div>
            </form>
        </div>
    )
}

export default BotForm
