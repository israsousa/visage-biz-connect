import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Registra o Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('Service Worker registrado com sucesso:', registration);
      })
      .catch(error => {
        console.error('Erro ao registrar Service Worker:', error);
      });
  });
}

createRoot(document.getElementById("root")!).render(<App />);
