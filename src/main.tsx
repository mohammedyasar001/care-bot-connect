
import './polyfills.ts'  // Import polyfills first
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Log application startup for debugging
console.log('HealthCare Bot application starting...');

createRoot(document.getElementById("root")!).render(<App />);
