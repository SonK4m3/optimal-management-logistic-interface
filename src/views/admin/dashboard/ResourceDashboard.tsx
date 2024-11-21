import { Card } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface ResourceDashboardProps {
    metrics: {
        totalResources: number
        activeResources: number
        utilizationRate: number
        costEfficiency: number
    }
    allocations: Array<{
        resourceId: string
        assignments: number
        utilization: number
        performance: number
    }>
}

const ResourceDashboard = ({ metrics }: ResourceDashboardProps) => {
    return (
        <div className='space-y-6 p-6'>
            {/* Overview Cards */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                <Card className='p-4'>
                    <div className='space-y-2'>
                        <p className='text-sm text-muted-foreground'>Total Resources</p>
                        <h3 className='text-2xl font-bold'>{metrics.totalResources}</h3>
                    </div>
                </Card>
                {/* Similar cards for other metrics */}
            </div>

            {/* Detailed Analysis Tabs */}
            <Tabs defaultValue='metrics'>
                <TabsList>
                    <TabsTrigger value='metrics'>Metrics</TabsTrigger>
                    <TabsTrigger value='allocation'>Allocation</TabsTrigger>
                    <TabsTrigger value='utilization'>Utilization</TabsTrigger>
                </TabsList>

                <TabsContent value='metrics'></TabsContent>
                <TabsContent value='allocation'></TabsContent>
                <TabsContent value='utilization'></TabsContent>
            </Tabs>
        </div>
    )
}

export default ResourceDashboard
