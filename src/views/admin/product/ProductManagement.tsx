import { useCallback, useEffect, useState } from 'react'
import CreateProductForm from '@/views/admin/form/CreateProductForm'
import { Product } from '@/types/product'
import ModalProvider, { useModalContext } from '@/contexts/ModalContext'
import { Button } from '@/components/ui/button'
import AppTable, { ColumnDef } from '@/components/AppTable'
import { AppPagination } from '@/components/AppPagination'
import RequestFactory from '@/services/RequestFactory'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'

const PAGE_SIZE = 10

const ProductManagement = () => {
    const accessToken = useSelector((state: RootState) => state.user.accessToken)
    const request = RequestFactory.getRequest('ProductRequest')
    const { openModal, closeModal } = useModalContext()
    const [currentPage, setCurrentPage] = useState(1)
    const [products, setProducts] = useState<Product[]>([])
    const [totalDocs, setTotalDocs] = useState(0)

    const productHeaders: ColumnDef<Product>[] = [
        {
            header: 'Code',
            accessorKey: 'code'
        },
        {
            header: 'Name',
            accessorKey: 'name'
        },
        {
            header: 'Price',
            accessorKey: 'price'
        },
        {
            header: 'Weight',
            accessorKey: 'weight'
        },
        {
            header: 'Unit',
            accessorKey: 'unit'
        },
        {
            header: 'Dimensions',
            accessorKey: 'dimensions'
        },
        {
            header: 'Category',
            accessorKey: 'category.name'
        },
        {
            header: 'Supplier',
            accessorKey: 'supplier.name'
        }
    ]

    const fetchProducts = useCallback(async () => {
        if (!accessToken) return
        const response = await request.getProducts({
            query: '',
            page: currentPage,
            size: PAGE_SIZE
        })
        setProducts(response.data.docs)
        setTotalDocs(response.data.totalDocs)
    }, [accessToken, currentPage, request])

    const handleAddProduct = () => {
        openModal({
            title: 'Create Product',
            content: (
                <ModalProvider>
                    <CreateProductForm
                        onSuccess={() => {
                            fetchProducts()
                            closeModal()
                        }}
                        length={products.length + 1}
                    />
                </ModalProvider>
            )
        })
    }

    useEffect(() => {
        fetchProducts()
    }, [fetchProducts])

    return (
        <div>
            <div className='flex justify-between items-center'>
                <h1 className='text-2xl font-bold'>Product Management</h1>
                <div className='flex gap-2'>
                    <Button variant='brand' type='button' onClick={handleAddProduct}>
                        Add Product
                    </Button>
                </div>
            </div>
            <AppTable data={products} headers={productHeaders} />
            <AppPagination
                maxVisiblePages={PAGE_SIZE}
                totalDocs={totalDocs}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
            />
        </div>
    )
}

export default ProductManagement
