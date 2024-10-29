import { clsx } from 'clsx'
import Navbar from '@/components/Navbar'
import { useEffect } from 'react'

interface BaseLayoutProps {
    children?: React.ReactNode
    title: string
    actions?: React.ReactNode
    titleTab?: string
}

const BaseLayout: React.FC<BaseLayoutProps> = ({ children, title, actions, titleTab }) => {
    useEffect(() => {
        if (titleTab) document.title = titleTab
    }, [titleTab])

    return (
        <section className={clsx('bg-background', 'w-full h-screen')}>
            <Navbar title={title} actions={actions} />
            <div className='flex flex-col gap-4 p-4'>{children}</div>
        </section>
    )
}

export default BaseLayout
