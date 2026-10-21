/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Live web identity — digitalskills.dga.gov.sa
        dga: {
          green: '#1B8354',
          'green-deep': '#167248',
          'green-dark': '#067647',
          'green-ink': '#074D31',
          amber: '#DBA102',
          'amber-tx': '#8A6A00', // darker amber — text-safe on white (WCAG AA)
          ink: '#212539',
          black: '#161616',
          muted: '#4D5761',
          bg: '#FCFCFD',
          line: '#D2D6DB',
          'tag-info-bg': '#EFF8FF',
          'tag-info-text': '#1849A9',
          'tag-info-border': '#B2DDFF',
          'tag-ok-bg': '#E2F5E5',
          'tag-ok-text': '#255C2B',
          disabled: '#E5E7EB',
          'disabled-tx': '#9DA4AE',
        },
      },
      fontFamily: {
        sans: ['"IBM Plex Sans Arabic"', '"Segoe UI"', 'Tahoma', 'sans-serif'],
      },
      fontSize: {
        hero: ['48px', { lineHeight: '1.15', fontWeight: '700' }],
        h1: ['40px', { lineHeight: '1.2', fontWeight: '500' }],
        section: ['36px', { lineHeight: '1.25', fontWeight: '700' }],
        sub: ['32px', { lineHeight: '1.3', fontWeight: '500' }],
        kpi: ['40px', { lineHeight: '1', fontWeight: '500' }],
        'body-lg': ['16px', { lineHeight: '1.9' }],
        tag: ['12px', { lineHeight: '1.4' }],
        // compact header scale: six hub labels + language + button fit one line from 1024 px
        nav: ['14px', { lineHeight: '1.35' }],
      },
      borderRadius: {
        btn: '4px',
        card: '16px',
        pill: '50px',
      },
      boxShadow: {
        card: '0 4px 8px -2px rgba(16,24,40,.1), 0 2px 4px -2px rgba(16,24,40,.06)',
        'card-lg': '0 32px 64px -12px rgba(16,24,40,.14)',
        subtle: '0 1px 3px rgba(16,24,40,.05), 0 1px 2px rgba(16,24,40,.05)',
      },
      backgroundImage: {
        'hero-wash': 'linear-gradient(90deg, rgba(7,77,49,.95) 0%, rgba(22,114,72,.88) 55%, rgba(27,131,84,.72) 100%)',
        'dga-progress': 'linear-gradient(90deg, #1B8354 0%, #DBA102 100%)',
      },
      keyframes: {
        radarGrow: {
          from: { transform: 'scale(0)', opacity: '0' },
          to: { transform: 'scale(1)', opacity: '1' },
        },
        floaty: {
          '0%,100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSoft: {
          '0%,100%': { opacity: '0.55' },
          '50%': { opacity: '1' },
        },
      },
      animation: {
        radarGrow: 'radarGrow 1.1s cubic-bezier(0.22, 1, 0.36, 1) both',
        floaty: 'floaty 7s ease-in-out infinite',
        pulseSoft: 'pulseSoft 3.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
