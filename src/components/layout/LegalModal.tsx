'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

export function LegalModal({ isOpen, onClose, title, content }: LegalModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] p-0 gap-0 flex flex-col">
        <DialogHeader className="p-6 pb-4 border-b shrink-0">
          <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto flex-1 max-h-[60vh]">
          <div 
            className="p-6 prose prose-sm max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-600 prose-li:text-gray-600 prose-strong:text-gray-900"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
        <div className="p-4 border-t bg-gray-50 flex justify-end shrink-0">
          <Button onClick={onClose} variant="outline">
            Bezárás
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
