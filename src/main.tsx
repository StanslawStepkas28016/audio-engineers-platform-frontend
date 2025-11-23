import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {ThemeProvider} from "@/components/theme-provider.tsx";
import {queryClient} from "@/lib/react-query.ts";
import {QueryClientProvider} from '@tanstack/react-query';
import {ErrorBoundary} from "react-error-boundary";
import {GeneralFallback} from "@/fallbacks/GeneralFallback.tsx";
// import {StrictMode} from "react";

createRoot(document.getElementById('root')!).render(
    // <StrictMode>
        <ErrorBoundary FallbackComponent={GeneralFallback}>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
                    <App/>
                </ThemeProvider>
                {/*<ReactQueryDevtools initialIsOpen={true}/>*/}
            </QueryClientProvider>
        </ErrorBoundary>
    // </StrictMode>,
)
