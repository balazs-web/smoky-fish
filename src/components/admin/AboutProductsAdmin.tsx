'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ChevronDown, ChevronRight, Plus, Trash2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  fetchAboutProductsConfig, 
  saveAboutProductsConfig 
} from '@/lib/aboutProductsService';
import { 
  defaultAboutProductsConfig, 
  type AboutProductsConfig 
} from '@/config/aboutProductsConfig';
import { uploadImage, deleteImage } from '@/lib/storage-service';

const iconOptions = [
  { value: 'fish', label: 'Hal' },
  { value: 'beef', label: 'Hús / Protein' },
  { value: 'sun', label: 'Nap / Vitamin' },
  { value: 'leaf', label: 'Levél / Természetes' },
  { value: 'shield', label: 'Pajzs / Biztonság' },
  { value: 'thermometer', label: 'Hőmérő' },
  { value: 'award', label: 'Díj / Minőség' },
  { value: 'package', label: 'Csomag' },
  { value: 'flame', label: 'Láng / Füst' },
  { value: 'snowflake', label: 'Hópehely / Hűtés' },
  { value: 'check', label: 'Pipa' },
  { value: 'star', label: 'Csillag' },
];

export function AboutProductsAdmin() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'hero' | 'natural' | 'smoking' | 'process' | 'quality' | 'packaging'>('hero');

  const { data: config, isLoading, refetch } = useQuery({
    queryKey: ['aboutProductsConfig'],
    queryFn: fetchAboutProductsConfig,
    initialData: defaultAboutProductsConfig,
  });

  const [formData, setFormData] = useState<AboutProductsConfig>(config || defaultAboutProductsConfig);

  useEffect(() => {
    if (config) {
      setFormData(config);
    }
  }, [config]);

  const saveMutation = useMutation({
    mutationFn: saveAboutProductsConfig,
    onSuccess: () => {
      refetch();
    },
  });

  const handleSave = async () => {
    await saveMutation.mutateAsync(formData);
  };

  const handleImageUpload = async (
    e: ChangeEvent<HTMLInputElement>,
    path: string,
    onSuccess: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await uploadImage(file, `aboutProducts/${path}`);
      onSuccess(url);
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  const updateHero = (field: keyof typeof formData.hero, value: string) => {
    setFormData(prev => ({
      ...prev,
      hero: { ...prev.hero, [field]: value }
    }));
  };

  const updateNaturalProduct = (field: keyof typeof formData.naturalProduct, value: string) => {
    setFormData(prev => ({
      ...prev,
      naturalProduct: { ...prev.naturalProduct, [field]: value }
    }));
  };

  const updateFeature = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      naturalProduct: {
        ...prev.naturalProduct,
        features: prev.naturalProduct.features.map((f, i) => 
          i === index ? { ...f, [field]: value } : f
        )
      }
    }));
  };

  const updateColdSmoking = (field: keyof typeof formData.coldSmoking, value: string) => {
    setFormData(prev => ({
      ...prev,
      coldSmoking: { ...prev.coldSmoking, [field]: value }
    }));
  };

  const updateProcessStep = (index: number, field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      smokingProcess: {
        ...prev.smokingProcess,
        steps: prev.smokingProcess.steps.map((s, i) => 
          i === index ? { ...s, [field]: value } : s
        )
      }
    }));
  };

  const updateQualityItem = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      qualityStandards: {
        ...prev.qualityStandards,
        items: prev.qualityStandards.items.map((item, i) => 
          i === index ? { ...item, [field]: value } : item
        )
      }
    }));
  };

  const updatePackagingImage = (index: number, url: string) => {
    setFormData(prev => ({
      ...prev,
      premiumPackaging: {
        ...prev.premiumPackaging,
        images: prev.premiumPackaging.images.map((img, i) => i === index ? url : img)
      }
    }));
  };

  const tabs = [
    { id: 'hero', label: '1. Hero' },
    { id: 'natural', label: '2. Természetes' },
    { id: 'smoking', label: '3. Bükkfa Füstölés' },
    { id: 'process', label: '4. Folyamat' },
    { id: 'quality', label: '5. Minőség' },
    { id: 'packaging', label: '6. Csomagolás' },
  ] as const;

  return (
    <div className="border-t border-neutral-800">
      {/* Toggle Button */}
      <div className="mx-auto flex max-w-6xl justify-end px-4 pt-4 sm:px-6 lg:px-8">
        <Button
          type="button"
          className="border border-neutral-700 bg-black/40 text-xs text-neutral-200 hover:bg-neutral-900 hover:text-neutral-100"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? (
            <>
              <ChevronDown className="mr-2 h-4 w-4" />
              Termékbemutató szekció elrejtése
            </>
          ) : (
            <>
              <ChevronRight className="mr-2 h-4 w-4" />
              Termékbemutató szekció megnyitása
            </>
          )}
        </Button>
      </div>

      {isOpen && (
        <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-neutral-200">
              Termékbemutató szekció (6 rész)
            </h2>
            <p className="text-xs text-neutral-400">
              A nyitóoldal termékbemutató szekciójának beállításai. Szövegek és képek kezelése.
            </p>
          </div>

          {/* Tabs */}
          <div className="mb-6 flex flex-wrap gap-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`rounded px-3 py-1.5 text-xs font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#C89A63] text-black'
                    : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="rounded-lg border border-neutral-800 bg-black/40 p-4">
            {/* Tab 1: Hero */}
            {activeTab === 'hero' && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-neutral-200">Hideg Füstölésű Halak - Hero</h3>
                
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-neutral-200">Alcím</label>
                  <input
                    className="w-full rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs outline-none focus:border-[#C89A63]"
                    value={formData.hero.subtitle}
                    onChange={(e) => updateHero('subtitle', e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium text-neutral-200">Főcím</label>
                  <input
                    className="w-full rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs outline-none focus:border-[#C89A63]"
                    value={formData.hero.title}
                    onChange={(e) => updateHero('title', e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium text-neutral-200">Leírás</label>
                  <textarea
                    rows={3}
                    className="w-full rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs outline-none focus:border-[#C89A63]"
                    value={formData.hero.description}
                    onChange={(e) => updateHero('description', e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium text-neutral-200">Háttérkép</label>
                  <div className="flex gap-2">
                    <input
                      className="flex-1 rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs outline-none focus:border-[#C89A63]"
                      value={formData.hero.imageUrl}
                      onChange={(e) => updateHero('imageUrl', e.target.value)}
                      placeholder="Kép URL..."
                    />
                    <label className="cursor-pointer rounded bg-neutral-800 px-3 py-1 text-xs text-neutral-200 hover:bg-neutral-700">
                      <Upload className="inline h-3 w-3 mr-1" />
                      Feltöltés
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, 'hero', (url) => updateHero('imageUrl', url))}
                      />
                    </label>
                  </div>
                  {formData.hero.imageUrl && (
                    <img src={formData.hero.imageUrl} alt="Preview" className="mt-2 h-20 rounded object-cover" />
                  )}
                </div>
              </div>
            )}

            {/* Tab 2: Natural Product */}
            {activeTab === 'natural' && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-neutral-200">Természetes Termék</h3>
                
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-neutral-200">Cím</label>
                  <input
                    className="w-full rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs outline-none focus:border-[#C89A63]"
                    value={formData.naturalProduct.title}
                    onChange={(e) => updateNaturalProduct('title', e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium text-neutral-200">Leírás</label>
                  <textarea
                    rows={3}
                    className="w-full rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs outline-none focus:border-[#C89A63]"
                    value={formData.naturalProduct.description}
                    onChange={(e) => updateNaturalProduct('description', e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium text-neutral-200">Kép</label>
                  <div className="flex gap-2">
                    <input
                      className="flex-1 rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs outline-none focus:border-[#C89A63]"
                      value={formData.naturalProduct.imageUrl}
                      onChange={(e) => updateNaturalProduct('imageUrl', e.target.value)}
                    />
                    <label className="cursor-pointer rounded bg-neutral-800 px-3 py-1 text-xs text-neutral-200 hover:bg-neutral-700">
                      <Upload className="inline h-3 w-3 mr-1" />
                      Feltöltés
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, 'natural', (url) => updateNaturalProduct('imageUrl', url))}
                      />
                    </label>
                  </div>
                </div>

                <div className="border-t border-neutral-800 pt-4">
                  <h4 className="mb-3 text-xs font-medium text-neutral-300">Tulajdonságok (4 ikon)</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    {formData.naturalProduct.features.map((feature, idx) => (
                      <div key={feature.id} className="rounded border border-neutral-800 bg-neutral-900/50 p-3 space-y-2">
                        <div className="flex gap-2">
                          <select
                            className="w-24 rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs"
                            value={feature.icon}
                            onChange={(e) => updateFeature(idx, 'icon', e.target.value)}
                          >
                            {iconOptions.map(opt => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                          <input
                            className="flex-1 rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs"
                            value={feature.title}
                            onChange={(e) => updateFeature(idx, 'title', e.target.value)}
                            placeholder="Cím"
                          />
                        </div>
                        <input
                          className="w-full rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs"
                          value={feature.description}
                          onChange={(e) => updateFeature(idx, 'description', e.target.value)}
                          placeholder="Leírás"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Cold Smoking */}
            {activeTab === 'smoking' && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-neutral-200">Hideg Bükkfa Füstölés</h3>
                
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-neutral-200">Cím</label>
                  <input
                    className="w-full rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs outline-none focus:border-[#C89A63]"
                    value={formData.coldSmoking.title || ''}
                    onChange={(e) => updateColdSmoking('title', e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium text-neutral-200">Rövid leírás (cím alatt jelenik meg)</label>
                  <textarea
                    rows={2}
                    className="w-full rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs outline-none focus:border-[#C89A63]"
                    value={formData.coldSmoking.shortDescription || ''}
                    onChange={(e) => updateColdSmoking('shortDescription', e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium text-neutral-200">Hosszú leírás (kép mellett jelenik meg)</label>
                  <textarea
                    rows={4}
                    className="w-full rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs outline-none focus:border-[#C89A63]"
                    value={formData.coldSmoking.longDescription || ''}
                    onChange={(e) => updateColdSmoking('longDescription', e.target.value)}
                  />
                </div>

                <div className="border-t border-neutral-800 pt-4">
                  <h4 className="mb-3 text-xs font-medium text-neutral-300">Kép</h4>
                  <div className="flex gap-4 items-start">
                    <div className="w-48 space-y-2">
                      <div className="aspect-[4/3] rounded bg-neutral-800 overflow-hidden">
                        {formData.coldSmoking.imageUrl ? (
                          <img src={formData.coldSmoking.imageUrl} alt="Bükkfa füstölés" className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-neutral-500 text-xs">
                            Nincs kép
                          </div>
                        )}
                      </div>
                      <label className="block cursor-pointer rounded bg-neutral-800 px-2 py-1 text-center text-xs text-neutral-200 hover:bg-neutral-700">
                        <Upload className="inline h-3 w-3 mr-1" />
                        Kép feltöltése
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageUpload(e, 'smoking', (url) => updateColdSmoking('imageUrl', url))}
                        />
                      </label>
                    </div>
                    <div className="flex-1">
                      <input
                        className="w-full rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs outline-none focus:border-[#C89A63]"
                        value={formData.coldSmoking.imageUrl || ''}
                        onChange={(e) => updateColdSmoking('imageUrl', e.target.value)}
                        placeholder="Kép URL..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Smoking Process */}
            {activeTab === 'process' && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-neutral-200">Füstölési Folyamat</h3>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-neutral-200">Cím</label>
                    <input
                      className="w-full rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs outline-none focus:border-[#C89A63]"
                      value={formData.smokingProcess.title}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        smokingProcess: { ...prev.smokingProcess, title: e.target.value }
                      }))}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-medium text-neutral-200">Alcím</label>
                    <input
                      className="w-full rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs outline-none focus:border-[#C89A63]"
                      value={formData.smokingProcess.subtitle}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        smokingProcess: { ...prev.smokingProcess, subtitle: e.target.value }
                      }))}
                    />
                  </div>
                </div>

                <div className="border-t border-neutral-800 pt-4">
                  <h4 className="mb-3 text-xs font-medium text-neutral-300">Lépések (5 lépés)</h4>
                  <div className="space-y-4">
                    {formData.smokingProcess.steps.map((step, idx) => (
                      <div key={step.id} className="rounded border border-neutral-800 bg-neutral-900/50 p-3 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#C89A63] text-xs font-bold text-black">
                            {step.number}
                          </span>
                          <input
                            className="flex-1 rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs font-medium"
                            value={step.title}
                            onChange={(e) => updateProcessStep(idx, 'title', e.target.value)}
                            placeholder="Lépés címe"
                          />
                        </div>
                        <textarea
                          rows={2}
                          className="w-full rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs"
                          value={step.description}
                          onChange={(e) => updateProcessStep(idx, 'description', e.target.value)}
                          placeholder="Lépés leírása"
                        />
                        <div className="flex gap-2 items-center">
                          <input
                            className="flex-1 rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs"
                            value={step.imageUrl}
                            onChange={(e) => updateProcessStep(idx, 'imageUrl', e.target.value)}
                            placeholder="Kép URL"
                          />
                          <label className="cursor-pointer rounded bg-neutral-800 px-2 py-1 text-xs text-neutral-200 hover:bg-neutral-700">
                            <Upload className="inline h-3 w-3" />
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleImageUpload(e, `process-${idx}`, (url) => updateProcessStep(idx, 'imageUrl', url))}
                            />
                          </label>
                          {step.imageUrl && (
                            <img src={step.imageUrl} alt={step.title} className="h-8 w-12 rounded object-cover" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 5: Quality Standards */}
            {activeTab === 'quality' && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-neutral-200">Minőségi Elvárások</h3>
                <p className="text-xs text-neutral-400">Hover effekt: ha van kép, a kártya fölé húzva füstös átmenettel megjelenik a kép.</p>
                
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-neutral-200">Cím</label>
                  <input
                    className="w-full rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs outline-none focus:border-[#C89A63]"
                    value={formData.qualityStandards.title || ''}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      qualityStandards: { ...prev.qualityStandards, title: e.target.value }
                    }))}
                  />
                </div>

                <div className="border-t border-neutral-800 pt-4">
                  <h4 className="mb-3 text-xs font-medium text-neutral-300">Minőségi elemek (4 kártya hover képpel)</h4>
                  <div className="grid gap-4 md:grid-cols-2">
                    {formData.qualityStandards.items.map((item, idx) => (
                      <div key={item.id} className="rounded border border-neutral-800 bg-neutral-900/50 p-3 space-y-2">
                        <div className="flex gap-2">
                          <select
                            className="w-24 rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs"
                            value={item.icon || 'shield'}
                            onChange={(e) => updateQualityItem(idx, 'icon', e.target.value)}
                          >
                            {iconOptions.map(opt => (
                              <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                          </select>
                          <input
                            className="flex-1 rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs"
                            value={item.title || ''}
                            onChange={(e) => updateQualityItem(idx, 'title', e.target.value)}
                            placeholder="Cím"
                          />
                        </div>
                        <input
                          className="w-full rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs"
                          value={item.description || ''}
                          onChange={(e) => updateQualityItem(idx, 'description', e.target.value)}
                          placeholder="Leírás"
                        />
                        {/* Image for hover effect */}
                        <div className="flex gap-2 items-center pt-2 border-t border-neutral-800">
                          <div className="w-16 h-12 rounded bg-neutral-800 overflow-hidden flex-shrink-0">
                            {item.imageUrl ? (
                              <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-neutral-600 text-[10px]">
                                Nincs
                              </div>
                            )}
                          </div>
                          <input
                            className="flex-1 rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs"
                            value={item.imageUrl || ''}
                            onChange={(e) => updateQualityItem(idx, 'imageUrl', e.target.value)}
                            placeholder="Hover kép URL..."
                          />
                          <label className="cursor-pointer rounded bg-neutral-800 px-2 py-1 text-xs text-neutral-200 hover:bg-neutral-700 flex-shrink-0">
                            <Upload className="inline h-3 w-3" />
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleImageUpload(e, `quality-${idx}`, (url) => updateQualityItem(idx, 'imageUrl', url))}
                            />
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tab 6: Premium Packaging */}
            {activeTab === 'packaging' && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-neutral-200">Prémium Csomagolás</h3>
                
                <div className="space-y-1">
                  <label className="block text-xs font-medium text-neutral-200">Cím</label>
                  <input
                    className="w-full rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs outline-none focus:border-[#C89A63]"
                    value={formData.premiumPackaging.title}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      premiumPackaging: { ...prev.premiumPackaging, title: e.target.value }
                    }))}
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-medium text-neutral-200">Leírás</label>
                  <textarea
                    rows={3}
                    className="w-full rounded border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs outline-none focus:border-[#C89A63]"
                    value={formData.premiumPackaging.description}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      premiumPackaging: { ...prev.premiumPackaging, description: e.target.value }
                    }))}
                  />
                </div>

                <div className="border-t border-neutral-800 pt-4">
                  <h4 className="mb-3 text-xs font-medium text-neutral-300">Galéria (4 kép)</h4>
                  <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
                    {formData.premiumPackaging.images.map((img, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="aspect-square rounded bg-neutral-800 overflow-hidden">
                          {img ? (
                            <img src={img} alt={`Packaging ${idx + 1}`} className="h-full w-full object-cover" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-neutral-500 text-xs">
                              Nincs kép
                            </div>
                          )}
                        </div>
                        <label className="block cursor-pointer rounded bg-neutral-800 px-2 py-1 text-center text-xs text-neutral-200 hover:bg-neutral-700">
                          <Upload className="inline h-3 w-3 mr-1" />
                          Kép {idx + 1}
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageUpload(e, `packaging-${idx}`, (url) => updatePackagingImage(idx, url))}
                          />
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-6 border-t border-neutral-800 pt-4">
              <Button
                onClick={handleSave}
                disabled={saveMutation.isPending}
                className="bg-[#C89A63] text-black hover:bg-[#b8864f]"
              >
                {saveMutation.isPending ? 'Mentés...' : 'Termékbemutató mentése'}
              </Button>
              {saveMutation.isSuccess && (
                <span className="ml-3 text-xs text-green-400">Sikeresen mentve!</span>
              )}
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
