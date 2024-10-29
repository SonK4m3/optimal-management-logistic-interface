/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ['class'],
    content: [
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}'
    ],
    theme: {
        container: {
            center: true,
            padding: '1.5rem',
            screens: {
                '2xl': '1400px'
            }
        },
        extend: {
            colors: {
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))'
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))'
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))'
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))'
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))'
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))'
                },
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))'
                },
                brand01: '#dffe0f',
                brand02: '#69770d',
                brand: {
                    400: '#D8E881'
                },
                neutral: {
                    100: '#FFFFFF1A'
                },
                'color-accent-green-100': 'var(--color-accent-green-100)',
                'color-accent-green-200': 'var(--color-accent-green-200)',
                'color-accent-green-300': 'var(--color-accent-green-300)',
                'color-accent-green-500': 'var(--color-accent-green-500)',
                'color-accent-green-700': 'var(--color-accent-green-700)',
                'color-accent-green-900': 'var(--color-accent-green-900)',
                'color-accent-red-100': 'var(--color-accent-red-100)',
                'color-accent-red-200': 'var(--color-accent-red-200)',
                'color-accent-red-300': 'var(--color-accent-red-300)',
                'color-accent-red-500': 'var(--color-accent-red-500)',
                'color-accent-red-700': 'var(--color-accent-red-700)',
                'color-accent-red-900': 'var(--color-accent-red-900)',
                'color-brand-400': 'var(--color-brand-400)',
                'color-brand-500': 'var(--color-brand-500)',
                'color-brand-700': 'var(--color-brand-700)',
                'color-decorate-bronze': 'var(--color-decorate-bronze)',
                'color-decorate-gold': 'var(--color-decorate-gold)',
                'color-decorate-silver': 'var(--color-decorate-silver)',
                'color-neutral-100': 'var(--color-neutral-100)',
                'color-neutral-250': 'var(--color-neutral-250)',
                'color-neutral-50': 'var(--color-neutral-50)',
                'color-neutral-500': 'var(--color-neutral-500)',
                'color-neutral-700': 'var(--color-neutral-700)',
                'color-neutral-800': 'var(--color-neutral-800)',
                'color-neutral-900': 'var(--color-neutral-900)',
                'color-neutral-alpha-100': 'var(--color-neutral-alpha-100)',
                'color-neutral-alpha-250': 'var(--color-neutral-alpha-250)',
                'color-neutral-alpha-50': 'var(--color-neutral-alpha-50)',
                'color-neutral-alpha-500': 'var(--color-neutral-alpha-500)',
                'color-neutral-alpha-700': 'var(--color-neutral-alpha-700)',
                'color-neutral-alpha-800': 'var(--color-neutral-alpha-800)',
                'color-neutral-alpha-900': 'var(--color-neutral-alpha-900)',
                'color-emerald': 'rgb(19, 168, 161)'
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)'
            },
            keyframes: {
                'accordion-down': {
                    from: { height: 0 },
                    to: { height: 'var(--radix-accordion-content-height)' }
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: 0 }
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' }
                },
                fadeOut: {
                    '0%': { opacity: '1' },
                    '100%': { opacity: '0' }
                },
                slideDownAndFade: {
                    from: { opacity: '0', transform: 'translateY(-2px)' },
                    to: { opacity: '1', transform: 'translateY(0)' }
                },
                slideLeftAndFade: {
                    from: { opacity: '0', transform: 'translateX(2px)' },
                    to: { opacity: '1', transform: 'translateX(0)' }
                },
                slideUpAndFade: {
                    from: { opacity: '0', transform: 'translateY(2px)' },
                    to: { opacity: '1', transform: 'translateY(0)' }
                },
                slideRightAndFade: {
                    from: { opacity: '0', transform: 'translateX(-2px)' },
                    to: { opacity: '1', transform: 'translateX(0)' }
                },
                hide: {
                    from: { opacity: '1' },
                    to: { opacity: '0' }
                },
                slideIn: {
                    from: {
                        transform: 'translateX(calc(100% + var(--viewport-padding)))'
                    },
                    to: { transform: 'translateX(0)' }
                },
                swipeOut: {
                    from: {
                        transform: 'translateX(var(--radix-toast-swipe-end-x))'
                    },
                    to: {
                        transform: 'translateX(calc(100% + var(--viewport-padding)))'
                    }
                },
                blink: {
                    '50%': { opacity: '0' }
                }
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
                fadeIn: 'fadeIn 0.5s ease-in-out',
                fadeOut: 'fadeOut 0.5s ease-in-out',
                slideDownAndFade: 'slideDownAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
                slideLeftAndFade: 'slideLeftAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
                slideUpAndFade: 'slideUpAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
                slideRightAndFade: 'slideRightAndFade 400ms cubic-bezier(0.16, 1, 0.3, 1)',
                hide: 'hide 100ms ease-in',
                slideIn: 'slideIn 150ms cubic-bezier(0.16, 1, 0.3, 1)',
                swipeOut: 'swipeOut 100ms ease-out',
                blink: 'blink 1s steps(1) infinite'
            }
        }
    },
    plugins: [require('tailwindcss-animate')]
}
