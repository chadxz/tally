import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// use `// @vitest-environment happy-dom` for frontend tests

export default defineConfig({
  plugins: [react()],
})
