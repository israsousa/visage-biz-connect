import { useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';

export function InstallPWA() {
  const [showBanner, setShowBanner] = useState(false);
  const deferredPrompt = useRef<Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> } | null>(null);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // Handler para o evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      deferredPrompt.current = e as Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt.current) return;
    setIsInstalling(true);
    deferredPrompt.current.prompt();
    const choiceResult = await deferredPrompt.current.userChoice;
    setIsInstalling(false);
    setShowBanner(false);
    deferredPrompt.current = null;
    if (choiceResult.outcome === 'accepted') {
      console.log('App instalada');
    } else {
      console.log('Instalação recusada');
    }
  };

  if (!showBanner) return null;

  return (
    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#eee', padding: '1em', zIndex: 1000, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <span style={{ marginRight: '1em' }}>Deseja instalar esta aplicação?</span>
      <Button onClick={handleInstall} disabled={isInstalling} style={{ marginRight: '0.5em' }}>
        {isInstalling ? 'Instalando...' : 'Instalar'}
      </Button>
      <Button variant="outline" onClick={() => setShowBanner(false)} disabled={isInstalling}>
        Agora não
      </Button>
    </div>
  );
} 