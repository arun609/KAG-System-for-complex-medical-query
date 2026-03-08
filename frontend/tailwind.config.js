/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Semantic Medical Palette
        medical: {
          primary: 'var(--medical-primary)', // Main Brand Color (Blue)
          secondary: 'var(--medical-secondary)', // Soft Background (Light Blue / Dk Slate)
          accent: 'var(--medical-accent)', // Highlights (Teal)
          surface: 'var(--medical-surface)', // Card Backgrounds
          text: 'var(--medical-text)', // Main Text
          muted: 'var(--medical-muted)', // Secondary Text
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        mono: ['Fira Code', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}
