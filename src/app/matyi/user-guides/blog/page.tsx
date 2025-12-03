'use client';

import Link from 'next/link';
import { ArrowLeft, FileText, Link2, Image, Type, Palette, List, AlertTriangle, CheckCircle, Tag, Layers } from 'lucide-react';

export default function BlogUserGuidePage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50">
      {/* Header */}
      <header className="border-b border-neutral-800 bg-black/80 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Link
            href="/matyi/blog"
            className="text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-semibold tracking-tight">
            Blog Használati Útmutató
          </h1>
        </div>
      </header>

      {/* Content */}
      <main className="px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* Introduction */}
          <section className="space-y-4">
            <p className="text-lg text-neutral-300 leading-relaxed">
              Ez az útmutató segít a blog cikkek létrehozásában és szerkesztésében. 
              Olvasd végig alaposan, mielőtt nekiállsz írni!
            </p>
          </section>

          {/* Table of Contents */}
          <nav className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-6">
            <h2 className="text-lg font-semibold text-[#C89A63] mb-4">Tartalomjegyzék</h2>
            <ul className="space-y-2 text-neutral-300">
              <li><a href="#uj-cikk" className="hover:text-[#C89A63] transition-colors">1. Új cikk létrehozása</a></li>
              <li><a href="#slug" className="hover:text-[#C89A63] transition-colors">2. Mi az a Slug?</a></li>
              <li><a href="#kategoriak" className="hover:text-[#C89A63] transition-colors">3. Kategóriák használata</a></li>
              <li><a href="#szovegszerkeszto" className="hover:text-[#C89A63] transition-colors">4. A szövegszerkesztő használata</a></li>
              <li><a href="#szoveg-beillesztes" className="hover:text-[#C89A63] transition-colors">5. Szöveg beillesztése más forrásból</a></li>
              <li><a href="#kepek" className="hover:text-[#C89A63] transition-colors">6. Képek beszúrása</a></li>
              <li><a href="#formazas" className="hover:text-[#C89A63] transition-colors">7. Szöveg formázása</a></li>
              <li><a href="#szinek" className="hover:text-[#C89A63] transition-colors">8. Színek használata</a></li>
              <li><a href="#linkek" className="hover:text-[#C89A63] transition-colors">9. Hivatkozások (FONTOS!)</a></li>
              <li><a href="#publikalas" className="hover:text-[#C89A63] transition-colors">10. Publikálás</a></li>
            </ul>
          </nav>

          {/* Section 1: New Post */}
          <section id="uj-cikk" className="space-y-4 scroll-mt-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#C89A63]/20 flex items-center justify-center">
                <FileText className="h-5 w-5 text-[#C89A63]" />
              </div>
              <h2 className="text-2xl font-bold">1. Új cikk létrehozása</h2>
            </div>
            <div className="pl-13 space-y-4 text-neutral-300">
              <p>
                A blog kezelő oldalon kattints az <strong className="text-[#C89A63]">"Új cikk"</strong> gombra 
                a jobb felső sarokban. Megnyílik a szerkesztő felület.
              </p>
              <div className="rounded-lg bg-neutral-900 border border-neutral-800 p-4">
                <p className="font-medium text-neutral-100 mb-2">A kitöltendő mezők:</p>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Cím:</strong> A cikk főcíme, ami a böngészőben és a kártyákon megjelenik</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Alcím/Leírás:</strong> Rövid összefoglaló, ami a blog listában látszik a cím alatt</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Fő kép:</strong> A cikk borítóképe, ami a listában és a cikk tetején jelenik meg</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span><strong>Tartalom:</strong> Maga a cikk szövege a gazdag szövegszerkesztőben</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 2: Slug */}
          <section id="slug" className="space-y-4 scroll-mt-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#C89A63]/20 flex items-center justify-center">
                <Link2 className="h-5 w-5 text-[#C89A63]" />
              </div>
              <h2 className="text-2xl font-bold">2. Mi az a Slug?</h2>
            </div>
            <div className="pl-13 space-y-4 text-neutral-300">
              <p>
                A <strong className="text-[#C89A63]">slug</strong> a cikk URL-jének az a része, 
                ami a domain után jön. Például:
              </p>
              <div className="rounded-lg bg-neutral-900 border border-neutral-800 p-4 font-mono text-sm">
                <span className="text-neutral-500">matyiszendvics.hu/blog/</span>
                <span className="text-[#C89A63]">lazac-sutes-titkai</span>
              </div>
              <p>
                Ebben a példában a <code className="bg-neutral-800 px-1.5 py-0.5 rounded text-[#C89A63]">lazac-sutes-titkai</code> a slug.
              </p>
              
              <div className="rounded-lg bg-green-900/20 border border-green-800/50 p-4">
                <p className="font-medium text-green-400 mb-2">Jó hír!</p>
                <p className="text-sm">
                  A slug <strong>automatikusan generálódik</strong> a címből, amit beírsz. 
                  Nem kell vele foglalkoznod, de ha szeretnéd, módosíthatod.
                </p>
              </div>

              <div className="rounded-lg bg-amber-900/20 border border-amber-800/50 p-4">
                <p className="font-medium text-amber-400 mb-2">Fontos szabályok:</p>
                <ul className="space-y-1 text-sm">
                  <li>• Csak kisbetűk, számok és kötőjelek lehetnek benne</li>
                  <li>• Ékezetek helyett ékezet nélküli betűk (á → a, ő → o)</li>
                  <li>• Szóközök helyett kötőjel</li>
                  <li>• <strong>Egyedinek kell lennie</strong> - két cikknek nem lehet ugyanaz</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3: Categories */}
          <section id="kategoriak" className="space-y-4 scroll-mt-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#C89A63]/20 flex items-center justify-center">
                <Layers className="h-5 w-5 text-[#C89A63]" />
              </div>
              <h2 className="text-2xl font-bold">3. Kategóriák használata</h2>
            </div>
            <div className="pl-13 space-y-4 text-neutral-300">
              <p>
                A kategóriák a webshop termékkategóriáival egyeznek meg (pl. Lazac, Tonhal, Garnéla stb.).
              </p>
              
              <div className="rounded-lg bg-[#1B5E4B]/20 border border-[#1B5E4B]/50 p-4">
                <p className="font-medium text-[#1B5E4B] mb-2">Miért fontosak a kategóriák?</p>
                <p className="text-sm mb-3">
                  Ha kategóriát választasz egy cikkhez, a cikk végén <strong>automatikusan megjelenik 
                  egy zöld kártya</strong>, ami a termék kategóriára vezeti az olvasót!
                </p>
                <p className="text-sm">
                  Például: Ha a "Lazac" kategóriát választod, a cikk végén megjelenik egy 
                  "Fedezd fel a lazac kínálatunkat!" kártya, ami a lazac termékekhez visz.
                </p>
              </div>

              <div className="rounded-lg bg-neutral-900 border border-neutral-800 p-4">
                <p className="font-medium text-neutral-100 mb-2">Hogyan adj hozzá kategóriát:</p>
                <ol className="space-y-2 text-sm list-decimal list-inside">
                  <li>A szerkesztő jobb oldali sávjában keresd a "Kategóriák" részt</li>
                  <li>Kattints a kívánt kategória nevére (több is választható)</li>
                  <li>A kiválasztott kategóriák zöld színnel jelennek meg</li>
                  <li>Újra kattintva eltávolíthatod</li>
                </ol>
              </div>

              <div className="rounded-lg bg-amber-900/20 border border-amber-800/50 p-4">
                <p className="font-medium text-amber-400 mb-2">Tipp:</p>
                <p className="text-sm">
                  Válassz olyan kategóriát, ami <strong>valóban kapcsolódik</strong> a cikk témájához. 
                  Ha lazacról írsz, válaszd a Lazac kategóriát - így az olvasók könnyedén 
                  megvehetik a cikkben említett termékeket!
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: Editor */}
          <section id="szovegszerkeszto" className="space-y-4 scroll-mt-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#C89A63]/20 flex items-center justify-center">
                <Type className="h-5 w-5 text-[#C89A63]" />
              </div>
              <h2 className="text-2xl font-bold">4. A szövegszerkesztő használata</h2>
            </div>
            <div className="pl-13 space-y-4 text-neutral-300">
              <p>
                A szerkesztő hasonlóan működik, mint a Word vagy a Google Docs. 
                A felső eszköztáron találod a formázási opciókat.
              </p>
              
              <div className="rounded-lg bg-neutral-900 border border-neutral-800 p-4">
                <p className="font-medium text-neutral-100 mb-3">Eszköztár gombok (balról jobbra):</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-20 text-neutral-500">↩️ ↪️</span>
                    <span>Visszavonás / Újra</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-20 text-neutral-500">B I U S</span>
                    <span>Félkövér, Dőlt, Aláhúzott, Áthúzott</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-20 text-neutral-500">H1 H2 H3</span>
                    <span>Címsorok (nagy, közepes, kis)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-20 text-neutral-500">• 1.</span>
                    <span>Felsorolás / Számozott lista</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-20 text-neutral-500">≡ ≡ ≡</span>
                    <span>Balra / Középre / Jobbra igazítás</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-20 text-neutral-500">" —</span>
                    <span>Idézet / Elválasztó vonal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-20 text-neutral-500">🔗 🖼️</span>
                    <span>Hivatkozás / Kép beszúrása</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-20 text-neutral-500">🎨 ✏️</span>
                    <span>Szöveg szín / Kiemelés szín</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-20 text-neutral-500">💡 🎁</span>
                    <span>Tipp doboz / Promó doboz</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5: Pasting */}
          <section id="szoveg-beillesztes" className="space-y-4 scroll-mt-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#C89A63]/20 flex items-center justify-center">
                <FileText className="h-5 w-5 text-[#C89A63]" />
              </div>
              <h2 className="text-2xl font-bold">5. Szöveg beillesztése más forrásból</h2>
            </div>
            <div className="pl-13 space-y-4 text-neutral-300">
              <p>
                Ha Word-ből, Google Docs-ból vagy más szövegszerkesztőből másolsz be szöveget, 
                a formázás (félkövér, dőlt, címsorok stb.) <strong>megmarad</strong>.
              </p>
              
              <div className="rounded-lg bg-green-900/20 border border-green-800/50 p-4">
                <p className="font-medium text-green-400 mb-2">Így működik:</p>
                <ol className="space-y-1 text-sm list-decimal list-inside">
                  <li>Másold ki a szöveget a forrásból (Ctrl+C)</li>
                  <li>Kattints a szerkesztő mezőbe</li>
                  <li>Illeszd be (Ctrl+V)</li>
                  <li>A formázás automatikusan megmarad!</li>
                </ol>
              </div>

              <div className="rounded-lg bg-red-900/20 border border-red-800/50 p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-400 mb-2">NAGYON FONTOS!</p>
                    <p className="text-sm mb-2">
                      Ha Word-ből vagy más dokumentumból illesztesz be szöveget, 
                      <strong> ELLENŐRIZD, hogy nem maradtak-e benne RÉGI LINKEK!</strong>
                    </p>
                    <p className="text-sm">
                      A régi linkek rossz oldalakra vihetik a látogatókat. 
                      Lásd a "Hivatkozások" részt lentebb!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 6: Images */}
          <section id="kepek" className="space-y-4 scroll-mt-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#C89A63]/20 flex items-center justify-center">
                <Image className="h-5 w-5 text-[#C89A63]" />
              </div>
              <h2 className="text-2xl font-bold">6. Képek beszúrása</h2>
            </div>
            <div className="pl-13 space-y-4 text-neutral-300">
              
              <div className="rounded-lg bg-neutral-900 border border-neutral-800 p-4">
                <p className="font-medium text-neutral-100 mb-3">Kétféleképpen tudsz képet hozzáadni:</p>
                
                <div className="space-y-4">
                  <div>
                    <p className="font-medium text-[#C89A63] mb-1">A) Fő kép (borítókép):</p>
                    <p className="text-sm">
                      A jobb oldali sávban a "Fő kép" résznél kattints a "Kép feltöltése" gombra 
                      és válaszd ki a képet a gépedről. Ez a kép jelenik meg a blog listában és 
                      a cikk tetején.
                    </p>
                  </div>
                  
                  <div>
                    <p className="font-medium text-[#C89A63] mb-1">B) Képek a szövegben:</p>
                    <p className="text-sm">
                      A szerkesztő eszköztárán kattints a kép ikonra (🖼️). 
                      Válaszd ki a képet, és az beszúródik oda, ahol a kurzorod volt.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-green-900/20 border border-green-800/50 p-4">
                <p className="font-medium text-green-400 mb-2">Képek beillesztése másolással:</p>
                <p className="text-sm">
                  Ha képet másol be (Ctrl+V), az <strong>automatikusan feltöltődik</strong> a szerverre! 
                  Egy "Kép feltöltése..." felirat jelzi, amíg a feltöltés zajlik. 
                  Így nem kell aggódnod, hogy a kép eltűnik vagy lassú lesz.
                </p>
              </div>
            </div>
          </section>

          {/* Section 7: Formatting */}
          <section id="formazas" className="space-y-4 scroll-mt-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#C89A63]/20 flex items-center justify-center">
                <List className="h-5 w-5 text-[#C89A63]" />
              </div>
              <h2 className="text-2xl font-bold">7. Szöveg formázása</h2>
            </div>
            <div className="pl-13 space-y-4 text-neutral-300">
              
              <div className="rounded-lg bg-neutral-900 border border-neutral-800 p-4 space-y-4">
                <div>
                  <p className="font-medium text-neutral-100 mb-2">Címsorok (H1, H2, H3):</p>
                  <p className="text-sm mb-2">Jelöld ki a szöveget és kattints a megfelelő címsor gombra:</p>
                  <ul className="text-sm space-y-1">
                    <li><strong className="text-[#C89A63]">H1</strong> - Legnagyobb címsor (fő fejezet)</li>
                    <li><strong className="text-[#C89A63]">H2</strong> - Közepes címsor (alfejezet) - <span className="text-amber-400">Arany színnel jelenik meg!</span></li>
                    <li><strong className="text-[#C89A63]">H3</strong> - Kisebb címsor (al-alfejezet)</li>
                  </ul>
                </div>
                
                <div>
                  <p className="font-medium text-neutral-100 mb-2">Felsorolások:</p>
                  <p className="text-sm">
                    A • gomb felsorolást, az 1. gomb számozott listát készít. 
                    Enter-rel új elem, Enter kétszer kilép a listából.
                  </p>
                </div>

                <div>
                  <p className="font-medium text-neutral-100 mb-2">Speciális dobozok:</p>
                  <ul className="text-sm space-y-1">
                    <li><strong className="text-[#C89A63]">💡 Tipp doboz:</strong> Sárga hátterű kiemelés tippekhez, tanácsokhoz</li>
                    <li><strong className="text-[#C89A63]">🎁 Promó doboz:</strong> Arany hátterű kiemelés termékajánlókhoz</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Section 8: Colors */}
          <section id="szinek" className="space-y-4 scroll-mt-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#C89A63]/20 flex items-center justify-center">
                <Palette className="h-5 w-5 text-[#C89A63]" />
              </div>
              <h2 className="text-2xl font-bold">8. Színek használata</h2>
            </div>
            <div className="pl-13 space-y-4 text-neutral-300">
              <p>
                A szöveg színét és a kiemelés (háttér) színét is megváltoztathatod.
              </p>
              
              <div className="rounded-lg bg-neutral-900 border border-neutral-800 p-4 space-y-4">
                <div>
                  <p className="font-medium text-neutral-100 mb-2">🎨 Szöveg szín:</p>
                  <p className="text-sm">
                    Jelöld ki a szöveget, majd kattints a paletta ikonra. 
                    Válassz a színek közül. Az "Alapértelmezett" visszaállítja az eredeti színt.
                  </p>
                  <div className="flex gap-2 mt-2">
                    <span className="px-2 py-1 rounded text-sm" style={{color: '#C89A63'}}>Arany</span>
                    <span className="px-2 py-1 rounded text-sm" style={{color: '#1B5E4B'}}>Zöld</span>
                    <span className="px-2 py-1 rounded text-sm" style={{color: '#3B82F6'}}>Kék</span>
                    <span className="px-2 py-1 rounded text-sm" style={{color: '#EF4444'}}>Piros</span>
                  </div>
                </div>
                
                <div>
                  <p className="font-medium text-neutral-100 mb-2">✏️ Kiemelés szín (háttér):</p>
                  <p className="text-sm">
                    Jelöld ki a szöveget, majd kattints a szövegkiemelő ikonra. 
                    Ez a szöveg mögé tesz színes hátteret, mint egy szövegkiemelő filctoll.
                  </p>
                  <div className="flex gap-2 mt-2">
                    <span className="px-2 py-1 rounded text-sm text-neutral-900" style={{backgroundColor: '#FEF08A'}}>Sárga</span>
                    <span className="px-2 py-1 rounded text-sm text-neutral-900" style={{backgroundColor: '#BBF7D0'}}>Zöld</span>
                    <span className="px-2 py-1 rounded text-sm text-neutral-900" style={{backgroundColor: '#BFDBFE'}}>Kék</span>
                    <span className="px-2 py-1 rounded text-sm text-neutral-900" style={{backgroundColor: '#FBCFE8'}}>Rózsaszín</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 9: Links - IMPORTANT */}
          <section id="linkek" className="space-y-4 scroll-mt-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-red-400">9. Hivatkozások (NAGYON FONTOS!)</h2>
            </div>
            <div className="pl-13 space-y-4 text-neutral-300">
              
              <div className="rounded-lg bg-red-900/30 border-2 border-red-800 p-6">
                <p className="font-bold text-red-400 text-lg mb-3">
                  ⚠️ SOHA NE HAGYJ RÉGI LINKET A CIKKBEN!
                </p>
                <p className="mb-3">
                  Ha máshonnan illesztesz be szöveget, az eredeti linkek is bemásolódnak. 
                  Ezek <strong>rossz oldalakra vihetik a látogatókat</strong> - 
                  akár konkurens oldalakra is!
                </p>
                <p className="font-medium text-amber-400">
                  Mindig ellenőrizd és töröld a régi linkeket, vagy cseréld le 
                  a saját webshopod linkjeire!
                </p>
              </div>

              <div className="rounded-lg bg-neutral-900 border border-neutral-800 p-4 space-y-4">
                <div>
                  <p className="font-medium text-neutral-100 mb-2">Hogyan ismersz fel egy linket?</p>
                  <p className="text-sm">
                    A linkek <span className="text-[#1B5E4B] underline">zöld színnel és aláhúzással</span> jelennek meg 
                    a szerkesztőben. Ha rákattintasz egy linkre, megjelenik az URL.
                  </p>
                </div>
                
                <div>
                  <p className="font-medium text-neutral-100 mb-2">Link törlése:</p>
                  <ol className="text-sm space-y-1 list-decimal list-inside">
                    <li>Kattints a linkre a szerkesztőben</li>
                    <li>Jelöld ki a teljes linkes szöveget</li>
                    <li>Kattints a lánc ikonra (🔗)</li>
                    <li>Töröld ki az URL mezőt és nyomj Entert</li>
                  </ol>
                </div>

                <div>
                  <p className="font-medium text-neutral-100 mb-2">Új link hozzáadása:</p>
                  <ol className="text-sm space-y-1 list-decimal list-inside">
                    <li>Jelöld ki a szöveget, amit linkké akarsz tenni</li>
                    <li>Kattints a lánc ikonra (🔗)</li>
                    <li>Írd be az URL-t (pl. https://matyiszendvics.hu/kategoria/lazac)</li>
                    <li>Nyomj Entert</li>
                  </ol>
                </div>
              </div>

              <div className="rounded-lg bg-green-900/20 border border-green-800/50 p-4">
                <p className="font-medium text-green-400 mb-2">Hasznos linkek a webshopból:</p>
                <ul className="text-sm space-y-1 font-mono">
                  <li>• Főoldal: <span className="text-[#C89A63]">https://matyiszendvics.hu</span></li>
                  <li>• Kategória: <span className="text-[#C89A63]">https://matyiszendvics.hu/kategoria/[kategoria-neve]</span></li>
                  <li>• Termék: <span className="text-[#C89A63]">https://matyiszendvics.hu/termek/[termek-neve]</span></li>
                  <li>• Blog: <span className="text-[#C89A63]">https://matyiszendvics.hu/blog</span></li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 10: Publishing */}
          <section id="publikalas" className="space-y-4 scroll-mt-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#C89A63]/20 flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-[#C89A63]" />
              </div>
              <h2 className="text-2xl font-bold">10. Publikálás</h2>
            </div>
            <div className="pl-13 space-y-4 text-neutral-300">
              <p>
                A cikk alapból <strong>piszkozat</strong> állapotban van, 
                ami azt jelenti, hogy csak te látod, a látogatók nem.
              </p>
              
              <div className="rounded-lg bg-neutral-900 border border-neutral-800 p-4 space-y-3">
                <div>
                  <p className="font-medium text-neutral-100 mb-2">Publikálás lépései:</p>
                  <ol className="text-sm space-y-1 list-decimal list-inside">
                    <li>Ellenőrizd a cikket (szöveg, képek, linkek!)</li>
                    <li>A fejlécben pipáld be a <strong className="text-[#C89A63]">"Publikus"</strong> jelölőnégyzetet</li>
                    <li>Kattints a <strong className="text-[#C89A63]">"Cikk mentése"</strong> gombra</li>
                    <li>Kész! A cikk mostantól mindenki számára látható</li>
                  </ol>
                </div>
              </div>

              <div className="rounded-lg bg-amber-900/20 border border-amber-800/50 p-4">
                <p className="font-medium text-amber-400 mb-2">Tipp:</p>
                <p className="text-sm">
                  Az "Előnézet" gombbal megnézheted, hogyan fog kinézni a cikk a weboldalon, 
                  mielőtt publikálod. Ez csak szerkesztéskor látszik (meglévő cikknél).
                </p>
              </div>
            </div>
          </section>

          {/* Final checklist */}
          <section className="rounded-xl border-2 border-[#C89A63] bg-[#C89A63]/10 p-6 space-y-4">
            <h2 className="text-xl font-bold text-[#C89A63]">Ellenőrző lista publikálás előtt</h2>
            <ul className="space-y-2">
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded border-2 border-[#C89A63]"></div>
                <span>Van cím és alcím?</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded border-2 border-[#C89A63]"></div>
                <span>Feltöltöttem borítóképet?</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded border-2 border-[#C89A63]"></div>
                <span>Választottam kategóriát?</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded border-2 border-[#C89A63]"></div>
                <span className="font-bold text-red-400">ELLENŐRIZTEM ÉS TÖRÖLTEM A RÉGI LINKEKET?</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded border-2 border-[#C89A63]"></div>
                <span>Jól néznek ki a címsorok és formázás?</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-5 h-5 rounded border-2 border-[#C89A63]"></div>
                <span>Megnéztem az előnézetet?</span>
              </li>
            </ul>
          </section>

          {/* Back button */}
          <div className="pt-8 border-t border-neutral-800">
            <Link
              href="/matyi/blog"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#C89A63] text-black font-semibold rounded-lg hover:bg-[#b8864f] transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Vissza a blog kezeléshez
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
}
