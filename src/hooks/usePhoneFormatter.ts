import { useState, useCallback } from 'react';

interface CountryCode {
  code: string;
  name: string;
  flag: string;
  format: string;
  example: string;
}

export const COUNTRY_CODES: CountryCode[] = [
  // Portugal (padrão)
  { code: '+351', name: 'Portugal', flag: '🇵🇹', format: '+351 XXX XXX XXX', example: '+351 912 345 678' },
  
  // Países Europeus (ordenados alfabeticamente)
  { code: '+43', name: 'Áustria', flag: '🇦🇹', format: '+43 XXX XXXX XXXX', example: '+43 664 123 4567' },
  { code: '+32', name: 'Bélgica', flag: '🇧🇪', format: '+32 XXX XX XX XX', example: '+32 470 12 34 56' },
  { code: '+359', name: 'Bulgária', flag: '🇧🇬', format: '+359 XX XXX XXXX', example: '+359 88 123 4567' },
  { code: '+385', name: 'Croácia', flag: '🇭🇷', format: '+385 XX XXX XXXX', example: '+385 91 123 4567' },
  { code: '+420', name: 'República Checa', flag: '🇨🇿', format: '+420 XXX XXX XXX', example: '+420 601 123 456' },
  { code: '+45', name: 'Dinamarca', flag: '🇩🇰', format: '+45 XX XX XX XX', example: '+45 12 34 56 78' },
  { code: '+372', name: 'Estónia', flag: '🇪🇪', format: '+372 XXXX XXXX', example: '+372 5123 4567' },
  { code: '+358', name: 'Finlândia', flag: '🇫🇮', format: '+358 XX XXX XXXX', example: '+358 40 123 4567' },
  { code: '+33', name: 'França', flag: '🇫🇷', format: '+33 X XX XX XX XX', example: '+33 6 12 34 56 78' },
  { code: '+49', name: 'Alemanha', flag: '🇩🇪', format: '+49 XXX XXXX XXXX', example: '+49 160 1234567' },
  { code: '+30', name: 'Grécia', flag: '🇬🇷', format: '+30 XXX XXX XXXX', example: '+30 694 123 4567' },
  { code: '+36', name: 'Hungria', flag: '🇭🇺', format: '+36 XX XXX XXXX', example: '+36 20 123 4567' },
  { code: '+353', name: 'Irlanda', flag: '🇮🇪', format: '+353 XX XXX XXXX', example: '+353 85 123 4567' },
  { code: '+39', name: 'Itália', flag: '🇮🇹', format: '+39 XXX XXX XXXX', example: '+39 320 123 4567' },
  { code: '+371', name: 'Letónia', flag: '🇱🇻', format: '+371 XXXX XXXX', example: '+371 2123 4567' },
  { code: '+370', name: 'Lituânia', flag: '🇱🇹', format: '+370 XXX XXXXX', example: '+370 612 34567' },
  { code: '+352', name: 'Luxemburgo', flag: '🇱🇺', format: '+352 XXX XXX XXX', example: '+352 621 123 456' },
  { code: '+356', name: 'Malta', flag: '🇲🇹', format: '+356 XXXX XXXX', example: '+356 7912 3456' },
  { code: '+31', name: 'Holanda', flag: '🇳🇱', format: '+31 X XXXX XXXX', example: '+31 6 1234 5678' },
  { code: '+47', name: 'Noruega', flag: '🇳🇴', format: '+47 XXX XX XXX', example: '+47 412 34 567' },
  { code: '+48', name: 'Polónia', flag: '🇵🇱', format: '+48 XXX XXX XXX', example: '+48 601 123 456' },
  { code: '+40', name: 'Roménia', flag: '🇷🇴', format: '+40 XXX XXX XXX', example: '+40 721 123 456' },
  { code: '+421', name: 'Eslováquia', flag: '🇸🇰', format: '+421 XXX XXX XXX', example: '+421 901 123 456' },
  { code: '+386', name: 'Eslovénia', flag: '🇸🇮', format: '+386 XX XXX XXX', example: '+386 31 123 456' },
  { code: '+34', name: 'Espanha', flag: '🇪🇸', format: '+34 XXX XXX XXX', example: '+34 612 345 678' },
  { code: '+46', name: 'Suécia', flag: '🇸🇪', format: '+46 XX XXX XX XX', example: '+46 70 123 45 67' },
  { code: '+41', name: 'Suíça', flag: '🇨🇭', format: '+41 XX XXX XX XX', example: '+41 79 123 45 67' },
  { code: '+44', name: 'Reino Unido', flag: '🇬🇧', format: '+44 XXXX XXXXXX', example: '+44 7700 900123' },
  
  // Outros países importantes
  { code: '+55', name: 'Brasil', flag: '🇧🇷', format: '+55 XX XXXXX XXXX', example: '+55 11 99999 9999' },
  { code: '+1', name: 'EUA/Canadá', flag: '🇺🇸', format: '+1 XXX XXX XXXX', example: '+1 555 123 4567' },
  { code: '+7', name: 'Rússia', flag: '🇷🇺', format: '+7 XXX XXX XX XX', example: '+7 912 345 67 89' },
  { code: '+90', name: 'Turquia', flag: '🇹🇷', format: '+90 XXX XXX XX XX', example: '+90 532 123 45 67' },
  { code: '+380', name: 'Ucrânia', flag: '🇺🇦', format: '+380 XX XXX XX XX', example: '+380 67 123 45 67' },
  { code: '+212', name: 'Marrocos', flag: '🇲🇦', format: '+212 XXX XXXXXX', example: '+212 661 123456' },
  { code: '+213', name: 'Argélia', flag: '🇩🇿', format: '+213 XXX XXX XXX', example: '+213 551 123 456' },
];

export const usePhoneFormatter = () => {
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(COUNTRY_CODES[0]); // Portugal default

  const detectCountryFromPhone = useCallback((phone: string): CountryCode => {
    const cleaned = phone.replace(/\s/g, '');
    
    for (const country of COUNTRY_CODES) {
      if (cleaned.startsWith(country.code)) {
        return country;
      }
    }
    
    return COUNTRY_CODES[0]; // Default to Portugal
  }, []);

  const formatPhoneDisplay = useCallback((phone: string): string => {
    if (!phone) return '';
    
    const cleaned = phone.replace(/\s/g, '');
    
    // Portugal formatting
    if (cleaned.startsWith('+351')) {
      const number = cleaned.substring(4);
      if (number.length >= 9) {
        return `+351 ${number.substring(0, 3)} ${number.substring(3, 6)} ${number.substring(6)}`;
      }
      return cleaned;
    }
    
    // Brasil formatting
    if (cleaned.startsWith('+55')) {
      const number = cleaned.substring(3);
      if (number.length >= 11) {
        return `+55 ${number.substring(0, 2)} ${number.substring(2, 7)} ${number.substring(7)}`;
      }
      return cleaned;
    }
    
    // USA/Canada formatting
    if (cleaned.startsWith('+1')) {
      const number = cleaned.substring(2);
      if (number.length >= 10) {
        return `+1 ${number.substring(0, 3)} ${number.substring(3, 6)} ${number.substring(6)}`;
      }
      return cleaned;
    }
    
    // UK formatting
    if (cleaned.startsWith('+44')) {
      const number = cleaned.substring(3);
      if (number.length >= 10) {
        return `+44 ${number.substring(0, 2)} ${number.substring(2, 6)} ${number.substring(6)}`;
      }
      return cleaned;
    }
    
    // France formatting
    if (cleaned.startsWith('+33')) {
      const number = cleaned.substring(3);
      if (number.length >= 9) {
        return `+33 ${number.substring(0, 1)} ${number.substring(1, 3)} ${number.substring(3, 5)} ${number.substring(5, 7)} ${number.substring(7)}`;
      }
      return cleaned;
    }
    
    // Default formatting with spaces every 3 digits
    return cleaned.replace(/(\+?\d{1,3})(\d{3})(\d{3})(\d+)/, '$1 $2 $3 $4');
  }, []);

  const normalizePhone = useCallback((phone: string): string => {
    const cleaned = phone.replace(/\s/g, '');
    
    // Se não tem código de país e parece ser português (9 dígitos), adiciona +351
    if (!/^\+/.test(cleaned) && /^\d{9}$/.test(cleaned)) {
      return `+351${cleaned}`;
    }
    
    // Convert 00 prefix to +
    if (/^00/.test(cleaned)) {
      return `+${cleaned.substring(2)}`;
    }
    
    return cleaned;
  }, []);

  const validatePhone = useCallback((phone: string): boolean => {
    const normalized = normalizePhone(phone);
    
    // Basic international phone number validation
    return /^\+[1-9]\d{6,14}$/.test(normalized);
  }, [normalizePhone]);

  return {
    selectedCountry,
    setSelectedCountry,
    countryCodes: COUNTRY_CODES,
    detectCountryFromPhone,
    formatPhoneDisplay,
    normalizePhone,
    validatePhone,
  };
};