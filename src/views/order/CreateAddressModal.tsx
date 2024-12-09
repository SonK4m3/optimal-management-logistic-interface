import AppMap from '@/components/AppMap'
import ColLabelValue from '@/components/ColLabelValue'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'
import { useModalContext } from '@/contexts/ModalContext'
import RequestFactory from '@/services/RequestFactory'
import { useState } from 'react'
import { HANOI_LOCATION } from '@/constant/enum'

interface CreateAddressModalProps {
    customerId: number
    onSuccess: () => void
}

const CreateAddressModal = ({ customerId, onSuccess }: CreateAddressModalProps) => {
    const [address, setAddress] = useState('')
    const [isDefault, setIsDefault] = useState(false)
    const [latitude, setLatitude] = useState(0)
    const [longitude, setLongitude] = useState(0)
    const request = RequestFactory.getRequest('ResourceRequest')
    const { closeModal } = useModalContext()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!address) {
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Address is required'
            })
            return
        }

        const payload = {
            address,
            isDefault,
            latitude,
            longitude
        }
        try {
            const response = await request.createCustomerAddress({ customerId, payload })
            if (response.success) {
                onSuccess()
                closeModal()
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <form onSubmit={handleSubmit} className='space-y-4' id='create-address-form'>
            <ColLabelValue
                label='Address'
                value={<Input value={address} onChange={e => setAddress(e.target.value)} />}
            />

            <AppMap
                center={[HANOI_LOCATION.LAT, HANOI_LOCATION.LNG]}
                zoom={15}
                currentMarker={{ lat: latitude, lng: longitude }}
                onMarkerClick={marker => {
                    setLatitude(marker.lat)
                    setLongitude(marker.lng)
                }}
            />

            <ColLabelValue
                label='Default'
                value={
                    <Checkbox
                        checked={isDefault}
                        onCheckedChange={value => setIsDefault(value as boolean)}
                    />
                }
            />

            <div>
                <Button type='submit' form='create-address-form'>
                    Create
                </Button>
            </div>
        </form>
    )
}

export default CreateAddressModal
