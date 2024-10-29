import React, { useEffect, useState } from 'react'
import { cn } from '@/lib/utils.ts'

const DynamicHeightDiv = React.forwardRef<HTMLDivElement, React.ComponentProps<'div'>>(
    ({ children, className, ...props }, ref) => {
        const [contentHeight, setContentHeight] = useState<number>(0)

        useEffect(() => {
            const measureContentHeight = () => {
                const tempDiv = document.createElement('div')
                tempDiv.style.visibility = 'hidden'
                tempDiv.style.position = 'absolute'
                tempDiv.style.width = '100%'
                tempDiv.style.height = 'auto'
                tempDiv.style.whiteSpace = 'nowrap'
                tempDiv.innerHTML =
                    typeof children === 'string'
                        ? children
                        : ((children as React.ReactNode)?.toString() ?? '')
                document.body.appendChild(tempDiv)

                setContentHeight(tempDiv.offsetHeight)
                document.body.removeChild(tempDiv)
            }

            measureContentHeight()

            const handleResize = () => {
                measureContentHeight()
            }

            window.addEventListener('resize', handleResize, { passive: false })

            return () => {
                window.removeEventListener('resize', handleResize)
            }
        }, [children])

        return (
            <div
                className={cn('relative', className)}
                style={{ height: contentHeight }}
                ref={ref}
                {...props}
            >
                {children}
            </div>
        )
    }
)

export default DynamicHeightDiv
