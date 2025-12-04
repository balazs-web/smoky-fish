'use client';

import { useState, useEffect } from 'react';
import { X, Cookie } from 'lucide-react';

const COOKIE_CONSENT_KEY = 'matyi-cookie-consent';

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already consented
    const hasConsented = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!hasConsented) {
      // Small delay for smoother appearance
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'accepted');
    setIsVisible(false);
  };

  const handleDismiss = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, 'dismissed');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom duration-500"
      role="banner"
      aria-label="Cookie értesítés"
    >
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg border border-gray-200 p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {/* Icon */}
          <div className="hidden sm:flex items-center justify-center w-10 h-10 bg-[#1B5E4B]/10 rounded-full flex-shrink-0">
            <Cookie className="w-5 h-5 text-[#1B5E4B]" />
          </div>

          {/* Text */}
          <div className="flex-1 text-sm text-gray-600">
            <p>
              Ez a weboldal sütiket használ a jobb felhasználói élmény érdekében. 
              Az oldal böngészésével elfogadod a sütik használatát.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleAccept}
              className="flex-1 sm:flex-none px-4 py-2 bg-[#1B5E4B] hover:bg-[#247a61] text-white text-sm font-medium rounded-lg transition-colors"
            >
              Elfogadom
            </button>
            <button
              onClick={handleDismiss}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Bezárás"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
