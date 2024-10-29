import React, { forwardRef } from 'react'
import { EmblaOptionsType } from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import { DotButton, useDotButton } from '@/components/EmblaCarouselDotButton.tsx'
import { clsx } from 'clsx'

type PropType<T> = {
    slides: T[]
    options?: EmblaOptionsType
    render: (value: T, index: number) => JSX.Element
}

type DivProps = React.HTMLProps<HTMLDivElement>

const Embla: React.FC<DivProps> = ({ children }) => {
    return <section className='max-w-full mx-auto'>{children}</section>
}

const EmblaViewport = forwardRef<HTMLDivElement, DivProps>(({ children = true }, ref) => {
    return (
        <div className='overflow-hidden' ref={ref}>
            {children}
        </div>
    )
})

const EmblaContainer: React.FC<DivProps> = ({ children }) => {
    return <div className='flex gap-2 mx-4 touch-pan-y touch-pinch-zoom'>{children}</div>
}

const EmblaSlider: React.FC<DivProps> = ({ children }) => {
    return <div className='flex-none w-full transform translate-z-0'>{children}</div>
}

const EmblaCarousel = <T,>(props: PropType<T>) => {
    const { slides, options, render } = props
    const [emblaRef, emblaApi] = useEmblaCarousel(options)
    const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(emblaApi)
    return (
        <Embla>
            <EmblaViewport ref={emblaRef}>
                <EmblaContainer>
                    {slides.map((value, index) => (
                        <EmblaSlider key={index}>{render(value, index)}</EmblaSlider>
                    ))}
                </EmblaContainer>
            </EmblaViewport>
            <div className='flex justify-center items-center mt-2 gap-1'>
                {scrollSnaps.map((_, index) => (
                    <DotButton
                        key={index}
                        onClick={() => onDotButtonClick(index)}
                        className={clsx('inline-flex items-center justify-center cursor-pointer', {
                            'w-7 h-1 bg-color-neutral-900 rounded-lg': index === selectedIndex,
                            'w-1 h-1 bg-color-neutral-500 rounded-lg': index !== selectedIndex
                        })}
                    />
                ))}
            </div>
        </Embla>
    )
}

export default EmblaCarousel
