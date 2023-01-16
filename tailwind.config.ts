import { defineConfig } from 'vite-plugin-windicss'
import defaultTheme from 'windicss/defaultTheme'

export default defineConfig({
  darkMode: false,
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter var', ...defaultTheme.fontFamily.sans],
      },
      gridTemplateColumns: {
        layout: 'repeat(auto-fit, minmax(25rem, 1fr))',
      },
    },
  },
})
