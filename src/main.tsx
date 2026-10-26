import { CssBaseline } from '@mui/material'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

const queryClient = new QueryClient()

// En vez de `!` (que le miente a TypeScript), chequeamos y fallamos con un mensaje claro.
const root = document.getElementById('root')
if (!root) throw new Error('No encontré el elemento #root')

createRoot(root).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      {/* CssBaseline reemplaza al index.css del template: normaliza estilos del navegador. */}
      <CssBaseline />
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
