
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './polyfills.ts'
import './index.css'

createRoot(document.getElementById("root")!).render(<App />);
