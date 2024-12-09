import { toast } from '@/components/ui/use-toast'
import RequestFactory from '@/services/RequestFactory'
import { RootState } from '@/store'
import { Receipt, Warehouse } from '@/types/warehouse'
import { Shipment } from '@/types/shipment'
import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'

interface WarehouseContextType {
    warehouses: Warehouse[]
    totalDocs: number
    fetchWarehouses: () => Promise<void>
    receipts: Receipt[]
    receiptTotalDocs: number
    fetchReceipts: (params: { warehouseId?: string; page?: number; size?: number }) => Promise<void>
    acceptReceipt: (id: number) => Promise<void>
    rejectReceipt: (id: number) => Promise<void>
    shipments: Shipment[]
    shipmentTotalDocs: number
    fetchShipments: (params: { page: number; size: number }) => Promise<void>
    confirmShipment: (id: number) => Promise<void>
    cancelShipment: (id: number) => Promise<void>
}

const WarehouseContext = createContext<WarehouseContextType | undefined>(undefined)

const WarehouseProvider = ({ children }: { children: React.ReactNode }) => {
    const requestWarehouse = RequestFactory.getRequest('WarehouseRequest')
    const requestShipment = RequestFactory.getRequest('ShipmentRequest')
    const accessToken = useSelector((state: RootState) => state.user.accessToken)

    const [warehouses, setWarehouses] = useState<Warehouse[]>([])
    const [totalDocs, setTotalDocs] = useState(1)

    const [receipts, setReceipts] = useState<Receipt[]>([])
    const [receiptTotalDocs, setReceiptTotalDocs] = useState(1)

    const [shipments, setShipments] = useState<Shipment[]>([])
    const [shipmentTotalDocs, setShipmentTotalDocs] = useState(1)

    const fetchWarehouses = useCallback(async () => {
        if (!accessToken) return

        try {
            const response = await requestWarehouse.getWarehouses()
            if (response.success) {
                setWarehouses(response.data.docs)
                setTotalDocs(response.data.totalDocs)
            }
        } catch (error) {
            console.error(error)
        }
    }, [accessToken, requestWarehouse])

    const fetchReceipts = useCallback(
        async ({
            warehouseId,
            page,
            size
        }: {
            warehouseId?: string
            page?: number
            size?: number
        }) => {
            if (!accessToken) return
            try {
                const response = await requestWarehouse.getReceipts({
                    warehouseId,
                    page,
                    size
                })
                if (response.success) {
                    setReceipts(response.data.docs)
                    setReceiptTotalDocs(response.data.totalDocs)
                }
            } catch (error) {
                console.error(error)
            }
        },
        [accessToken, requestWarehouse]
    )

    const fetchShipments = useCallback(
        async ({ page, size }: { page: number; size: number }) => {
            if (!accessToken) return
            try {
                const response = await requestShipment.getShipments({
                    page,
                    size
                })
                if (response.success) {
                    setShipments(response.data.docs)
                    setShipmentTotalDocs(response.data.totalDocs)
                }
            } catch (error) {
                console.error(error)
            }
        },
        [accessToken, requestShipment]
    )

    const acceptReceipt = useCallback(
        async (id: number) => {
            if (!accessToken) return
            try {
                const response = await requestWarehouse.confirmReceipt(id)
                if (response.success) {
                    fetchReceipts({
                        page: 1,
                        size: 10
                    })
                    toast({
                        title: 'Success',
                        description: 'Receipt accepted successfully',
                        variant: 'success'
                    })
                }
            } catch (error) {
                console.error(error)
                toast({
                    title: 'Error',
                    description:
                        error instanceof Error ? error.message : 'Failed to accept receipt',
                    variant: 'destructive'
                })
            } finally {
                fetchReceipts({
                    page: 1,
                    size: 10
                })
            }
        },
        [accessToken, fetchReceipts, requestWarehouse]
    )

    const rejectReceipt = useCallback(
        async (id: number) => {
            if (!accessToken) return
            try {
                const response = await requestWarehouse.rejectReceipt(id)
                if (response.success) {
                    toast({
                        title: 'Success',
                        description: 'Receipt rejected successfully',
                        variant: 'success'
                    })
                }
            } catch (error) {
                console.error(error)
                toast({
                    title: 'Error',
                    description:
                        error instanceof Error ? error.message : 'Failed to reject receipt',
                    variant: 'destructive'
                })
            } finally {
                fetchReceipts({
                    page: 1,
                    size: 10
                })
            }
        },
        [accessToken, fetchReceipts, requestWarehouse]
    )

    const confirmShipment = useCallback(async (id: number) => {
        try {
            const response = await requestShipment.confirmShipment(id.toString())
            if (response.success) {
                toast({
                    title: 'Success',
                    description: 'Shipment confirmed successfully',
                    variant: 'success'
                })
                fetchShipments({
                    page: 1,
                    size: 10
                })
            }
        } catch (error) {
            console.error(error)
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to confirm shipment',
                variant: 'destructive'
            })
        }
    }, [])

    const cancelShipment = useCallback(async (id: number) => {
        try {
            const response = await requestShipment.cancelShipment(id.toString())
            if (response.success) {
                toast({
                    title: 'Success',
                    description: 'Shipment canceled successfully',
                    variant: 'success'
                })
                fetchShipments({
                    page: 1,
                    size: 10
                })
            }
        } catch (error) {
            console.error(error)
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to cancel shipment',
                variant: 'destructive'
            })
        }
    }, [])

    useEffect(() => {
        fetchWarehouses()
    }, [accessToken])

    return (
        <WarehouseContext.Provider
            value={{
                warehouses,
                totalDocs,
                fetchWarehouses,
                receipts,
                receiptTotalDocs,
                fetchReceipts,
                acceptReceipt,
                rejectReceipt,
                shipments,
                shipmentTotalDocs,
                fetchShipments,
                confirmShipment,
                cancelShipment
            }}
        >
            {children}
        </WarehouseContext.Provider>
    )
}

export const useWarehouseContext = () => {
    const context = useContext(WarehouseContext)
    if (context === undefined) {
        throw new Error('useWarehouseContext must be used within a WarehouseProvider')
    }
    return context
}

export default WarehouseProvider
