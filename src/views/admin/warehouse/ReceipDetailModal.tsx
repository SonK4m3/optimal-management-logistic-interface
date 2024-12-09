import FlexLabelValue from '@/components/FlexLabelValue'
import { RECEIPT_STATUS } from '@/constant/enum'
import { Receipt } from '@/types/warehouse'
import { Shipment } from '@/types/shipment'
interface ReceipDetailModalProps {
    receipt: Receipt | Shipment
}

export default function ReceipDetailModal({ receipt }: ReceipDetailModalProps) {
    const isReceipt = (receipt: Receipt | Shipment): receipt is Receipt => {
        return (receipt as Receipt).receiptNumber !== undefined
    }

    if (isReceipt(receipt)) {
        return (
            <div className='flex flex-col gap-3 p-4 bg-gray-900 rounded-lg shadow-sm'>
                <FlexLabelValue
                    label='Receipt Number'
                    value={
                        <div className='font-bold text-end text-primary-600'>
                            {receipt.receiptNumber}
                        </div>
                    }
                />
                <div className='grid grid-cols-2 gap-4'>
                    <FlexLabelValue
                        label='Created At'
                        value={receipt.createdAt}
                        className='bg-gray-800 p-2 rounded'
                    />
                    <FlexLabelValue
                        label='Status'
                        value={
                            <span
                                className={`px-2 py-1 rounded-full text-sm ${
                                    receipt.status === RECEIPT_STATUS.APPROVED
                                        ? 'bg-green-100 text-green-800'
                                        : receipt.status === RECEIPT_STATUS.PENDING
                                          ? 'bg-yellow-100 text-yellow-800'
                                          : 'bg-gray-400 text-gray-800'
                                }`}
                            >
                                {receipt.status}
                            </span>
                        }
                    />
                </div>
                <div className='grid grid-cols-2 gap-4'>
                    <FlexLabelValue
                        label='Type'
                        value={receipt.type}
                        className='bg-gray-800 p-2 rounded'
                    />
                    <FlexLabelValue
                        label='Storage Location'
                        value={`${receipt.storageLocation.storageArea.name} - ${receipt.storageLocation.storageArea.warehouse.name}`}
                        className='bg-gray-800 p-2 rounded'
                    />
                </div>
                <div className='border-t pt-3'>
                    <FlexLabelValue
                        label='Created By'
                        value={receipt.createdBy}
                        className='font-medium'
                    />
                    {receipt.confirmedBy && (
                        <FlexLabelValue
                            label='Confirmed By'
                            value={receipt.confirmedBy}
                            className='font-medium'
                        />
                    )}
                    {receipt.confirmedAt && (
                        <FlexLabelValue
                            label='Confirmed At'
                            value={receipt.confirmedAt}
                            className='text-gray-600'
                        />
                    )}
                </div>
                {receipt.notes && (
                    <div className='border-t pt-3'>
                        <FlexLabelValue
                            label='Notes'
                            value={receipt.notes}
                            className='italic text-gray-600'
                        />
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className='flex flex-col gap-3 p-4 bg-gray-900 rounded-lg shadow-sm'>
            <FlexLabelValue
                label='Receipt Number'
                value={<div className='font-bold text-end text-primary-600'>{receipt.code}</div>}
            />
            <div className='grid grid-cols-2 gap-4'>
                <FlexLabelValue
                    label='Created At'
                    value={receipt.createdAt}
                    className='bg-gray-800 p-2 rounded'
                />
                <FlexLabelValue
                    label='Status'
                    value={
                        <span
                            className={`px-2 py-1 rounded-full text-sm ${
                                receipt.status === 'CONFIRMED'
                                    ? 'bg-green-100 text-green-800'
                                    : receipt.status === 'PENDING'
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : 'bg-red-500 text-white'
                            }`}
                        >
                            {receipt.status}
                        </span>
                    }
                />
            </div>
            <div className='border-t pt-3'>
                <FlexLabelValue
                    label='Shipment Date'
                    value={receipt.shipmentDate}
                    className='font-medium'
                />
                <FlexLabelValue
                    label='Warehouse'
                    value={receipt.warehouse.name}
                    className='font-medium'
                />
                <FlexLabelValue
                    label='Created By'
                    value={receipt.createdBy.username}
                    className='font-medium'
                />
                <FlexLabelValue
                    label='Created At'
                    value={receipt.createdAt}
                    className='text-gray-600'
                />
                {receipt.confirmedBy && (
                    <FlexLabelValue
                        label='Confirmed By'
                        value={receipt.confirmedBy.username}
                        className='text-gray-600'
                    />
                )}
                {receipt.confirmedAt && (
                    <FlexLabelValue
                        label='Confirmed At'
                        value={receipt.confirmedAt}
                        className='text-gray-600'
                    />
                )}
            </div>
            {receipt.notes && (
                <div className='border-t pt-3'>
                    <FlexLabelValue
                        label='Notes'
                        value={receipt.notes}
                        className='italic text-gray-600'
                    />
                </div>
            )}
            {receipt.details.length > 0 && (
                <div className='border-t pt-3 flex flex-col gap-2'>
                    {receipt.details.map(detail => (
                        <div key={detail.id} className='flex items-center gap-2'>
                            <div className='w-10 h-10 bg-gray-800 rounded-full'></div>
                            <FlexLabelValue
                                className='flex-1'
                                label='Product'
                                value={detail.product.name}
                            />
                            <FlexLabelValue label='Quantity' value={detail.quantity} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
