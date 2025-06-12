import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Limpar completamente Service Workers e caches em development
if (import.meta.env.DEV) {
  console.log('🧹 Modo desenvolvimento: limpando service workers e caches...');
  
  // 1. Desregistar todos os service workers
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(async registrations => {
      for (const registration of registrations) {
        await registration.unregister();
        console.log('✅ Service Worker desregistrado:', registration.scope);
      }
    }).catch(console.error);

    // Stop any active service worker
    navigator.serviceWorker.ready.then(registration => {
      if (registration.active) {
        registration.active.postMessage({ action: 'SKIP_WAITING' });
      }
    }).catch(() => {});
  }
  
  // 2. Limpar todos os caches
  if ('caches' in window) {
    caches.keys().then(async cacheNames => {
      for (const cacheName of cacheNames) {
        await caches.delete(cacheName);
        console.log('✅ Cache removido:', cacheName);
      }
    }).catch(console.error);
  }
  
  // 3. Force reload se detectar que ainda há SW ativo
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    console.log('🔄 Service Worker ainda ativo, forçando reload...');
    window.location.reload();
  }
}

createRoot(document.getElementById("root")!).render(<App />);
