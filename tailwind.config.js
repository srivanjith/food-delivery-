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
          50: '#FFFDF5',
          100: '#FFF3D6',
          200: '#FFEEC4',
          300: '#C5E1A5',
          400: '#9CCC65',
          500: '#8BC34A',
          600: '#7CB342',
          700: '#689F38',
          800: '#558B2F',
          900: '#33691E',
        },
        slate: {
          50: '#FFF3D6',  // Main cream background
          100: '#FFEEC4', // Light cream border/bg
          200: '#F2DFB8', // Soft sandy beige
          300: '#C7B59F', // Warm light taupe
          400: '#7A6956', // Readable text color (contrast with cream)
          500: '#665543', // Deep muted text
          650: '#544434', // Secondary dark text
          600: '#544434',
          700: '#423427', // Dark text
          800: '#33271D', // Charcoal brown
          900: '#241B14', // Very dark coffee
          950: '#1A120C', // Deepest dark mode background
        },
        emerald: {
          50: '#FFFDF5',
          100: '#FFF3D6',
          200: '#FFEEC4',
          300: '#C5E1A5',
          400: '#9CCC65',
          500: '#8BC34A',
          600: '#7CB342',
          700: '#689F38',
          800: '#558B2F',
          900: '#33691E',
        },
        green: {
          50: '#FFFDF5',
          100: '#FFF3D6',
          200: '#FFEEC4',
          300: '#C5E1A5',
          400: '#9CCC65',
          500: '#8BC34A',
          600: '#7CB342',
          700: '#689F38',
          800: '#558B2F',
          900: '#33691E',
        },
        teal: {
          50: '#FFFDF5',
          100: '#FFF3D6',
          200: '#FFEEC4',
          300: '#C5E1A5',
          400: '#9CCC65',
          500: '#8BC34A',
          600: '#7CB342',
          700: '#689F38',
          800: '#558B2F',
          900: '#33691E',
        },
        orange: {
          50: '#FFFBEB',
          100: '#FFECE6',
          200: '#FFD4C4',
          300: '#FFA88A',
          400: '#FF7B52',
          500: '#F05A28',
          600: '#D84315',
          700: '#BF360C',
        },
        amber: {
          50: '#FFFDF5',
          100: '#FFF3D6',
          200: '#FFE6A3',
          300: '#FAD36E',
          400: '#F6C445',
          500: '#E0B036',
          600: '#C79B2A',
          700: '#A8811E',
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
