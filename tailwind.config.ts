import type { Config } from "tailwindcss";

export default {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
			'rotate': {
				'0%': { transform: 'rotate(0deg)' },
				'100%': { transform: 'rotate(360deg)' },
			},
			'slide-in-from-top-full': {
				'0%': { transform: 'translateY(-100%)' },
				'100%': { transform: 'translateY(0)' }
			},
			'slide-in-from-bottom-full': {
				'0%': { transform: 'translateY(100%)' },
				'100%': { transform: 'translateY(0)' }
			},
			'slide-out-to-right-full': {
				'0%': { transform: 'translateX(0)' },
				'100%': { transform: 'translateX(100%)' }
			},
			'fade-in': {
				'0%': { opacity: '0' },
				'100%': { opacity: '1' }
			},
			'fade-out': {
				'0%': { opacity: '1' },
				'100%': { opacity: '0' }
			},
		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
			'rotate': 'rotate 0.5s linear',
			'in': 'fade-in 0.2s ease-out',
			'out': 'fade-out 0.2s ease-in',
			'slide-in-from-top-full': 'slide-in-from-top-full 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
			'slide-in-from-bottom-full': 'slide-in-from-bottom-full 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
			'slide-out-to-right-full': 'slide-out-to-right-full 0.3s cubic-bezier(0.22, 1, 0.36, 1)',
			'fade-out-80': 'fade-out 0.2s ease-in-out forwards 80%',
  		},
  		fontFamily: {
        sans: ['var(--font-geist)'],
        display: ['var(--font-cal)'],
        default: ['var(--font-geist)'],
  		},
  	}
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
