/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        },
        slate: {
          50: '#F9FAFB',  // Main clean off-white background
          100: '#F3F4F6', // Light gray border/bg
          200: '#E5E7EB', // Soft gray
          300: '#D1D5DB', // Warm neutral gray
          400: '#9CA3AF', // Secondary text color
          500: '#6B7280', // Muted text
          650: '#374151', // Accent text
          600: '#4B5563', // Text body
          700: '#374151', // Dark text
          800: '#1F2937', // Dark gray
          850: '#182030', // Dark charcoal/navy-gray
          855: '#121824', // Deep dark charcoal
          900: '#111827', // Crisp dark text
          950: '#0B0F19', // Deep obsidian dark mode background
        },
        emerald: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        },
        green: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        },
        teal: {
          50: '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
          800: '#065F46',
          900: '#064E3B',
        },
        orange: {
          50: '#FFF5F2',
          100: '#FFE4DE',
          200: '#FFC9BE',
          300: '#FFA291',
          400: '#FF7E66',
          500: '#FF6B4A',
          600: '#E05232',
          700: '#B83E21',
        },
        amber: {
          50: '#FEFDF0',
          100: '#FEF9C3',
          200: '#FEF08A',
          300: '#FDE047',
          400: '#FACC15',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'pulse-slow': 'pulse 4s infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        }
      }
    },
  },
  plugins: [],
}
