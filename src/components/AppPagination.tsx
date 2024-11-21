import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious
} from '@/components/ui/pagination'

interface AppPaginationProps {
    totalDocs: number
    currentPage: number
    onPageChange: (page: number) => void
    className?: string
    maxVisiblePages?: number
}

export function AppPagination({
    totalDocs,
    currentPage,
    onPageChange,
    className,
    maxVisiblePages = 10
}: AppPaginationProps) {
    const totalPages = Math.ceil(totalDocs / maxVisiblePages)

    const handlePageChange = (newPage: number) => {
        if (newPage > 0 && newPage <= totalPages) {
            onPageChange(newPage)
        }
    }

    const renderPaginationItems = () => {
        const items = []
        const halfVisible = Math.floor(maxVisiblePages / 2)

        // Always show first page
        items.push(
            <PaginationItem key={1}>
                <PaginationLink isActive={currentPage === 1} onClick={() => handlePageChange(1)}>
                    1
                </PaginationLink>
            </PaginationItem>
        )

        const startPage = Math.max(2, currentPage - halfVisible)
        const endPage = Math.min(totalPages - 1, currentPage + halfVisible)

        // Show ellipsis after first page
        if (startPage > 2) {
            items.push(
                <PaginationItem key='ellipsis-1'>
                    <PaginationEllipsis />
                </PaginationItem>
            )
        }

        // Show middle pages
        for (let i = startPage; i <= endPage; i++) {
            items.push(
                <PaginationItem key={i}>
                    <PaginationLink
                        isActive={currentPage === i}
                        onClick={() => handlePageChange(i)}
                    >
                        {i}
                    </PaginationLink>
                </PaginationItem>
            )
        }

        // Show ellipsis before last page
        if (endPage < totalPages - 1) {
            items.push(
                <PaginationItem key='ellipsis-2'>
                    <PaginationEllipsis />
                </PaginationItem>
            )
        }

        // Always show last page
        if (totalPages > 1) {
            items.push(
                <PaginationItem key={totalPages}>
                    <PaginationLink
                        isActive={currentPage === totalPages}
                        onClick={() => handlePageChange(totalPages)}
                    >
                        {totalPages}
                    </PaginationLink>
                </PaginationItem>
            )
        }

        return items
    }

    return (
        <Pagination className={className}>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} />
                </PaginationItem>
                {renderPaginationItems()}
                <PaginationItem>
                    <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}
