import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import RequestFactory from '@/services/RequestFactory'
import { useModalContext } from '@/contexts/ModalContext'

interface CreateSupplierFormProps {
    onSuccess: () => void
}

interface CreateSupplierBodyRequest {
    name: string
}

const CreateSupplierForm = ({ onSuccess }: CreateSupplierFormProps) => {
    const { register, handleSubmit } = useForm<CreateSupplierBodyRequest>({
        defaultValues: {
            name: 'Supplier'
        }
    })
    const productRequest = RequestFactory.getRequest('ProductRequest')
    const { closeModal } = useModalContext()

    const createSupplier = async (data: CreateSupplierBodyRequest) => {
        try {
            await productRequest.createSupplier(data)
            closeModal()
            onSuccess()
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <form onSubmit={handleSubmit(createSupplier)} className='flex flex-col gap-4'>
            <div className='flex flex-col gap-4'>
                <label htmlFor='name'>Name</label>
                <Input {...register('name')} />
            </div>
            <div className='flex justify-end'>
                <Button variant='successSolid' type='submit'>
                    Create
                </Button>
            </div>
        </form>
    )
}

export default CreateSupplierForm
