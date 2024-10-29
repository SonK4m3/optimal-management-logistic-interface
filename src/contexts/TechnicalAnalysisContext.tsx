import { useToast } from '@/components/ui/use-toast'
import { timeFrameToMillis } from '@/lib/utils'
import RequestFactory from '@/services/RequestFactory'
import { IndicatorFormValue, TA } from '@/types'
import React, { createContext, useEffect, useRef, useState } from 'react'
import {
    Control,
    FormState,
    SubmitHandler,
    UseFormHandleSubmit,
    UseFormResetField
} from 'react-hook-form'
import { useForm } from 'react-hook-form'

interface TechnicalAnalysisContextProps {
    control: Control<IndicatorFormValue>
    handleSubmit: UseFormHandleSubmit<IndicatorFormValue>
    formState: FormState<IndicatorFormValue>
    onSubmit: SubmitHandler<IndicatorFormValue>
    showChart: boolean
    setShowChart: React.Dispatch<React.SetStateAction<boolean>>
    data: any[]
    setData: React.Dispatch<React.SetStateAction<TA[]>>
    resetField: UseFormResetField<IndicatorFormValue>
}

const TechnicalAnalysisContext = createContext<TechnicalAnalysisContextProps | undefined>(undefined)

export const TechnicalAnalysisProvider: React.FC<{ children: React.ReactNode }> = ({
    children
}) => {
    const [data, setData] = useState<any>([])
    const intervalRef = useRef<NodeJS.Timeout | null>(null)
    const [showChart, setShowChart] = useState(false)
    const request = RequestFactory.getRequest('TARequest')
    const { toast } = useToast()
    const { formState, handleSubmit, control, resetField } = useForm<IndicatorFormValue>({
        defaultValues: {
            indicatorName: 'RSI',
            period: 14,
            timeFrame: '1m'
        }
    })
    const fetchTA = async (query: string) => {
        try {
            const response = await request.getTA(query)
            if (response) {
                const chartData = response.map((item: any) => {
                    const date = new Date(item.timestamp)
                    const hours = date.getHours().toString().padStart(2, '0')
                    const minutes = date.getMinutes().toString().padStart(2, '0')
                    return {
                        time: `${hours}:${minutes}`,
                        values: Number(item.value)
                    }
                })                
                setShowChart(true)
                setData(chartData)
            }
        } catch (err) {
            toast({
                variant: 'destructive',
                title: 'Get TA Failure'
            })
            console.error(err)
        }
    }

    const onSubmit: SubmitHandler<IndicatorFormValue> = async data => {
        const { indicatorName, period, timeFrame, multiplier } = data

        let query = `BTCUSDT:indicator:${indicatorName}`
        if (multiplier) {
            query += `:multiplier_${multiplier}`
        }
        query += `:${period}:${timeFrame}`
    
        if (intervalRef.current) {
            clearInterval(intervalRef.current)
        }
    
        await fetchTA(query)
    
        intervalRef.current = setInterval(() => fetchTA(query), timeFrameToMillis(timeFrame))
    }

    useEffect(() => {
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }
        }
    }, [])

    return (
        <TechnicalAnalysisContext.Provider
            value={{
                formState,
                onSubmit,
                handleSubmit,
                control,
                setShowChart,
                showChart,
                data,
                setData,
                resetField
            }}
        >
            {children}
        </TechnicalAnalysisContext.Provider>
    )
}

export const useTechnicalAnalysisContext = (): TechnicalAnalysisContextProps => {
    const context = React.useContext(TechnicalAnalysisContext)
    if (context === undefined) {
        throw new Error(
            'useTechnicalAnalysisContext must be used within a TechnicalAnalysisProvider'
        )
    }
    return context
}
