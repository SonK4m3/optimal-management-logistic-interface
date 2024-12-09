/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table'

/**
 * Column definition for table structure
 * @template T Type of data being displayed
 */
export type ColumnDef<T> = {
    header: string
    accessorKey: (keyof T & string) | 'action' | `${string}.${string}`
    className?: string
    footer?: string | number
    action?: (item: T) => React.ReactNode
    /**
     * Transform the value before displaying it
     * @param value The value to transform
     * @returns The transformed value
     */
    transform?: (value: any) => string | number | React.ReactNode
}

/**
 * Props interface for AppTable component
 * @template T Type of data being displayed
 */
interface AppTableProps<T> {
    data: T[]
    headers: ColumnDef<T>[]
    caption?: string
    footer?: boolean
}

/**
 * A reusable table component with support for custom headers, data transformation,
 * actions, and footer calculations
 * @template T Type of data being displayed
 */
const AppTable = <T extends Record<string, any>>({
    data,
    headers,
    caption,
    footer = false
}: AppTableProps<T>): React.ReactNode => {
    /**
     * Calculates footer values for numeric columns
     * @param accessorKey Key to access data field
     * @returns Sum for numeric columns, empty string for non-numeric
     */
    const getFooterValue = (accessorKey: keyof T): number | string => {
        if (!data.length) return ''
        if (typeof data[0][accessorKey] === 'number') {
            return data.reduce((sum, item) => sum + (item[accessorKey] as number), 0)
        }
        return ''
    }

    /**
     * Renders cell content based on header configuration
     * @param item Current data item
     * @param header Column definition
     * @returns Rendered cell content
     */
    const renderCellContent = (item: T, header: ColumnDef<T>): React.ReactNode => {
        if (header.accessorKey === 'action') {
            return header.action?.(item)
        }

        const value = header.accessorKey.includes('.')
            ? header.accessorKey.split('.').reduce((obj, key) => obj?.[key], item)
            : (item[header.accessorKey] as string | number)

        const transformedValue = header.transform ? header.transform(value) : value
        return header.action
            ? header.action(item)
            : typeof transformedValue === 'object'
              ? JSON.stringify(transformedValue)
              : transformedValue
    }

    if (!data.length) {
        return (
            <Table>
                {caption && <TableCaption>{caption}</TableCaption>}
                <TableHeader>
                    <TableRow>
                        {headers.map(header => (
                            <TableHead
                                key={String(header.accessorKey)}
                                className={header.className}
                            >
                                {header.header}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow>
                        <TableCell colSpan={headers.length} className='text-center'>
                            No data available
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        )
    }

    return (
        <Table>
            {caption && <TableCaption>{caption}</TableCaption>}
            <TableHeader>
                <TableRow>
                    {headers.map(header => (
                        <TableHead key={String(header.accessorKey)} className={header.className}>
                            {header.header}
                        </TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((item, index) => (
                    <TableRow key={index}>
                        {headers.map(header => (
                            <TableCell
                                key={`${index}-${String(header.accessorKey)}`}
                                className={header.className}
                            >
                                {renderCellContent(item, header)}
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
            {footer && (
                <TableFooter>
                    <TableRow>
                        {headers.map(header => (
                            <TableCell
                                key={`footer-${String(header.accessorKey)}`}
                                className={header.className}
                            >
                                {header.footer || getFooterValue(header.accessorKey)}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableFooter>
            )}
        </Table>
    )
}

export default AppTable
