import { AppResponse, DocsResponseWithPagination } from '@/types/response'
import { Product, Category, Supplier } from '@/types/product'
import BaseRequest from './BaseRequest'
import { CreateProductBodyRequest } from '@/types/request'

export default class ProductRequest extends BaseRequest {
    async getProducts(params: { query: string; page: number; size: number }) {
        return await this.get<AppResponse<DocsResponseWithPagination<Product>>>(
            `/products?query=${params.query}&page=${params.page}&size=${params.size}`
        )
    }

    async createProduct(data: CreateProductBodyRequest) {
        return await this.post<AppResponse<Product>>('/products', data)
    }

    async getProductById(id: string) {
        return await this.get<AppResponse<Product>>(`/products/${id}`)
    }

    async getCategories(params: { page: number; size: number }) {
        return await this.get<AppResponse<DocsResponseWithPagination<Category>>>(
            `/categories?page=${params.page}&size=${params.size}`
        )
    }

    async getSuppliers(params: { page: number; size: number }) {
        return await this.get<AppResponse<DocsResponseWithPagination<Supplier>>>(
            `/suppliers?page=${params.page}&size=${params.size}`
        )
    }

    async createSupplier(data: { name: string }) {
        return await this.post<AppResponse<Supplier>>('/suppliers', data)
    }

    async createCategory(data: { name: string }) {
        return await this.post<AppResponse<Category>>('/categories', data)
    }
}
