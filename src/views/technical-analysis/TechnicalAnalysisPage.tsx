import Navbar from '@/components/Navbar'
import {
    TechnicalAnalysisProvider,
    useTechnicalAnalysisContext
} from '@/contexts/TechnicalAnalysisContext'
import clsx from 'clsx'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts'
import IndicatorForm from '../bot/IndicatorForm'
import { useMemo } from 'react'

const ChartLayout = () => {
    const { showChart, data } = useTechnicalAnalysisContext()

    const [minValue, maxValue] = useMemo(() => {
        if (!data?.length) return [0, 0]
    
        const values = data.map(item => item.values)
        return [Math.floor(Math.min(...values)), Math.ceil(Math.max(...values))]
    }, [data])
    
    const range = maxValue - minValue
    const step = Math.pow(10, Math.floor(Math.log10(range)) - 1)
    
    const domain = useMemo(() => {
        const roundedMaxValue = Math.ceil(maxValue / step) * step + step
        const roundedMinValue = Math.floor(minValue / step) * step - step
        return [roundedMinValue, roundedMaxValue]
    }, [minValue, maxValue, step])
    

    return (
        <div style={{ width: '100%', height: '400px' }}>
            {showChart && (
                <ResponsiveContainer width='100%' height='100%'>
                    <LineChart data={[...data, {}]} margin={{ left: 20, right: 20 }}>
                        <CartesianGrid strokeDasharray='3 3' stroke='#6A6A6A' />
                        <XAxis dataKey='time' stroke='#8884d8' interval={4} />
                        <YAxis
                            dataKey='values'
                            stroke='#8884d8'
                            domain={domain}
                            orientation='right'
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#333',
                                color: '#fff',
                                borderRadius: '5px',
                                padding: '10px'
                            }}
                        />
                        <Line
                            type='linear'
                            dataKey='values'
                            stroke='#8884d8'
                            strokeWidth={1}
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            )}
        </div>
    )
}

const TechnicalAnalysisPage: React.FC = () => {
    return (
        <div className={clsx('bg-background', 'w-full h-screen')}>
            <Navbar title='Technical Analysis' />
            <div className='w-full flex flex-col p-4'>
                <h1>BTC/USDT</h1>

                <TechnicalAnalysisProvider>
                    <IndicatorForm />
                    <ChartLayout />
                </TechnicalAnalysisProvider>
            </div>
        </div>
    )
}
export default TechnicalAnalysisPage
