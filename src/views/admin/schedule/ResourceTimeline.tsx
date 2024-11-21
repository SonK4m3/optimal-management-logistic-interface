import { Timeline, TimelineItem } from '@/components/ui/timeline'
import { ScrollArea } from '@/components/ui/scroll-area'

interface TimelineProps {
    schedules: Array<{
        resourceId: string
        assignments: Array<{
            id: string
            start: Date
            end: Date
            type: string
            location: string
        }>
    }>
}

const ResourceTimeline = ({ schedules }: TimelineProps) => {
    return (
        <ScrollArea className='h-[500px]'>
            <div className='space-y-6 p-4'>
                {schedules.map(schedule => (
                    <div key={schedule.resourceId} className='space-y-2'>
                        <h4 className='font-medium'>Resource {schedule.resourceId}</h4>
                        <Timeline>
                            {schedule.assignments.map(assignment => (
                                <TimelineItem
                                    key={assignment.id}
                                    time={assignment.start}
                                    title={assignment.type}
                                    description={assignment.location}
                                />
                            ))}
                        </Timeline>
                    </div>
                ))}
            </div>
        </ScrollArea>
    )
}

export default ResourceTimeline
