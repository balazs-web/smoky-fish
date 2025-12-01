'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, FileText } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  getAllLegalPages,
  saveLegalPage,
  type LegalPageType,
  legalPageTitles,
} from '@/lib/legal-service';

export default function LegalPagesAdmin() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<LegalPageType>('impresszum');
  const [editedPages, setEditedPages] = useState<Record<LegalPageType, { title: string; content: string }>>({
    impresszum: { title: '', content: '' },
    aszf: { title: '', content: '' },
    adatkezeles: { title: '', content: '' },
    szallitas: { title: '', content: '' },
  });
  const [initialized, setInitialized] = useState(false);

  const { data: legalPages, isLoading } = useQuery({
    queryKey: ['legalPages'],
    queryFn: getAllLegalPages,
  });

  // Initialize edited pages when data loads
  if (legalPages && !initialized) {
    setEditedPages({
      impresszum: { title: legalPages.impresszum.title, content: legalPages.impresszum.content },
      aszf: { title: legalPages.aszf.title, content: legalPages.aszf.content },
      adatkezeles: { title: legalPages.adatkezeles.title, content: legalPages.adatkezeles.content },
      szallitas: { title: legalPages.szallitas.title, content: legalPages.szallitas.content },
    });
    setInitialized(true);
  }

  const saveMutation = useMutation({
    mutationFn: ({ type, data }: { type: LegalPageType; data: { title: string; content: string } }) =>
      saveLegalPage(type, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['legalPages'] });
    },
  });

  const handleSave = (type: LegalPageType) => {
    saveMutation.mutate({ type, data: editedPages[type] });
  };

  const updatePage = (type: LegalPageType, field: 'title' | 'content', value: string) => {
    setEditedPages((prev) => ({
      ...prev,
      [type]: { ...prev[type], [field]: value },
    }));
  };

  const pageTypes: LegalPageType[] = ['impresszum', 'aszf', 'adatkezeles', 'szallitas'];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-500">Betöltés...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Jogi oldalak</h2>
        <p className="text-gray-600 mt-1">
          Impresszum, ÁSZF, Adatkezelés és Szállítási feltételek szerkesztése
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Tartalom szerkesztése
          </CardTitle>
          <CardDescription>
            A tartalom HTML formátumban kerül mentésre. Formázott szöveget beilleszthetsz, 
            vagy használhatsz HTML tag-eket (pl. &lt;p&gt;, &lt;h2&gt;, &lt;ul&gt;, &lt;strong&gt;).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as LegalPageType)}>
            <TabsList className="grid w-full grid-cols-4">
              {pageTypes.map((type) => (
                <TabsTrigger key={type} value={type} className="text-xs sm:text-sm">
                  {type === 'impresszum' && 'Impresszum'}
                  {type === 'aszf' && 'ÁSZF'}
                  {type === 'adatkezeles' && 'Adatkezelés'}
                  {type === 'szallitas' && 'Szállítás'}
                </TabsTrigger>
              ))}
            </TabsList>

            {pageTypes.map((type) => (
              <TabsContent key={type} value={type} className="space-y-4 mt-6">
                <div className="space-y-2">
                  <Label htmlFor={`${type}-title`}>Oldal címe</Label>
                  <Input
                    id={`${type}-title`}
                    value={editedPages[type].title}
                    onChange={(e) => updatePage(type, 'title', e.target.value)}
                    placeholder={legalPageTitles[type]}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`${type}-content`}>Tartalom (HTML)</Label>
                  <textarea
                    id={`${type}-content`}
                    value={editedPages[type].content}
                    onChange={(e) => updatePage(type, 'content', e.target.value)}
                    className="w-full min-h-[400px] p-4 border rounded-lg font-mono text-sm resize-y focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="<h2>Cím</h2>
<p>Szöveg...</p>
<ul>
  <li>Lista elem</li>
</ul>"
                  />
                  <p className="text-xs text-gray-500">
                    Tipp: Word-ből vagy Google Docs-ból kimásolt formázott szöveg HTML-ként illeszthető be.
                  </p>
                </div>

                {/* Preview */}
                <div className="space-y-2">
                  <Label>Előnézet</Label>
                  <div className="border rounded-lg p-4 bg-white min-h-[200px] prose prose-sm max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: editedPages[type].content }} />
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    onClick={() => handleSave(type)}
                    disabled={saveMutation.isPending}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {saveMutation.isPending ? 'Mentés...' : 'Mentés'}
                  </Button>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
