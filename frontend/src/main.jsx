import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {QueryClient,QueryClientProvider} from "@tanstack/react-query";
const query=new QueryClient({
  defaultOptions:{
    queries:{
      refetchOnWindowFocus:false,
    }
  }
});


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={query}>
    <App />
    </QueryClientProvider>
  </StrictMode>,
)
