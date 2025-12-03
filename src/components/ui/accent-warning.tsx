'use client';

import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface SlugWarningProps {
  isOpen: boolean;
  onClose: () => void;
  onClearSlug?: () => void;
}

export function AccentWarning({ isOpen, onClose, onClearSlug }: SlugWarningProps) {
  const handleClose = () => {
    if (onClearSlug) {
      onClearSlug();
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md text-center">
        <div className="py-6">
          {/* Giant emoji */}
          <div className="text-8xl mb-6">🤦‍♂️</div>
          
          {/* Warning message */}
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Matyi, mi a faszt csinálsz?
          </h2>
          <p className="text-xl text-gray-700 mb-2">
            Ilyet egy webcímbe?!
          </p>
          <p className="text-gray-500 mb-6">
            A slug-ban csak az angol ABC betűi (a-z), számok (0-9) és kötőjel (-) szerepelhetnek!
            <br />
            <span className="font-semibold">Szóköz, ékezet, speciális karakter TILOS!</span>
          </p>
          
          {/* Example */}
          <div className="bg-gray-100 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-gray-600 mb-2">Példák:</p>
            <p className="text-red-500 line-through">❌ italok és üdítők</p>
            <p className="text-red-500 line-through">❌ italok-és-üdítők</p>
            <p className="text-red-500 line-through">❌ termék@akció!</p>
            <p className="text-green-600 mt-2">✅ italok-es-uditok</p>
          </div>

          <Button 
            onClick={handleClose}
            className="bg-[#1B5E4B] hover:bg-[#247a61] text-white px-8"
          >
            Jól van, megértettem! 😅
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Helper function to check if string contains invalid slug characters
export function hasInvalidSlugChars(text: string): boolean {
  // Valid slug: only lowercase letters, numbers, and hyphens
  // Invalid: spaces, accents, uppercase, special chars, etc.
  const invalidPattern = /[^a-z0-9-]/;
  return invalidPattern.test(text.toLowerCase()) || /[A-ZÁÉÍÓÖŐÚÜŰ\s]/.test(text);
}

// Keep old name for backwards compatibility
export const hasAccents = hasInvalidSlugChars;
