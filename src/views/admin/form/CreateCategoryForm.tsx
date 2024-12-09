import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import RequestFactory from '@/services/RequestFactory'
import { useModalContext } from '@/contexts/ModalContext'

interface CreateCategoryFormProps {
    onSuccess: () => void
}

interface CreateCategoryBodyRequest {
    name: string
}

const CreateCategoryForm = ({ onSuccess }: CreateCategoryFormProps) => {
    const { register, handleSubmit } = useForm<CreateCategoryBodyRequest>({
        defaultValues: {
            name: 'Category'
        }
    })
    const productRequest = RequestFactory.getRequest('ProductRequest')
    const { closeModal } = useModalContext()

    const createCategory = async (data: CreateCategoryBodyRequest) => {
        try {
            await productRequest.createCategory(data)
            closeModal()
            onSuccess()
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <form onSubmit={handleSubmit(createCategory)} className='flex flex-col gap-4'>
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

export default CreateCategoryForm
