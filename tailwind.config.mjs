/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fefce8', // yellow-50
          500: '#facc15', // yellow-400
          600: '#eab308', // yellow-500
        },
        secondary: {
          500: '#1e293b', // slate-800
        },
        app: {
          bg: '#f8fafc',
          surface: '#ffffff',
        },
        text: {
          main: '#0f172a',
          body: '#334155',
          muted: '#64748b',
        },
        border: {
          light: '#e2e8f0',
        },
        status: {
          success: '#16a34a',
          warning: '#d97706',
          error: '#dc2626',
        }
      }
    },
  },
  plugins: [],
}
