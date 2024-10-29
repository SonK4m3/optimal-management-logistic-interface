import React, { CSSProperties, useState } from 'react'
import { Box, Tabs } from '@radix-ui/themes'
import { cn } from '@/lib/utils.ts'

export interface Tab<T extends string> {
    title: string
    value: T
    content: React.ReactNode
}

interface TabsProps<T extends string> {
    className?: string
    style?: CSSProperties
    defaultValue: T
    tabs: Tab<T>[]
    onClick?: (value: T) => void
}

const UnderlineTabs = <T extends string>(props: TabsProps<T>) => {
    const { defaultValue, tabs, onClick: onClickTab, className, style } = props

    const [active, setActive] = useState<T>(defaultValue)

    return (
        <Tabs.Root
            value={active}
            onValueChange={value => {
                setActive(value as T)
                if (onClickTab) onClickTab(value as T)
            }}
        >
            <Tabs.List
                color='indigo'
                className={cn(
                    className,
                    'max-w-full overflow-y-scroll border-b border-color-neutral-50 justify-start items-center gap-0.5 flex'
                )}
            >
                {tabs.map(({ title, value }) => (
                    <Tabs.Trigger
                        key={`tab-trigger-${value}`}
                        value={`${value}`}
                        style={style}
                        className='h-8 px-3 rounded-lg justify-center items-center gap-2 inline-flex data-[state=active]:before:bg-color-brand-400'
                    >
                        <div className='pb-px rounded-lg flex-col justify-center items-start inline-flex'>
                            <div className='self-stretch text-base font-normal leading-normal'>
                                {title}
                            </div>
                        </div>
                    </Tabs.Trigger>
                ))}
            </Tabs.List>
            <Box pt='3'>
                {tabs.map(({ value, content }) => (
                    <Tabs.Content key={`tab-content-${value}`} value={`${value}`}>
                        {content}
                    </Tabs.Content>
                ))}
            </Box>
        </Tabs.Root>
    )
}

export { UnderlineTabs }
