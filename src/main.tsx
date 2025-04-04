
import './polyfills.ts'  // Import polyfills first
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Log application startup for debugging
console.log('HealthCare Bot application starting...');
console.log('API URL:', import.meta.env.VITE_API_URL || '/api');

createRoot(document.getElementById("root")!).render(<App />);
