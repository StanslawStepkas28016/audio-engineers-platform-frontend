import './App.css'
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {Login} from "@/pages/Login.tsx";
import {ThemeProvider} from "@/components/theme-provider.tsx";
import {NotFound} from "@/pages/NotFound.tsx";

function App() {
    return (
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
            {
                <Router>
                    <Routes>
                        <Route path="*" element={<NotFound/>}/>
                        <Route path="/login" element={<Login/>}/>
                    </Routes>
                </Router>
            }
        </ThemeProvider>
    )
}

export default App;
