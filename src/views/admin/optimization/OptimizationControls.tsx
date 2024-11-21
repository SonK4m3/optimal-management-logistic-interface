// src/components/optimization/OptimizationControls.tsx
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { toast } from '@/components/ui/use-toast'

interface OptimizationParams {
    costWeight: number
    timeWeight: number
    balanceWeight: number
    useHistoricalData: boolean
}

const OptimizationControls = () => {
    const [params, setParams] = useState<OptimizationParams>({
        costWeight: 0.4,
        timeWeight: 0.3,
        balanceWeight: 0.3,
        useHistoricalData: true
    })

    const handleOptimize = async () => {
        try {
            // Call optimization API
            toast({
                title: 'Optimization Started',
                description: 'The system is now optimizing resource allocation.'
            })
        } catch (error) {
            toast({
                title: 'Optimization Failed',
                description: 'An error occurred during optimization.',
                variant: 'destructive'
            })
        }
    }

    return (
        <div className='space-y-6 p-4 border rounded-lg'>
            <div className='space-y-4'>
                <h3 className='text-lg font-semibold'>Optimization Parameters</h3>

                <div className='space-y-2'>
                    <label className='text-sm font-medium'>Cost Weight</label>
                    <Slider
                        value={[params.costWeight]}
                        onValueChange={([value]) =>
                            setParams(prev => ({ ...prev, costWeight: value }))
                        }
                        max={1}
                        step={0.1}
                    />
                </div>

                {/* Similar controls for other weights */}

                <div className='flex items-center space-x-2'>
                    <Switch
                        checked={params.useHistoricalData}
                        onCheckedChange={checked =>
                            setParams(prev => ({ ...prev, useHistoricalData: checked }))
                        }
                    />
                    <label className='text-sm font-medium'>Use Historical Data</label>
                </div>
            </div>

            <Button onClick={handleOptimize} className='w-full'>
                Start Optimization
            </Button>
        </div>
    )
}

export default OptimizationControls
