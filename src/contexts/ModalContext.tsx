import React, { createContext, useContext, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog'
import { clsx } from 'clsx'

interface ModalContextReturnValue {
    openModal: (data: {
        title?: React.ReactNode
        description?: React.ReactNode
        content: React.ReactNode
        footer?: React.ReactNode
        className?: string
    }) => void
    closeModal: () => void
}

interface ModalProviderProps {
    children: React.ReactNode
}

const ModalContext = createContext<ModalContextReturnValue | undefined>(undefined)

interface ModalProps {
    open: boolean
    title?: React.ReactNode
    description?: React.ReactNode
    content?: React.ReactNode
    footer?: React.ReactNode
    className?: string
}

const initialModal: ModalProps = {
    open: false
}

const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
    const [modal, setModal] = useState<ModalProps>(initialModal)

    const openModal = (data: {
        title?: React.ReactNode
        description?: React.ReactNode
        content: React.ReactNode
        footer?: React.ReactNode
        className?: string
    }) => {
        setModal({
            open: true,
            title: data.title,
            description: data.description,
            content: data.content,
            footer: data.footer,
            className: data.className
        })
    }

    const closeModal = () => {
        setModal({ ...initialModal, open: false })
    }

    return (
        <ModalContext.Provider value={{ openModal, closeModal }}>
            {children}
            <Dialog open={modal.open} onOpenChange={open => setModal(prev => ({ ...prev, open }))}>
                <DialogContent
                    className={clsx('max-h-screen overflow-y-auto', modal.className)}
                    onInteractOutside={e => {
                        e.preventDefault()
                    }}
                >
                    <DialogHeader>
                        <DialogTitle>{modal.title ?? ''}</DialogTitle>
                        <DialogDescription>{modal.description ?? ''}</DialogDescription>
                    </DialogHeader>
                    {modal.content}
                    {modal.footer && <DialogFooter>{modal.footer}</DialogFooter>}
                </DialogContent>
            </Dialog>
        </ModalContext.Provider>
    )
}

export const useModalContext = () => {
    const context = useContext(ModalContext)
    if (context === undefined) {
        throw new Error('useModalContext must be used within a ModalProvider')
    }
    return context
}

export default ModalProvider
