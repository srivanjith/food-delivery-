/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // Always use dark mode (Midnight Purple IS the theme)
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ── Midnight Purple brand palette ──────────────────
        mp: {
          bg:      '#0F172A',
          sidebar: '#111827',
          card:    '#1E293B',
          primary: '#8B5CF6',
          hover:   '#7C3AED',
          text:    '#FFFFFF',
          muted:   '#94A3B8',
          success: '#22C55E',
          warning: '#F59E0B',
          danger:  '#EF4444',
        },

        // ── Violet / Purple scale ──────────────────────────
        violet: {
          50:  '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
          950: '#2E1065',
        },

        // ── Slate → Midnight Purple neutrals ──────────────
        slate: {
          50:  '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          650: '#334155',
          700: '#334155',
          800: '#1E293B',  // mp-card
          850: '#172033',
          855: '#111827',  // mp-sidebar
          900: '#111827',
          950: '#0F172A',  // mp-bg
        },

        // ── Emerald (eco success accent) ──────────────────
        emerald: {
          50:  '#F0FDF4',
          100: '#DCFCE7',
          200: '#BBF7D0',
          300: '#86EFAC',
          400: '#4ADE80',
          500: '#22C55E',
          600: '#16A34A',
          700: '#15803D',
          800: '#166534',
          900: '#14532D',
          950: '#052e16',
        },

        // ── Amber / Warning ───────────────────────────────
        amber: {
          50:  '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
        },

        // ── Orange ────────────────────────────────────────
        orange: {
          400: '#FB923C',
          500: '#F97316',
          600: '#EA580C',
        },

        // ── Teal ──────────────────────────────────────────
        teal: {
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
        },
      },

      fontFamily: {
        sans: ['Outfit', 'Inter', 'sans-serif'],
      },

      backgroundImage: {
        'mp-gradient':        'linear-gradient(135deg, #8B5CF6, #7C3AED)',
        'mp-card-gradient':   'linear-gradient(160deg, #1E293B, #172033)',
        'mp-hero-gradient':   'radial-gradient(circle at 15% 25%, rgba(139,92,246,0.15) 0%, rgba(245,158,11,0.04) 80%)',
      },

      boxShadow: {
        'mp-glow':   '0 0 20px rgba(139,92,246,0.4)',
        'mp-card':   '0 4px 24px rgba(0,0,0,0.35)',
        'mp-input':  '0 0 0 3px rgba(139,92,246,0.2)',
      },

      animation: {
        'bounce-slow':  'bounce 3s infinite',
        'pulse-slow':   'pulse 4s infinite',
        'float':        'float 3s ease-in-out infinite',
        'glow-pulse':   'glow-pulse 2.5s ease-in-out infinite',
        'aurora-1':     'aurora-float 22s ease-in-out infinite',
        'aurora-2':     'aurora-float 28s ease-in-out infinite reverse',
        'aurora-3':     'aurora-float 34s ease-in-out infinite 4s',
      },

      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 8px rgba(139,92,246,0.4)' },
          '50%':      { boxShadow: '0 0 20px rgba(139,92,246,0.7), 0 0 40px rgba(139,92,246,0.2)' },
        },
        'aurora-float': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%':      { transform: 'translate(30px, -50px) scale(1.15)' },
          '66%':      { transform: 'translate(-30px, 20px) scale(0.92)' },
        },
      },
    },
  },
  plugins: [],
}
