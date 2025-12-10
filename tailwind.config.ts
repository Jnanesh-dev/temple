import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        temple: {
          maroon: '#8B0000',
          'maroon-dark': '#5C0000',
          'maroon-light': '#A52A2A',
          gold: '#D4AF37',
          'gold-light': '#F4E4BC',
          'off-white': '#FAF8F3',
          'earth-brown': '#8B7355',
          'earth-tan': '#D2B48C',
        },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'serif'],
        sans: ['var(--font-sans)', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
export default config

