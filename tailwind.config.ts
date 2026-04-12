import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#121212",
        foreground: "#ededed",
      },
      animation: {
        flicker: 'flicker 5s infinite',
        'light-leak': 'light-leak 8s ease-in-out infinite alternate',
        'light-leak-2': 'light-leak-2 10s ease-in-out infinite alternate',
      },
      keyframes: {
        flicker: {
          '0%, 19.999%, 22%, 62.999%, 64%, 64.999%, 70%, 100%': { opacity: '0.99' },
          '20%, 21.999%, 63%, 63.999%, 65%, 69.999%': { opacity: '0.95' },
        },
        'light-leak': {
          '0%': { transform: 'scale(1) translate(0, 0)', opacity: '0.3' },
          '50%': { transform: 'scale(1.2) translate(10%, 10%)', opacity: '0.5' },
          '100%': { transform: 'scale(1) translate(-5%, -5%)', opacity: '0.3' },
        },
        'light-leak-2': {
          '0%': { transform: 'scale(1.1) translate(-10%, 0)', opacity: '0.2' },
          '50%': { transform: 'scale(1.3) translate(5%, -10%)', opacity: '0.4' },
          '100%': { transform: 'scale(1) translate(5%, 5%)', opacity: '0.1' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
