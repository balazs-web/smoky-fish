// About Products Section Configuration

export interface IconItem {
  id: string;
  icon: string;
  title: string;
  description: string;
  imageUrl?: string;
}

export interface ProcessStep {
  id: string;
  number: number;
  title: string;
  description: string;
  imageUrl: string;
}

export interface AboutProductsConfig {
  // Section 1: Hero intro
  hero: {
    title: string;
    subtitle: string;
    description: string;
    imageUrl: string;
  };
  
  // Section 2: Natural product
  naturalProduct: {
    title: string;
    description: string;
    imageUrl: string;
    features: IconItem[];
  };
  
  // Section 3: Cold smoking
  coldSmoking: {
    title: string;
    shortDescription: string;
    longDescription: string;
    imageUrl: string;
  };
  
  // Section 4: Smoking process
  smokingProcess: {
    title: string;
    subtitle: string;
    steps: ProcessStep[];
  };
  
  // Section 5: Quality standards
  qualityStandards: {
    title: string;
    items: IconItem[];
  };
  
  // Section 6: Premium packaging
  premiumPackaging: {
    title: string;
    description: string;
    images: string[];
  };
}

export const defaultAboutProductsConfig: AboutProductsConfig = {
  hero: {
    title: 'Hideg Füstölésű Halak',
    subtitle: 'Északi Tradíció',
    description: 'Prémium minőségű, hagyományos eljárással készült füstölt halak. Természetes alapanyagok, gondos feldolgozás, kivételes íz.',
    imageUrl: '',
  },
  
  naturalProduct: {
    title: '100% Természetes Termék',
    description: 'Termékeink kizárólag természetes alapanyagokból készülnek, mesterséges adalékanyagok nélkül. A friss halakat gondosan válogatjuk, hogy csak a legjobb minőség kerüljön az asztalára.',
    imageUrl: '',
    features: [
      {
        id: 'omega3',
        icon: 'fish',
        title: 'Omega-3',
        description: 'Gazdag omega-3 zsírsavakban',
      },
      {
        id: 'protein',
        icon: 'beef',
        title: 'Protein',
        description: 'Magas fehérjetartalom',
      },
      {
        id: 'vitamin',
        icon: 'sun',
        title: 'D-vitamin',
        description: 'Természetes D-vitamin forrás',
      },
      {
        id: 'natural',
        icon: 'leaf',
        title: '0%',
        description: 'Adalékanyag és tartósítószer mentes',
      },
    ],
  },
  
  coldSmoking: {
    title: 'Hideg Bükkfa Füstölés',
    shortDescription: 'Az ősi skandináv hagyományokat követve, bükkfa füsttel, alacsony hőmérsékleten füstöljük halainkat.',
    longDescription: 'A hideg füstölés egy évszázados technika, amely 25°C alatti hőmérsékleten történik. Ez a módszer megőrzi a hal természetes ízét, tápanyagtartalmát és puha textúráját. A bükkfa füstje egyedülálló, enyhén édes aromát kölcsönöz a halnak, ami tökéletesen harmonizál a tengeri ízekkel. A folyamat 24-48 órán át tart, biztosítva a tökéletes íz kialakulását.',
    imageUrl: '',
  },
  
  smokingProcess: {
    title: 'Füstölési Folyamat',
    subtitle: 'A hagyományos skandináv füstölés lépései',
    steps: [
      {
        id: 'step1',
        number: 1,
        title: 'Válogatás',
        description: 'Csak a legfrissebb, prémium minőségű halakat választjuk ki. Minden hal átesik szigorú minőségellenőrzésen.',
        imageUrl: '',
      },
      {
        id: 'step2',
        number: 2,
        title: 'Sózás',
        description: 'Hagyományos száraz sózási technikával készítjük elő a halakat, tengeri sóval és fűszerekkel.',
        imageUrl: '',
      },
      {
        id: 'step3',
        number: 3,
        title: 'Szárítás',
        description: 'A sózás után a halak kontrollált körülmények között szárulnak, hogy a füst egyenletesen áthatoljon.',
        imageUrl: '',
      },
      {
        id: 'step4',
        number: 4,
        title: 'Hideg Füstölés',
        description: 'A 25°C alatti hőmérsékletű bükkfa füstben 24-48 órán át füstölődnek a halak.',
        imageUrl: '',
      },
      {
        id: 'step5',
        number: 5,
        title: 'Érlelés',
        description: 'A füstölés után az érlelési folyamat során alakul ki a jellegzetes, gazdag íz.',
        imageUrl: '',
      },
    ],
  },
  
  qualityStandards: {
    title: 'Minőségi Elvárásaink',
    items: [
      {
        id: 'q1',
        icon: 'shield',
        title: 'Élelmiszerbiztonsság',
        description: 'HACCP minősített gyártási folyamat',
        imageUrl: '',
      },
      {
        id: 'q2',
        icon: 'fish',
        title: 'Fenntartható halászat',
        description: 'MSC tanúsított halállományból',
        imageUrl: '',
      },
      {
        id: 'q3',
        icon: 'thermometer',
        title: 'Hűtőlánc',
        description: 'Megszakítás nélküli hűtőlánc',
        imageUrl: '',
      },
      {
        id: 'q4',
        icon: 'award',
        title: 'Kiváló Termelő',
        description: 'Magyar termék, kiváló minőség',
        imageUrl: '',
      },
    ],
  },
  
  premiumPackaging: {
    title: 'Prémium Csomagolás',
    description: 'Termékeink vákuumcsomagolásban érkeznek, megőrizve a frissességet és az ízt. A csomagolás környezetbarát anyagokból készül.',
    images: ['', '', '', ''],
  },
};
