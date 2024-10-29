import React, { createContext, useContext } from 'react'
import {
    Control,
    FormState,
    SubmitHandler,
    useForm,
    UseFormClearErrors,
    UseFormHandleSubmit,
    UseFormRegister,
    UseFormSetValue,
    UseFormWatch
} from 'react-hook-form'
import { CreateBotFormValues, MACondition, BBCondition, RSICondition } from '@/types'
import RequestFactory from '@/services/RequestFactory.ts'
import { BotRequestBody } from '@/types/request.ts'
import { useToast } from '@/components/ui/use-toast.ts'
import { BBPercentBConditionType, MAConditionType, SimpleConditionType } from '@/types/enum'
import { Link } from 'react-router-dom'

interface CreateBotContextProps {
    control: Control<CreateBotFormValues>
    register: UseFormRegister<CreateBotFormValues>
    handleSubmit: UseFormHandleSubmit<CreateBotFormValues>
    formState: FormState<CreateBotFormValues>
    setValue: UseFormSetValue<CreateBotFormValues>
    clearErrors: UseFormClearErrors<CreateBotFormValues>
    onSubmit: SubmitHandler<CreateBotFormValues>
    watch: UseFormWatch<CreateBotFormValues>
}

const CreateBotContext = createContext<CreateBotContextProps | undefined>(undefined)

export const CreateBotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const request = RequestFactory.getRequest('BotRequest')
    const { toast } = useToast()

    const {
        control,
        register,
        handleSubmit,
        formState,
        setValue,
        reset,
        clearErrors,
        setError,
        watch
    } = useForm<CreateBotFormValues>({
        defaultValues: {
            orderSize: 5,
            baseOrderCurrency: 'BTC',
            orderType: 'MARKET',
            orderSide: 'BUY',
            exchange: 'pancake',
            takeProfitPercentage: 100,
            stopLossPercentage: 8,
            poolId: '',
            poolName: '',
            walletAddress: '',
            baseAddress: '',
            quoteAddress: '',
            network: undefined,
            conditions: []
        }
    })

    const simpleConditionTypeList = Object.values(SimpleConditionType)
    const maconditionTypeList = Object.values(MAConditionType)
    const bbPercentBconditionTypeList = Object.values(BBPercentBConditionType)

    const onSubmit: SubmitHandler<CreateBotFormValues> = async data => {
        if (data.conditions?.length < 1) {
            setError('conditions', {
                message: 'Conditions must not be empty'
            })
            return
        }

        const payload: BotRequestBody = {
            strategy: {
                poolId: data.poolId,
                walletAddress: data.walletAddress,
                baseAddress: data.baseAddress,
                quoteAddress: data.quoteAddress,
                orderType: data.orderType,
                orderSize: Number(data.orderSize),
                network: data.network,
                exchange: data.exchange,
                orderSide: data.orderSide,
                stopLossPercentage: Number(data.stopLossPercentage),
                takeProfitPercentage: Number(data.takeProfitPercentage)
            },
            conditions: data.conditions.map(cond => {
                const baseCondition = {
                    pair: data.poolName,
                    indicatorName: cond.indicatorName,
                    conditionType: cond.conditionType,
                    timeFrame: cond.timeFrame,
                    operator: cond.operator
                }

                if (maconditionTypeList.includes(cond.conditionType as MAConditionType)) {
                    return {
                        ...baseCondition,
                        fastPeriod: Number((cond as MACondition).fastPeriod),
                        slowPeriod: Number((cond as MACondition).slowPeriod)
                    } as MACondition
                } else if (
                    bbPercentBconditionTypeList.includes(
                        cond.conditionType as BBPercentBConditionType
                    )
                ) {
                    return {
                        ...baseCondition,
                        period: Number((cond as BBCondition).period),
                        multiplier: Number((cond as BBCondition).multiplier),
                        signalValue: Number((cond as BBCondition).signalValue)
                    } as BBCondition
                } else if (
                    simpleConditionTypeList.includes(cond.conditionType as SimpleConditionType)
                ) {
                    return {
                        ...baseCondition,
                        period: Number((cond as RSICondition).period),
                        signalValue: Number((cond as RSICondition).signalValue)
                    } as RSICondition
                } else {
                    throw new Error(`Unsupported condition type: ${cond.conditionType}`)
                }
            })
        }
        try {
            const response = await request.createBot(payload)
            if (response) {
                reset()
                toast({
                    variant: 'success',
                    title: 'Create Bot Success',
                    description: (
                        <div>
                            View Bot details{' '}
                            <Link
                                className='text-blue-900 cursor-pointer'
                                to={`/bots/${response.botId}`}
                            >
                                here
                            </Link>
                        </div>
                    )
                })
            }
        } catch (err) {
            toast({
                variant: 'destructive',
                title: 'Create Bot Failure'
            })
            console.error(err)
        }
    }

    return (
        <CreateBotContext.Provider
            value={{
                control,
                register,
                handleSubmit,
                formState,
                setValue,
                clearErrors,
                onSubmit,
                watch
            }}
        >
            {children}
        </CreateBotContext.Provider>
    )
}

export const useCreateBotContext = (): CreateBotContextProps => {
    const context = useContext(CreateBotContext)
    if (context === undefined) {
        throw new Error('useCreateBotContext must be used within an CreateBotProvider')
    }
    return context
}
