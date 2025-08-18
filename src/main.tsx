import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {ThemeProvider} from "@/components/theme-provider.tsx";
import {StrictMode} from "react";
import {queryClient} from "@/lib/react-query.ts";
import {QueryClientProvider} from 'react-query';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
                <App/>
            </ThemeProvider>
        </QueryClientProvider>
    </StrictMode>,
)
