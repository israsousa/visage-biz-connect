import React, { useState, useEffect } from 'react';
import { ChevronDown, Phone } from 'lucide-react';
import { usePhoneFormatter, COUNTRY_CODES } from '@/hooks/usePhoneFormatter';

interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  error?: string;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  placeholder = "912 345 678",
  className = "",
  error
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value || '');
  const { selectedCountry, setSelectedCountry, formatPhoneDisplay, normalizePhone, detectCountryFromPhone } = usePhoneFormatter();

  // Detect country from value when component mounts or value changes externally
  useEffect(() => {
    if (value && value !== inputValue) {
      setInputValue(value);
      const detectedCountry = detectCountryFromPhone(value);
      setSelectedCountry(detectedCountry);
    }
  }, [value, inputValue, detectCountryFromPhone, setSelectedCountry]);

  const handleCountrySelect = (country: typeof COUNTRY_CODES[0]) => {
    setSelectedCountry(country);
    setIsOpen(false);
    
    // If there's already a number, try to keep just the national part
    if (inputValue) {
      const cleaned = inputValue.replace(/^\+\d{1,3}\s?/, '').replace(/\s/g, '');
      const newValue = `${country.code}${cleaned}`;
      setInputValue(newValue);
      onChange(normalizePhone(newValue));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;
    
    // Remove all non-numeric characters except + and spaces for input
    newValue = newValue.replace(/[^\d\s+]/g, '');
    
    // If user starts typing without country code, prefix with selected country
    if (newValue && !newValue.startsWith('+') && !newValue.startsWith('00')) {
      newValue = `${selectedCountry.code}${newValue.replace(/\s/g, '')}`;
    }
    
    setInputValue(newValue);
    onChange(normalizePhone(newValue));
  };

  const displayValue = inputValue ? formatPhoneDisplay(inputValue) : '';

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Telefone
      </label>
      
      <div className={`flex border rounded-xl focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-transparent ${error ? 'border-red-300' : 'border-gray-200'}`}>
        {/* Country selector */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-3 py-4 border-r border-gray-200 hover:bg-gray-50 focus:outline-none"
          >
            <span className="text-lg">{selectedCountry.flag}</span>
            <span className="text-sm font-medium">{selectedCountry.code}</span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
          
          {isOpen && (
            <div className="absolute top-full left-0 z-50 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {COUNTRY_CODES.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => handleCountrySelect(country)}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 text-left"
                >
                  <span className="text-lg">{country.flag}</span>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{country.name}</div>
                    <div className="text-xs text-gray-500">{country.code}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
        
        {/* Phone input */}
        <input
          type="tel"
          value={displayValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          className={`flex-1 p-4 rounded-r-xl focus:outline-none ${className}`}
        />
      </div>
      
      {/* Examples */}
      <div className="mt-2 text-xs text-gray-500">
        <p><strong>Exemplo:</strong> {selectedCountry.example}</p>
        <p className="mt-1 text-purple-600">* Números sem código de país são tratados como Portugal (+351)</p>
      </div>
      
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
      
      {/* Close dropdown when clicking outside */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};