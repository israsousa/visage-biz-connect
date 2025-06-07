
import { useIsMobile } from './use-mobile';
import { Smartphone, Computer } from 'lucide-react';

export const useDeviceIcons = () => {
  const isMobile = useIsMobile();
  
  return {
    isMobile,
    deviceIcon: isMobile ? Smartphone : Computer,
  };
};
