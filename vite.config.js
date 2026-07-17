import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import obfuscatorPlugin from 'vite-plugin-javascript-obfuscator'

const isMobile = process.env.BUILD_TARGET === 'mobile'
const isProd = process.env.NODE_ENV === 'production'

export default defineConfig({
  server: { port: 5174, strictPort: true, base: '/labhive/' },
  plugins: [
    react(),
    isProd && obfuscatorPlugin({
      options: {
        compact: true,
        controlFlowFlattening: false,
        stringArray: true,
        stringArrayEncoding: ['base64'],
        stringArrayThreshold: 0.75,
        renameGlobals: false,
        selfDefending: false,
        // CRITICAL: never obfuscate import specifiers. String-encoding them
        // blinds Rollup's dynamic-import analysis — no lazy chunks get
        // emitted and browsers hit bare `import("jspdf")` at runtime
        // ("failed to resolve module specifier"). Reserve bare package names
        // and relative paths so code-splitting keeps working.
        reservedStrings: [
          '^jspdf$', '^jspdf-autotable$', '^exceljs$', '^xlsx$',
          '^@capacitor/', '^@capacitor-mlkit/', '^@basecom-gmbh/', '^capacitor-rate-app$',
          '^\\./', '^\\.\\./',
        ],
      },
    }),
    isMobile && {
      name: 'mobile-html-fix',
      transformIndexHtml(html) {
        // Remove crossorigin — WKWebView silently blocks stylesheets with this attribute
        return html.replace(/ crossorigin/g, '')
      },
    },
  ].filter(Boolean),
  base: '/',
  build: {
    outDir: isMobile ? 'dist' : 'docs',
    sourcemap: false,
  },
})
