import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {ThemeProvider} from "@/components/theme-provider.tsx";
import {StrictMode} from "react";
import {queryClient} from "@/lib/react-query.ts";
import {QueryClientProvider} from 'react-query';
import {ErrorBoundary} from "react-error-boundary";
import {GeneralFallback} from "@/error-boundaries/GeneralFallback.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <ErrorBoundary FallbackComponent={GeneralFallback}>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
                    <App/>
                </ThemeProvider>
                {/*<ReactQueryDevtools initialIsOpen={true}/>*/}
            </QueryClientProvider>
        </ErrorBoundary>
    </StrictMode>,
)
