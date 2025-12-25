import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        tovernet: {
          50: '#f0f0ff',
          100: '#e5e5ff',
          200: '#d1d1ff',
          300: '#b3b3ff',
          400: '#8585ff',
          500: '#6b5fff',
          600: '#5c3fff',
          700: '#4d2fe6',
          800: '#3f25c2',
          900: '#35209e',
        },
        ksiegai: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        globalpet: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'tovernet-gradient': 'linear-gradient(135deg, #6b5fff 0%, #8b5cf6 50%, #a78bfa 100%)',
        'ksiegai-gradient': 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 50%, #a78bfa 100%)',
        'globalpet-gradient': 'linear-gradient(135deg, #22c55e 0%, #4ade80 50%, #86efac 100%)',
      },
    },
  },
  plugins: [],
};
export default config;
