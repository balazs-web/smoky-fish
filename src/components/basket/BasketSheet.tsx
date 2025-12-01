"use client";

import { useState, useMemo } from "react";
import { Minus, Plus, ShoppingCart, Trash2, Package, Loader2, CheckCircle, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { useBasket } from "@/contexts/BasketContext";
import type { Unit, StoreSettings } from "@/types";
import { DELIVERY_POSTCODES, getCityFromPostcode } from "@/config/deliveryPostcodes";

interface BasketSheetProps {
  units?: Unit[];
  storeSettings?: StoreSettings;
}

type CheckoutStep = "basket" | "shipping" | "billing" | "success";

interface OrderResult {
  orderId: string;
  success: boolean;
}

export function BasketSheet({ units = [], storeSettings }: BasketSheetProps) {
  const {
    items,
    itemCount,
    totalPrice,
    removeItem,
    updateQuantity,
    clearBasket,
    isBasketOpen,
    setIsBasketOpen,
    shippingAddress,
    setShippingAddress,
    billingAddress,
    setBillingAddress,
  } = useBasket();

  const [currentStep, setCurrentStep] = useState<CheckoutStep>("basket");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderResult, setOrderResult] = useState<OrderResult | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);

  // Validate shipping postcode against whitelist
  const isValidShippingPostcode = useMemo(() => {
    const postcode = shippingAddress.postalCode;
    if (!postcode || postcode.length !== 4) return false;
    return postcode in DELIVERY_POSTCODES;
  }, [shippingAddress.postalCode]);

  const shippingPostcodeError = useMemo(() => {
    const postcode = shippingAddress.postalCode;
    if (!postcode) return null;
    if (postcode.length === 4 && !isValidShippingPostcode) {
      return "Erre az irányítószámra nem szállítunk. Csak Budapest és Pest megye területére szállítunk.";
    }
    return null;
  }, [shippingAddress.postalCode, isValidShippingPostcode]);

  // Auto-populate city from postcode
  const autoPopulatedCity = useMemo(() => {
    return getCityFromPostcode(shippingAddress.postalCode);
  }, [shippingAddress.postalCode]);

  const formatPrice = (priceInCents: number): string => {
    return (priceInCents / 100).toLocaleString("hu-HU");
  };

  // Calculate shipping cost
  const shippingCost = storeSettings?.shippingCost ?? 99000; // Default 990 Ft
  const freeShippingThreshold = storeSettings?.freeShippingThreshold;
  const isFreeShipping = freeShippingThreshold ? totalPrice >= freeShippingThreshold : false;
  const actualShippingCost = isFreeShipping ? 0 : shippingCost;
  const grandTotal = totalPrice + actualShippingCost;

  const getUnitName = (unitId: string): string => {
    const unit = units.find((u) => u.id === unitId);
    return unit?.name || "";
  };

  const handleClose = () => {
    setIsBasketOpen(false);
    // Reset to basket view when closing
    setTimeout(() => {
      if (orderResult) {
        setCurrentStep("basket");
        setOrderResult(null);
        setOrderError(null);
      } else {
        setCurrentStep("basket");
      }
    }, 300);
  };

  const placeOrder = async () => {
    // Validate shipping address
    if (!shippingAddress.name || !shippingAddress.email || !shippingAddress.phone ||
        !shippingAddress.postalCode || !shippingAddress.city || !shippingAddress.street ||
        !shippingAddress.houseNumber) {
      setOrderError("Kérlek töltsd ki az összes kötelező mezőt a szállítási adatoknál!");
      return;
    }

    // Validate shipping postcode for delivery area
    if (!isValidShippingPostcode) {
      setOrderError("Erre az irányítószámra nem szállítunk. Csak Budapest és Pest megye területére szállítunk.");
      return;
    }

    // Validate billing address if not same as shipping
    if (!billingAddress.sameAsShipping) {
      if (!billingAddress.name || !billingAddress.postalCode || !billingAddress.city ||
          !billingAddress.street || !billingAddress.houseNumber) {
        setOrderError("Kérlek töltsd ki az összes kötelező mezőt a számlázási adatoknál!");
        return;
      }
    }

    setIsSubmitting(true);
    setOrderError(null);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items,
          subtotal: totalPrice,
          shippingCost: actualShippingCost,
          totalPrice: grandTotal,
          shippingAddress,
          billingAddress,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Hiba történt a rendelés leadása során");
      }

      setOrderResult({
        orderId: data.orderId,
        success: true,
      });
      setCurrentStep("success");
      clearBasket();
    } catch (error) {
      console.error("Order placement error:", error);
      setOrderError(
        error instanceof Error ? error.message : "Hiba történt a rendelés leadása során"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderBasketItems = () => (
    <div className="flex-1 overflow-y-auto p-4">
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center py-12">
          <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg font-medium">A kosarad üres</p>
          <p className="text-gray-400 text-sm mt-1">
            Adj hozzá termékeket a folytatáshoz
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => {
            const imageUrl = item.product.imageUrl || item.product.images?.[0];
            return (
              <div
                key={item.product.id}
                className="flex gap-3 bg-[#F5F3EF] rounded-xl p-3"
              >
                {/* Product Image */}
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Package className="h-6 w-6 text-gray-300" />
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="flex flex-col flex-1 min-w-0">
                  <h4 className="font-medium text-gray-900 text-sm line-clamp-2">
                    {item.product.name}
                  </h4>
                  <p className="text-[#1B5E4B] font-semibold mt-1">
                    {formatPrice(item.product.price)} Ft
                    {item.product.unitId && (
                      <span className="text-xs font-normal text-gray-500 ml-1">
                        / {getUnitName(item.product.unitId)}
                      </span>
                    )}
                  </p>

                  {/* Quantity Controls */}
                  <div className="flex items-center justify-between mt-auto pt-2">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-6 text-center text-sm font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"
                      onClick={() => removeItem(item.product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );

  const renderShippingForm = () => (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900 mb-4">Szállítási adatok</h3>

        {/* Delivery area notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
          <div className="flex items-start gap-2">
            <MapPin className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-800">Szállítási terület</p>
              <p className="text-xs text-amber-700 mt-0.5">
                Jelenleg csak Budapest és Pest megye területére szállítunk. Az irányítószám alapján automatikusan ellenőrizzük, hogy szállítunk-e a címre, és kitöltjük a település nevét.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <Label htmlFor="name">Név *</Label>
            <Input
              id="name"
              value={shippingAddress.name}
              onChange={(e) =>
                setShippingAddress({ ...shippingAddress, name: e.target.value })
              }
              placeholder="Teljes név"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="email">E-mail *</Label>
              <Input
                id="email"
                type="email"
                value={shippingAddress.email}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    email: e.target.value,
                  })
                }
                placeholder="pelda@email.hu"
              />
            </div>
            <div>
              <Label htmlFor="phone">Telefon *</Label>
              <Input
                id="phone"
                type="tel"
                value={shippingAddress.phone}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    phone: e.target.value,
                  })
                }
                placeholder="+36 30 123 4567"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="postalCode">Irányítószám *</Label>
              <Input
                id="postalCode"
                value={shippingAddress.postalCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ""); // Only digits
                  const city = getCityFromPostcode(value);
                  setShippingAddress({
                    ...shippingAddress,
                    postalCode: value,
                    city: city || "", // Auto-populate or clear city
                  });
                }}
                placeholder="pl. 1052, 2000"
                maxLength={4}
                className={shippingPostcodeError ? "border-red-500 focus-visible:ring-red-500" : isValidShippingPostcode ? "border-green-500 focus-visible:ring-green-500" : ""}
              />
              {shippingPostcodeError && (
                <p className="text-xs text-red-500 mt-1">{shippingPostcodeError}</p>
              )}
              {isValidShippingPostcode && (
                <p className="text-xs text-green-600 mt-1">✓ Szállítunk erre a címre</p>
              )}
            </div>
            <div>
              <Label htmlFor="city">Város *</Label>
              <Input
                id="city"
                value={autoPopulatedCity || shippingAddress.city}
                readOnly
                disabled={!!autoPopulatedCity}
                placeholder="Adja meg az irányítószámot"
                className={autoPopulatedCity ? "bg-gray-100 cursor-not-allowed" : ""}
              />
              {autoPopulatedCity && (
                <p className="text-xs text-gray-500 mt-1">Automatikusan kitöltve</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <Label htmlFor="street">Utca *</Label>
              <Input
                id="street"
                value={shippingAddress.street}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    street: e.target.value,
                  })
                }
                placeholder="Példa utca"
              />
            </div>
            <div>
              <Label htmlFor="houseNumber">Házszám *</Label>
              <Input
                id="houseNumber"
                value={shippingAddress.houseNumber}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    houseNumber: e.target.value,
                  })
                }
                placeholder="12"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="floor">Emelet</Label>
              <Input
                id="floor"
                value={shippingAddress.floor || ""}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    floor: e.target.value,
                  })
                }
                placeholder="3"
              />
            </div>
            <div>
              <Label htmlFor="door">Ajtó</Label>
              <Input
                id="door"
                value={shippingAddress.door || ""}
                onChange={(e) =>
                  setShippingAddress({
                    ...shippingAddress,
                    door: e.target.value,
                  })
                }
                placeholder="12"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="note">Megjegyzés a szállításhoz</Label>
            <Input
              id="note"
              value={shippingAddress.note || ""}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  note: e.target.value,
                })
              }
              placeholder="Pl.: Kapucsengő, egyéb útmutatás..."
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderBillingForm = () => (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900 mb-4">Számlázási adatok</h3>

        <div className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            id="sameAsShipping"
            checked={billingAddress.sameAsShipping}
            onChange={(e) =>
              setBillingAddress({
                ...billingAddress,
                sameAsShipping: e.target.checked,
              })
            }
            className="h-4 w-4 rounded border-gray-300 text-[#1B5E4B] focus:ring-[#1B5E4B]"
          />
          <Label htmlFor="sameAsShipping" className="cursor-pointer">
            Megegyezik a szállítási címmel
          </Label>
        </div>

        {!billingAddress.sameAsShipping && (
          <div className="space-y-3">
            <div>
              <Label htmlFor="companyName">Cégnév (opcionális)</Label>
              <Input
                id="companyName"
                value={billingAddress.companyName || ""}
                onChange={(e) =>
                  setBillingAddress({
                    ...billingAddress,
                    companyName: e.target.value,
                  })
                }
                placeholder="Cégnév Kft."
              />
            </div>

            <div>
              <Label htmlFor="taxNumber">Adószám (opcionális)</Label>
              <Input
                id="taxNumber"
                value={billingAddress.taxNumber || ""}
                onChange={(e) =>
                  setBillingAddress({
                    ...billingAddress,
                    taxNumber: e.target.value,
                  })
                }
                placeholder="12345678-1-23"
              />
            </div>

            <div>
              <Label htmlFor="billingName">Számlázási név *</Label>
              <Input
                id="billingName"
                value={billingAddress.name}
                onChange={(e) =>
                  setBillingAddress({
                    ...billingAddress,
                    name: e.target.value,
                  })
                }
                placeholder="Teljes név"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="billingPostalCode">Irányítószám *</Label>
                <Input
                  id="billingPostalCode"
                  value={billingAddress.postalCode}
                  onChange={(e) =>
                    setBillingAddress({
                      ...billingAddress,
                      postalCode: e.target.value,
                    })
                  }
                  placeholder="1234"
                  maxLength={4}
                />
              </div>
              <div>
                <Label htmlFor="billingCity">Város *</Label>
                <Input
                  id="billingCity"
                  value={billingAddress.city}
                  onChange={(e) =>
                    setBillingAddress({
                      ...billingAddress,
                      city: e.target.value,
                    })
                  }
                  placeholder="Budapest"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <Label htmlFor="billingStreet">Utca *</Label>
                <Input
                  id="billingStreet"
                  value={billingAddress.street}
                  onChange={(e) =>
                    setBillingAddress({
                      ...billingAddress,
                      street: e.target.value,
                    })
                  }
                  placeholder="Példa utca"
                />
              </div>
              <div>
                <Label htmlFor="billingHouseNumber">Házszám *</Label>
                <Input
                  id="billingHouseNumber"
                  value={billingAddress.houseNumber}
                  onChange={(e) =>
                    setBillingAddress({
                      ...billingAddress,
                      houseNumber: e.target.value,
                    })
                  }
                  placeholder="12"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderStepIndicator = () => {
    if (currentStep === "success") return null;
    
    return (
      <div className="flex items-center justify-center gap-2 px-4 py-2 border-b bg-gray-50">
        {(["basket", "shipping", "billing"] as const).map((step, index) => (
          <div key={step} className="flex items-center">
            <button
              onClick={() => {
                if (step === "basket" || (step === "shipping" && currentStep !== "basket")) {
                  setCurrentStep(step);
                } else if (step === "billing" && currentStep === "billing") {
                  // Can go back
                }
              }}
              disabled={
                (step === "shipping" && items.length === 0) ||
                (step === "billing" && currentStep === "basket")
              }
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                currentStep === step
                  ? "bg-[#1B5E4B] text-white"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              } ${
                (step === "shipping" && items.length === 0) ||
                (step === "billing" && currentStep === "basket")
                  ? "opacity-50 cursor-not-allowed"
                  : "cursor-pointer"
              }`}
            >
              {index + 1}
            </button>
            {index < 2 && (
              <div className="w-8 h-0.5 bg-gray-200 mx-1" />
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderSuccess = () => (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="w-20 h-20 rounded-full bg-[#1B5E4B] flex items-center justify-center mb-6">
        <CheckCircle className="h-10 w-10 text-white" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Köszönjük a rendelésed!
      </h2>
      <p className="text-gray-600 mb-4">
        A rendelésedet sikeresen fogadtuk.
      </p>
      {orderResult && (
        <div className="bg-[#F5F3EF] rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600">Rendelésszám:</p>
          <p className="text-lg font-bold text-[#1B5E4B]">{orderResult.orderId}</p>
        </div>
      )}
      <p className="text-sm text-gray-500 mb-6">
        Visszaigazoló e-mailt küldtünk a megadott címre a rendelés részleteivel.
      </p>
      <Button
        className="bg-[#1B5E4B] hover:bg-[#247a61] text-white"
        onClick={handleClose}
      >
        Bezárás
      </Button>
    </div>
  );

  const renderFooter = () => {
    if (items.length === 0 || currentStep === "success") return null;

    return (
      <SheetFooter>
        {/* Error Message */}
        {orderError && (
          <div className="w-full bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-3 text-sm">
            {orderError}
          </div>
        )}

        {/* Price Breakdown */}
        <div className="w-full space-y-2 mb-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Részösszeg:</span>
            <span className="text-gray-900">{formatPrice(totalPrice)} Ft</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Szállítási költség:</span>
            {isFreeShipping ? (
              <span className="text-green-600 font-medium">Ingyenes!</span>
            ) : (
              <span className="text-gray-900">{formatPrice(shippingCost)} Ft</span>
            )}
          </div>
          {freeShippingThreshold && !isFreeShipping && (
            <p className="text-xs text-gray-500">
              Még {formatPrice(freeShippingThreshold - totalPrice)} Ft és ingyenes a szállítás!
            </p>
          )}
          <div className="flex items-center justify-between pt-2 border-t">
            <span className="text-gray-900 font-medium">Végösszeg:</span>
            <span className="text-2xl font-bold text-[#1B5E4B]">
              {formatPrice(grandTotal)} Ft
            </span>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="w-full flex gap-2">
          {currentStep !== "basket" && (
            <Button
              variant="outline"
              className="flex-1"
              onClick={() =>
                setCurrentStep(currentStep === "billing" ? "shipping" : "basket")
              }
              disabled={isSubmitting}
            >
              Vissza
            </Button>
          )}
          {currentStep === "basket" && (
            <Button
              className="flex-1 bg-[#1B5E4B] hover:bg-[#247a61] text-white"
              onClick={() => setCurrentStep("shipping")}
            >
              Tovább a szállításhoz
            </Button>
          )}
          {currentStep === "shipping" && (
            <Button
              className="flex-1 bg-[#1B5E4B] hover:bg-[#247a61] text-white"
              onClick={() => setCurrentStep("billing")}
            >
              Tovább a számlázáshoz
            </Button>
          )}
          {currentStep === "billing" && (
            <Button
              className="flex-1 bg-[#1B5E4B] hover:bg-[#247a61] text-white"
              onClick={placeOrder}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Feldolgozás...
                </>
              ) : (
                "Megrendelés leadása"
              )}
            </Button>
          )}
        </div>
      </SheetFooter>
    );
  };

  return (
    <Sheet open={isBasketOpen} onOpenChange={setIsBasketOpen}>
      <SheetContent className="flex flex-col p-0">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Kosár
            {itemCount > 0 && (
              <span className="text-sm font-normal text-gray-500">
                ({itemCount} tétel)
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {items.length > 0 && currentStep !== "success" && renderStepIndicator()}

        {currentStep === "basket" && renderBasketItems()}
        {currentStep === "shipping" && renderShippingForm()}
        {currentStep === "billing" && renderBillingForm()}
        {currentStep === "success" && renderSuccess()}

        {renderFooter()}
      </SheetContent>
    </Sheet>
  );
}
