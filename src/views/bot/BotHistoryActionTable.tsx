import React from 'react'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table.tsx'
import { useBotDetailContext } from '@/contexts/BotDetailContext'
import BotHistoryActionTableSkeleton from '@/components/skeleton/BotHistoryActionTableSkeleton'
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
    PaginationLink
} from '@/components/ui/pagination'

const BotHistoryActionTable: React.FC = () => {
    const {
        botActions,
        handleNextPage,
        handlePreviousPage,
        currentPage,
        hasNextPage,
        handlePageChange
    } = useBotDetailContext()

    if (botActions === undefined) {
        return <BotHistoryActionTableSkeleton />
    }

    if (botActions === null) {
        return (
            <div className='flex flex-col gap-2 mt-4'>
                <div className='text-lg font-semibold'>Actions history</div>
                <div className='flex flex-col gap-3'>No data</div>
            </div>
        )
    }

    return (
        <div className='flex flex-col gap-2 mt-4'>
            <div className='text-lg font-semibold'>Actions history</div>
            <div className='flex flex-col gap-3'>
                <Table className='bg-secondary/30 rounded'>
                    <TableCaption>
                        {botActions.length === 0 ? 'No data' : 'A history of bot actions.'}
                    </TableCaption>
                    <TableHeader className='shadow-md'>
                        <TableRow>
                            <TableHead className='w-[50%]'>Create time</TableHead>
                            <TableHead className='w-[50%] text-center'>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {botActions.map((botAction, index) => (
                            <TableRow key={`${botAction.createdAt}-${index}`}>
                                <TableCell className='w-[50%] font-medium'>
                                    {new Date(botAction.createdAt).toLocaleString()}
                                </TableCell>
                                <TableCell className='w-[50%] text-center'>
                                    <div className='inline-flex bg-color-accent-green-700 border-[1px] border-color-accent-green-900 px-3 py-1 rounded-lg'>
                                        {botAction.action}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter className='bg-background'>
                        <TableRow className='hover:bg-background'>
                            <TableCell colSpan={2}>
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                onClick={handlePreviousPage}
                                                isActive={currentPage > 1}
                                            />
                                        </PaginationItem>
                                        {currentPage > 1 && (
                                            <PaginationItem>
                                                <PaginationLink
                                                    onClick={() =>
                                                        handlePageChange(currentPage - 1)
                                                    }
                                                >
                                                    {currentPage - 1}
                                                </PaginationLink>
                                            </PaginationItem>
                                        )}
                                        <PaginationItem>
                                            <PaginationLink isActive>{currentPage}</PaginationLink>
                                        </PaginationItem>
                                        {hasNextPage && (
                                            <PaginationItem>
                                                <PaginationLink
                                                    onClick={() =>
                                                        handlePageChange(currentPage + 1)
                                                    }
                                                >
                                                    {currentPage + 1}
                                                </PaginationLink>
                                            </PaginationItem>
                                        )}
                                        <PaginationItem>
                                            <PaginationNext
                                                onClick={handleNextPage}
                                                isActive={hasNextPage}
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </div>
        </div>
    )
}

export default BotHistoryActionTable
