declare module "szamlazz.js" {
  interface CurrencyObj {
    value: string;
    roundPriceExp: number;
    comment: string;
  }

  interface LanguageObj {
    value: string;
    name: string;
  }

  interface PaymentMethodObj {
    value: string;
    comment: string;
  }

  export const Currencies: {
    Ft: CurrencyObj;
    HUF: CurrencyObj;
    EUR: CurrencyObj;
  };

  export const Languages: {
    Hungarian: LanguageObj;
    English: LanguageObj;
    German: LanguageObj;
  };

  export const PaymentMethods: {
    Cash: PaymentMethodObj;
    BankTransfer: PaymentMethodObj;
    CreditCard: PaymentMethodObj;
    PayPal: PaymentMethodObj;
  };

  export class Client {
    constructor(options: {
      authToken: string;
      eInvoice?: boolean;
      requestInvoiceDownload?: boolean;
      downloadedInvoiceCount?: number;
      responseVersion?: number;
    });
    issueInvoice(invoice: Invoice): Promise<{
      invoiceId: string;
      netTotal: string;
      grossTotal: string;
      pdf?: Buffer;
    }>;
  }

  export class Seller {
    constructor(options: {
      bank?: {
        name: string;
        accountNumber: string;
      };
      email?: {
        replyToAddress: string;
        subject: string;
        message: string;
      };
      issuerName?: string;
    });
  }

  export class Buyer {
    constructor(options: {
      name: string;
      country?: string;
      zip: string;
      city: string;
      address: string;
      taxNumber?: string;
      email?: string;
      sendEmail?: boolean;
      phone?: string;
      comment?: string;
    });
  }

  export class Item {
    constructor(options: {
      label: string;
      quantity: number;
      unit: string;
      vat: number | string;
      grossUnitPrice?: number;
      netUnitPrice?: number;
      comment?: string;
    });
  }

  export class Invoice {
    constructor(options: {
      paymentMethod: PaymentMethodObj;
      currency: CurrencyObj;
      language: LanguageObj;
      seller: Seller;
      buyer: Buyer;
      items: Item[];
      paid?: boolean;
      comment?: string;
    });
  }
}
