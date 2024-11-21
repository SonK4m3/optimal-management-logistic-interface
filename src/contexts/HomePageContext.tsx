import RequestFactory from '@/services/RequestFactory'
import { createContext, useContext, useState, useCallback } from 'react'
import { Customer, Staff } from '@/types/resource'
import { toast } from '@/components/ui/use-toast'

interface HomePageContextType {
    customers: Customer[]
    staffs: Staff[]
    fetchCustomers: () => Promise<void>
    fetchStaffs: () => Promise<void>
    updateCustomerInfo: (
        id: number,
        info: {
            phone: string
            address: {
                address: string
                city: string
                country: string
                isDefault: boolean
                addressType: string
                recipientInfo: string
            }
        }
    ) => Promise<void>
    updateStaffInfo: (
        id: number,
        position: 'ADMIN' | 'DRIVER' | 'MANAGER' | 'CUSTOMER' | 'STAFF'
    ) => Promise<void>
}

const HomePageContext = createContext<HomePageContextType | undefined>(undefined)

const HomePageProvider = ({ children }: { children: React.ReactNode }) => {
    const requestResource = RequestFactory.getRequest('ResourceRequest')

    const [customers, setCustomers] = useState<Customer[]>([])
    const [staffs, setStaffs] = useState<Staff[]>([])

    const fetchCustomers = useCallback(async () => {
        try {
            const response = await requestResource.getAllCustomers()
            if (response.success) {
                setCustomers(response.data)
            }
        } catch (error) {
            console.error('Failed to fetch customers:', error)
        }
    }, [requestResource])

    const fetchStaffs = useCallback(async () => {
        try {
            const response = await requestResource.getAllStaffs()
            if (response.success) {
                setStaffs(response.data)
            }
        } catch (error) {
            console.error('Failed to fetch staffs:', error)
        }
    }, [requestResource])

    const updateCustomerInfo = useCallback(
        async (
            id: number,
            info: {
                phone: string
                address: {
                    address: string
                    city: string
                    country: string
                    isDefault: boolean
                    addressType: string
                    recipientInfo: string
                }
            }
        ) => {
            try {
                const response = await requestResource.updateCustomerInfo({ id, info })
                if (!response.success) {
                    toast({
                        title: 'Failed to update customer info',
                        description: response.message,
                        variant: 'success'
                    })
                    console.error('Failed to update customer info:', response.message)
                }
            } catch (error) {
                console.error('Error updating customer info:', error)
                toast({
                    title: 'Error updating customer info',
                    description: (error as Error).message,
                    variant: 'destructive'
                })
            }
        },
        [requestResource]
    )

    const updateStaffInfo = useCallback(
        async (id: number, position: 'ADMIN' | 'DRIVER' | 'MANAGER' | 'CUSTOMER' | 'STAFF') => {
            try {
                const response = await requestResource.updateStaffInfo({ id, position })
                if (!response.success) {
                    toast({
                        title: 'Failed to update staff info',
                        description: response.message,
                        variant: 'destructive'
                    })
                    console.error('Failed to update staff info:', response.message)
                }
            } catch (error) {
                console.error('Error updating staff info:', error)
                toast({
                    title: 'Error updating staff info',
                    description: (error as Error).message,
                    variant: 'destructive'
                })
            }
        },
        [requestResource]
    )

    return (
        <HomePageContext.Provider
            value={{
                customers,
                staffs,
                fetchCustomers,
                fetchStaffs,
                updateCustomerInfo,
                updateStaffInfo
            }}
        >
            {children}
        </HomePageContext.Provider>
    )
}

export const useHomePageContext = () => {
    const context = useContext(HomePageContext)
    if (context === undefined) {
        throw new Error('useHomePageContext must be used within a HomePageProvider')
    }
    return context
}

export default HomePageProvider
