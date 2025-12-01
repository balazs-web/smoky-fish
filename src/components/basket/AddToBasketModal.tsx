"use client";

import { useState } from "react";
import { Check, Minus, Plus, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useBasket } from "@/contexts/BasketContext";
import type { Product, Unit } from "@/types";

interface AddToBasketModalProps {
  product: Product | null;
  unit?: Unit;
  isOpen: boolean;
  onClose: () => void;
}

export function AddToBasketModal({
  product,
  unit,
  isOpen,
  onClose,
}: AddToBasketModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);
  const { addItem, setIsBasketOpen } = useBasket();

  const formatPrice = (priceInCents: number): string => {
    return (priceInCents / 100).toLocaleString("hu-HU");
  };

  const handleAddToBasket = () => {
    if (product) {
      addItem(product, quantity);
      setIsAdded(true);
      setTimeout(() => {
        setIsAdded(false);
        setQuantity(1);
        onClose();
      }, 800);
    }
  };

  const handleViewBasket = () => {
    onClose();
    setIsBasketOpen(true);
  };

  const incrementQuantity = () => {
    setQuantity((q) => q + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((q) => q - 1);
    }
  };

  if (!product) return null;

  const imageUrl = product.imageUrl || product.images?.[0];
  const totalPrice = product.price * quantity;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Hozzáadás a kosárhoz</DialogTitle>
          <DialogDescription>
            Válaszd ki a kívánt mennyiséget
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-4 py-4">
          {/* Product Image */}
          <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <ShoppingCart className="h-8 w-8 text-gray-300" />
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-between flex-1">
            <div>
              <h3 className="font-medium text-gray-900 line-clamp-2">
                {product.name}
              </h3>
              <p className="mt-1 text-lg font-bold text-[#1B5E4B]">
                {formatPrice(product.price)} Ft
                {unit && (
                  <span className="text-sm font-normal text-gray-500 ml-1">
                    / {unit.name}
                  </span>
                )}
              </p>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-3 mt-2">
              <span className="text-sm text-gray-500">Mennyiség:</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={incrementQuantity}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Total */}
        <div className="flex items-center justify-between border-t pt-4">
          <span className="text-sm text-gray-600">Összesen:</span>
          <span className="text-xl font-bold text-[#1B5E4B]">
            {formatPrice(totalPrice)} Ft
          </span>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={handleViewBasket}
            className="w-full sm:w-auto"
          >
            Kosár megtekintése
          </Button>
          <Button
            onClick={handleAddToBasket}
            disabled={isAdded}
            className="w-full sm:w-auto bg-[#1B5E4B] hover:bg-[#247a61] text-white"
          >
            {isAdded ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Hozzáadva!
              </>
            ) : (
              <>
                <ShoppingCart className="h-4 w-4 mr-2" />
                Kosárba
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
