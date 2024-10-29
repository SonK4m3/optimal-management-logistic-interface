import React, { createContext, useContext, useState } from 'react'
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerTitle
} from '@/components/ui/drawer.tsx'
import { clsx } from 'clsx'

interface DrawerContextReturnValue {
    openDrawer: (data: {
        title?: React.ReactNode
        description?: React.ReactNode
        content: React.ReactNode
        footer?: React.ReactNode
        background?: string
        transparent?: boolean
    }) => void
    closeDrawer: () => void
}

interface DrawerProviderProps {
    children: React.ReactNode
}

const DrawerContext = createContext<DrawerContextReturnValue | undefined>(undefined)

interface DrawerProps {
    open: boolean
    title?: React.ReactNode
    description?: React.ReactNode
    content?: React.ReactNode
    footer?: React.ReactNode
    background?: string
    transparent?: boolean
}

const initialDrawer: DrawerProps = {
    open: false
}

const DrawerProvider: React.FC<DrawerProviderProps> = ({ children }) => {
    const [drawer, setDrawer] = useState<DrawerProps>(initialDrawer)

    const openDrawer = (data: {
        title?: React.ReactNode
        description?: React.ReactNode
        content: React.ReactNode
        footer?: React.ReactNode
        background?: string
        transparent?: boolean
    }) => {
        setDrawer({
            open: true,
            title: data.title,
            description: data.description,
            content: data.content,
            footer: data.footer,
            background: data.background,
            transparent: data.transparent
        })
    }

    const closeDrawer = () => {
        setDrawer({ ...initialDrawer, open: false })
    }

    return (
        <DrawerContext.Provider value={{ openDrawer, closeDrawer }}>
            {children}
            <Drawer
                open={drawer.open}
                onOpenChange={open => setDrawer(prevState => ({ ...prevState, open: open }))}
                modal={true}
                shouldScaleBackground={true}
                disablePreventScroll={true}
            >
                <DrawerContent transparent={drawer.transparent} background={drawer.background}>
                    <div className={clsx('max-h-screen', 'overflow-y-scroll scrollbar-hidden')}>
                        <DrawerTitle>{drawer.title}</DrawerTitle>
                        <DrawerDescription>{drawer.description}</DrawerDescription>
                        {drawer.content}
                        <DrawerFooter>{drawer.footer}</DrawerFooter>
                    </div>
                </DrawerContent>
            </Drawer>
        </DrawerContext.Provider>
    )
}

export const useDrawerContext = () => {
    const context = useContext(DrawerContext)
    if (context === undefined) {
        throw new Error('useDrawerContext must be used within an DrawerProvider')
    }
    return context
}

export default DrawerProvider
