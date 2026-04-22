export const COUNTRY_CONFIG = {
  UAE: { currency: 'AED', locale: 'ar-AE' },
  KSA: { currency: 'SAR', locale: 'ar-SA' },
  INDIA: { currency: 'INR', locale: 'en-IN' }
} as const;

export type CountryKey = keyof typeof COUNTRY_CONFIG;
