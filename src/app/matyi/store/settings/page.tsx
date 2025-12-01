'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Truck, Save, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getStoreSettings, updateStoreSettings } from '@/lib/store-service';

export default function StoreSettingsPage() {
  const queryClient = useQueryClient();
  const [shippingCostInput, setShippingCostInput] = useState('');
  const [freeThresholdInput, setFreeThresholdInput] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const { data: settings, isLoading } = useQuery({
    queryKey: ['storeSettings'],
    queryFn: getStoreSettings,
  });

  // Initialize inputs when settings load
  const initializeInputs = () => {
    if (settings && !shippingCostInput) {
      setShippingCostInput((settings.shippingCost / 100).toString());
      setFreeThresholdInput(
        settings.freeShippingThreshold 
          ? (settings.freeShippingThreshold / 100).toString() 
          : ''
      );
    }
  };

  // Call this when settings are loaded
  if (settings && !shippingCostInput) {
    initializeInputs();
  }

  const updateMutation = useMutation({
    mutationFn: updateStoreSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['storeSettings'] });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    },
  });

  const handleSave = () => {
    const shippingCost = Math.round(parseFloat(shippingCostInput || '0') * 100);
    const freeThreshold = freeThresholdInput 
      ? Math.round(parseFloat(freeThresholdInput) * 100) 
      : undefined;

    updateMutation.mutate({
      shippingCost,
      freeShippingThreshold: freeThreshold,
    });
  };

  const formatPrice = (cents: number) => {
    return (cents / 100).toLocaleString('hu-HU') + ' Ft';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Bolt Beállítások</h2>
        <p className="text-gray-600 mt-1">Szállítási díj és egyéb beállítások</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="w-5 h-5" />
            Szállítási Költség
          </CardTitle>
          <CardDescription>
            Állítsd be a szállítási díjat és az ingyenes szállítás küszöbét
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Shipping Cost */}
          <div className="space-y-2">
            <Label htmlFor="shippingCost">Szállítási díj (Ft)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="shippingCost"
                type="number"
                min="0"
                step="1"
                value={shippingCostInput}
                onChange={(e) => setShippingCostInput(e.target.value)}
                placeholder="990"
                className="max-w-xs"
              />
              <span className="text-gray-500">Ft</span>
            </div>
            <p className="text-sm text-gray-500">
              Ez az összeg fog megjelenni a kosárban szállítási költségként
            </p>
          </div>

          {/* Free Shipping Threshold */}
          <div className="space-y-2">
            <Label htmlFor="freeThreshold">Ingyenes szállítás összeghatára (opcionális)</Label>
            <div className="flex items-center gap-2">
              <Input
                id="freeThreshold"
                type="number"
                min="0"
                step="1"
                value={freeThresholdInput}
                onChange={(e) => setFreeThresholdInput(e.target.value)}
                placeholder="10000"
                className="max-w-xs"
              />
              <span className="text-gray-500">Ft</span>
            </div>
            <p className="text-sm text-gray-500">
              Ha a rendelés összege eléri ezt az összeget, a szállítás ingyenes lesz. Hagyd üresen, ha nem szeretnéd használni.
            </p>
          </div>

          {/* Current Settings Preview */}
          {settings && (
            <div className="bg-gray-50 rounded-lg p-4 mt-4">
              <h4 className="font-medium text-gray-900 mb-2">Jelenlegi beállítások:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Szállítási díj: <strong>{formatPrice(settings.shippingCost)}</strong></li>
                {settings.freeShippingThreshold && (
                  <li>• Ingyenes szállítás: <strong>{formatPrice(settings.freeShippingThreshold)}</strong> felett</li>
                )}
              </ul>
            </div>
          )}

          {/* Save Button */}
          <div className="flex items-center gap-4 pt-4 border-t">
            <Button
              onClick={handleSave}
              disabled={updateMutation.isPending}
              className="bg-[#1B5E4B] hover:bg-[#247a61]"
            >
              {updateMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Mentés...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Beállítások Mentése
                </>
              )}
            </Button>
            {saveSuccess && (
              <span className="text-green-600 text-sm">✓ Sikeresen mentve!</span>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
