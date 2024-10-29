import PropTypes from 'prop-types'

interface Props {
    size:
        | 'sixteen'
        | 'twenty-four'
        | 'twenty-eight'
        | 'forty-eight'
        | 'zero'
        | 'eighty'
        | 'twenty'
        | 'thirty-two'
        | 'forty'
        | 'sixty-four'
    BG: boolean
    badge: boolean
    icon: JSX.Element
}

export const IconSet = ({ size, BG, badge, icon }: Props): JSX.Element => {
    return (
        <div
            className={`!flex-[0_0_auto] ${size === 'zero' ? 'w-4' : ''} ${
                size === 'zero'
                    ? '[display:var(--show-icon-show-icon)]'
                    : '[display:var(--show-icon-show-icon,inline-flex)]'
            } ${
                size === 'eighty' ||
                size === 'forty-eight' ||
                size === 'forty' ||
                size === 'sixteen' ||
                size === 'sixty-four' ||
                size === 'thirty-two' ||
                size === 'twenty-eight' ||
                size === 'twenty-four' ||
                size === 'twenty'
                    ? 'items-center'
                    : ''
            } ${
                size === 'sixty-four' && BG
                    ? 'pt-[var(--spacing-12-duplicate)] pr-[var(--spacing-12-duplicate)] pb-[var(--spacing-12-duplicate)] pl-[var(--spacing-12-duplicate)]'
                    : size === 'eighty' && BG
                      ? 'pt-[var(--spacing-16-duplicate)] pr-[var(--spacing-16-duplicate)] pb-[var(--spacing-16-duplicate)] pl-[var(--spacing-16-duplicate)]'
                      : BG && ['forty-eight', 'forty'].includes(size)
                        ? 'pt-[var(--spacing-8-duplicate)] pr-[var(--spacing-8-duplicate)] pb-[var(--spacing-8-duplicate)] pl-[var(--spacing-8-duplicate)]'
                        : BG && size === 'thirty-two'
                          ? 'pt-[var(--spacing-6)] pr-[var(--spacing-6)] pb-[var(--spacing-6)] pl-[var(--spacing-6)]'
                          : size === 'twenty-eight' && BG
                            ? 'p-[5px]'
                            : size === 'twenty-four' && BG
                              ? 'p-1'
                              : BG && size === 'twenty'
                                ? 'p-[3px]'
                                : size === 'sixteen' && BG
                                  ? 'pt-[var(--spacing-2-duplicate)] pr-[var(--spacing-2-duplicate)] pb-[var(--spacing-2-duplicate)] pl-[var(--spacing-2-duplicate)]'
                                  : ''
            } ${size === 'zero' ? 'h-4' : ''} ${
                size === 'eighty' && BG
                    ? 'rounded-xl'
                    : BG && ['twenty-eight', 'twenty-four'].includes(size)
                      ? 'rounded-md'
                      : BG && size === 'twenty'
                        ? 'rounded-[var(--corner-radius-4-duplicate)]'
                        : size === 'sixteen' && BG
                          ? 'rounded'
                          : 'rounded-lg'
            } ${
                size === 'eighty' ||
                size === 'forty-eight' ||
                size === 'forty' ||
                size === 'sixteen' ||
                size === 'sixty-four' ||
                size === 'thirty-two' ||
                size === 'twenty-eight' ||
                size === 'twenty-four' ||
                size === 'twenty'
                    ? 'justify-center'
                    : ''
            } ${BG ? 'bg-color-neutral-alpha-500' : ''} ${
                size === 'eighty' ||
                size === 'forty-eight' ||
                size === 'forty' ||
                size === 'sixteen' ||
                size === 'sixty-four' ||
                size === 'thirty-two' ||
                size === 'twenty-eight' ||
                size === 'twenty-four' ||
                size === 'twenty'
                    ? 'relative'
                    : ''
            }`}
        >
            {((!badge && size === 'eighty') ||
                (!badge && size === 'forty-eight') ||
                (!badge && size === 'forty') ||
                (!badge && size === 'sixteen') ||
                (!badge && size === 'sixty-four') ||
                (!badge && size === 'thirty-two') ||
                (!badge && size === 'twenty-eight') ||
                (!badge && size === 'twenty-four') ||
                (!badge && size === 'twenty')) && <>{icon}</>}

            {((!BG && badge && size === 'twenty-four') ||
                (BG && badge && size === 'sixteen') ||
                (badge && size === 'eighty') ||
                (badge && size === 'forty-eight') ||
                (badge && size === 'forty') ||
                (badge && size === 'sixty-four') ||
                (badge && size === 'thirty-two') ||
                (badge && size === 'twenty-eight') ||
                (badge && size === 'twenty')) && (
                <div
                    className={
                        size === 'eighty' && !BG
                            ? '!relative !w-20 !h-20'
                            : !BG && size === 'sixty-four'
                              ? '!relative !w-16 !h-16'
                              : (BG && size === 'sixty-four') || (!BG && size === 'forty')
                                ? '!relative !w-10 !h-10'
                                : (BG && size === 'forty-eight') || (!BG && size === 'thirty-two')
                                  ? '!relative !w-8 !h-8'
                                  : size === 'twenty-four' || (BG && size === 'forty')
                                    ? '!relative !w-6 !h-6'
                                    : (BG && size === 'thirty-two') || (!BG && size === 'twenty')
                                      ? '!relative !w-5 !h-5'
                                      : !BG && size === 'twenty-eight'
                                        ? '!relative !w-7 !h-7'
                                        : size === 'twenty-eight' && BG
                                          ? '!relative !w-[18px] !h-[18px]'
                                          : BG && size === 'twenty'
                                            ? '!relative !w-3.5 !h-3.5'
                                            : size === 'sixteen'
                                              ? '!relative !w-3 !h-3'
                                              : '!relative !w-12 !h-12'
                    }
                    color='white'
                />
            )}

            {badge && (BG || size === 'sixteen') && (!BG || size === 'twenty-four') && (
                <div className='!relative !w-4 !h-4'></div>
            )}

            {badge && (
                <div
                    className={`absolute ${
                        ['eighty', 'sixty-four'].includes(size)
                            ? 'w-6'
                            : ['forty-eight', 'forty', 'thirty-two'].includes(size)
                              ? 'w-4'
                              : size === 'twenty-eight'
                                ? 'w-3.5'
                                : ['sixteen', 'twenty-four', 'twenty'].includes(size)
                                  ? 'w-3'
                                  : ''
                    } ${
                        size === 'eighty' && !BG
                            ? 'left-12'
                            : !BG && size === 'sixty-four'
                              ? 'left-8'
                              : size === 'eighty' && BG
                                ? 'left-[52px]'
                                : size === 'sixty-four' && BG
                                  ? 'left-9'
                                  : size === 'forty-eight'
                                    ? 'left-[26px]'
                                    : size === 'forty'
                                      ? 'left-[22px]'
                                      : size === 'thirty-two'
                                        ? 'left-4'
                                        : size === 'twenty-eight'
                                          ? 'left-3.5'
                                          : size === 'twenty-four'
                                            ? 'left-3'
                                            : size === 'twenty'
                                              ? 'left-2.5'
                                              : size === 'sixteen'
                                                ? 'left-2'
                                                : ''
                    } ${
                        !BG && ['eighty', 'sixty-four'].includes(size)
                            ? 'top-0'
                            : BG && ['eighty', 'sixty-four'].includes(size)
                              ? 'top-1'
                              : ['forty-eight', 'forty'].includes(size)
                                ? '-top-0.5'
                                : ['thirty-two', 'twenty-eight', 'twenty-four', 'twenty'].includes(
                                        size
                                    )
                                  ? '-top-1'
                                  : size === 'sixteen'
                                    ? '-top-1.5'
                                    : ''
                    } ${
                        ['eighty', 'sixty-four'].includes(size)
                            ? 'h-6'
                            : ['forty-eight', 'forty', 'thirty-two'].includes(size)
                              ? 'h-4'
                              : size === 'twenty-eight'
                                ? 'h-3.5'
                                : ['sixteen', 'twenty-four', 'twenty'].includes(size)
                                  ? 'h-3'
                                  : ''
                    }`}
                >
                    <div
                        className={`bg-color-brand-400 relative ${
                            ['eighty', 'sixty-four'].includes(size)
                                ? 'w-[9px]'
                                : ['forty-eight', 'forty', 'thirty-two'].includes(size)
                                  ? 'w-1.5'
                                  : size === 'twenty-eight'
                                    ? 'w-[5px]'
                                    : ['sixteen', 'twenty-four', 'twenty'].includes(size)
                                      ? 'w-1'
                                      : ''
                        } ${
                            ['eighty', 'sixty-four'].includes(size)
                                ? 'left-2'
                                : ['forty-eight', 'forty', 'thirty-two'].includes(size)
                                  ? 'left-[5px]'
                                  : ['sixteen', 'twenty-eight', 'twenty-four', 'twenty'].includes(
                                          size
                                      )
                                    ? 'left-1'
                                    : ''
                        } ${
                            ['eighty', 'sixty-four'].includes(size)
                                ? 'top-2'
                                : ['forty-eight', 'forty', 'thirty-two'].includes(size)
                                  ? 'top-[5px]'
                                  : ['sixteen', 'twenty-eight', 'twenty-four', 'twenty'].includes(
                                          size
                                      )
                                    ? 'top-1'
                                    : ''
                        } ${
                            ['eighty', 'sixty-four'].includes(size)
                                ? 'h-[9px]'
                                : ['forty-eight', 'forty', 'thirty-two'].includes(size)
                                  ? 'h-1.5'
                                  : size === 'twenty-eight'
                                    ? 'h-[5px]'
                                    : ['sixteen', 'twenty-four', 'twenty'].includes(size)
                                      ? 'h-1'
                                      : ''
                        } ${
                            ['eighty', 'sixty-four'].includes(size)
                                ? 'rounded-[4.5px]'
                                : ['forty-eight', 'forty', 'thirty-two'].includes(size)
                                  ? 'rounded-[3px]'
                                  : !BG && size === 'twenty-eight'
                                    ? 'rounded-[2.62px]'
                                    : size === 'twenty-eight' && BG
                                      ? 'rounded-[2.63px]'
                                      : ['sixteen', 'twenty-four', 'twenty'].includes(size)
                                        ? 'rounded-[2.25px]'
                                        : ''
                        }`}
                    />
                </div>
            )}
        </div>
    )
}

IconSet.propTypes = {
    size: PropTypes.oneOf([
        'sixteen',
        'twenty-four',
        'twenty-eight',
        'forty-eight',
        'zero',
        'eighty',
        'twenty',
        'thirty-two',
        'forty',
        'sixty-four'
    ]),
    BG: PropTypes.bool,
    badge: PropTypes.bool
}
