export interface UnitType {
  id: string;
  bedroomType: string;
  rooms?: number | string;
  area: number;
  gardenArea?: number;
  roofArea?: number;
  price: number;
  finishing: 'core_shell' | 'semi' | 'full' | string;
}

export interface CustomBullet {
  id: string;
  type: 'annual' | 'delivery' | 'after_3m' | 'after_6m' | 'after_9m' | 'deferred';
  percent: number;
  selectedYears?: number[];
}

export interface PaymentPlan {
  id: string;
  name: string;
  discountPercent?: number;
  downPaymentPercent: number;
  years: number;
  frequency?: string;
  pricePerMeter?: number;
  notes?: string;
  customBullets?: CustomBullet[];
}

export interface MinisterialDecree {
  id: string;
  decreeNumber?: string;
  description: string;
  date?: string;
}

export interface CommercialPrices {
  adminMin?: number;
  adminMax?: number;
  adminFinish?: string;
  commMin?: number;
  commMax?: number;
  commFinish?: string;
  clinicMin?: number;
  clinicMax?: number;
  clinicFinish?: string;
  recMin?: number;
  recMax?: number;
  recFinish?: string;
}

export interface Compound {
  id: string;
  locationId: string;
  locationName?: string;
  projectType: 'residential' | 'commercial' | 'hotel' | string;
  companyName: string;
  projectName: string;
  phaseName?: string;
  ownerName?: string;
  consultant?: string;
  contactName?: string;
  whatsapp?: string;
  projectPDF?: string;
  previousWorks?: string;
  projectSize?: number; // acres/feddans
  floors?: string;
  compoundLocationDetail?: string;
  locationLink?: string;
  pricePerMeter?: number;
  pricePerMeterMin?: number;
  pricePerMeterMax?: number;
  isAdvancedPricing?: boolean;
  priceCore?: number;
  priceCoreMin?: number;
  priceCoreMax?: number;
  priceSemi?: number;
  priceSemiMin?: number;
  priceSemiMax?: number;
  priceFull?: number;
  priceFullMin?: number;
  priceFullMax?: number;
  commercialPrices?: CommercialPrices;
  deliveryDate?: string;
  finishingStatus?: 'core_shell' | 'semi' | 'full' | 'mixed' | string;
  maintenanceValue?: number;
  maintenanceType?: 'percent' | 'per_meter';
  parkingType?: 'extra' | 'optional' | 'included';
  parkingFee?: number;
  cashDiscount?: number;
  unitTypes: UnitType[];
  paymentPlans: PaymentPlan[];
  ministerialDecrees?: MinisterialDecree[];
  isFeatured?: boolean;
  bookmarked?: boolean;
  badge?: string;
}

export interface SubLocation {
  id: string;
  name: string;
  nameEn?: string;
}

export interface MainLocation {
  id: string;
  name: string;
  nameEn?: string;
  subLocations: SubLocation[];
}

export type Currency = 'EGP' | 'USD';
export type Language = 'ar' | 'en';

export interface FilterState {
  searchText: string;
  projectType: 'all' | 'residential' | 'commercial' | 'hotel';
  propertyTypes: string[];
  bedrooms: string[];
  delivery: string[];
  finishing: string[];
  minPrice: number | null;
  maxPrice: number | null;
  minPricePerMeter: number | null;
  maxPricePerMeter: number | null;
  maxDownPayment: number | null;
  maxMonthlyInstallment: number | null;
  durationYears: number | null;
  sortOrder: 'default' | 'lowest_monthly' | 'lowest_deposit' | 'price_asc' | 'price_desc';
  selectedLocationId: string | null;
}
