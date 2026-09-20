import { Compound, MainLocation } from '../types';

export const initialLocations: MainLocation[] = [
  {
    id: 'loc_hadayek_october',
    name: 'حدائق أكتوبر (Hadayek October)',
    nameEn: 'Hadayek October',
    subLocations: [
      { id: 'sub_clubs_area', name: 'منطقة النوادي (Club Area)', nameEn: 'Club Area' },
      { id: 'sub_wahat_road', name: 'طريق الواحات (Oasis Road)', nameEn: 'Oasis Road' },
      { id: 'sub_investors_october', name: 'منطقة المستثمرين (Investors Area)', nameEn: 'Investors Area' },
      { id: 'sub_rabia', name: 'منطقة الرابية (Al-Rabia)', nameEn: 'Al-Rabia' },
      { id: 'sub_degla_palms', name: 'دجلة بالمز (Degla Palms)', nameEn: 'Degla Palms' },
      { id: 'sub_italy_sq', name: 'الميدان الإيطالي (Italian Square)', nameEn: 'Italian Square' }
    ]
  },
  {
    id: 'loc_new_cairo',
    name: 'القاهرة الجديدة (New Cairo)',
    nameEn: 'New Cairo',
    subLocations: [
      { id: 'sub_golden_square', name: 'المربع الذهبي (Golden Square)', nameEn: 'Golden Square' },
      { id: 'sub_5th_settlement', name: 'التجمع الخامس (5th Settlement)', nameEn: '5th Settlement' },
      { id: 'sub_beit_al_watan', name: 'بيت الوطن (Beit Al Watan)', nameEn: 'Beit Al Watan' },
      { id: 'sub_mostakbal_city', name: 'مدينة المستقبل (Mostakbal City)', nameEn: 'Mostakbal City' }
    ]
  },
  {
    id: 'loc_west_cairo',
    name: '6 أكتوبر والشيخ زايد (West Cairo)',
    nameEn: 'West Cairo',
    subLocations: [
      { id: 'sub_zayed', name: 'الشيخ زايد (Sheikh Zayed)', nameEn: 'Sheikh Zayed' },
      { id: 'sub_new_zayed', name: 'زايد الجديدة (New Zayed)', nameEn: 'New Zayed' },
      { id: 'sub_october', name: '6 أكتوبر (6th of October)', nameEn: '6th of October' }
    ]
  },
  {
    id: 'loc_new_capital',
    name: 'العاصمة الإدارية (New Capital)',
    nameEn: 'New Administrative Capital',
    subLocations: [
      { id: 'sub_cbd', name: 'منطقة الأعمال المركزية (CBD)', nameEn: 'CBD' },
      { id: 'sub_downtown', name: 'الداون تاون (Downtown)', nameEn: 'Downtown' },
      { id: 'sub_r7', name: 'الحي السكني R7', nameEn: 'R7 District' }
    ]
  },
  {
    id: 'loc_north_coast',
    name: 'الساحل الشمالي (North Coast)',
    nameEn: 'North Coast',
    subLocations: [
      { id: 'sub_ras_el_hekma', name: 'رأس الحكمة (Ras El Hekma)', nameEn: 'Ras El Hekma' },
      { id: 'sub_sidi_abdelrahman', name: 'سيدي عبد الرحمن (Sidi Abdel Rahman)', nameEn: 'Sidi Abdel Rahman' }
    ]
  }
];

export const initialCompounds: Compound[] = [
  {
    id: 'comp_kenz_october',
    locationId: 'sub_clubs_area',
    locationName: 'حدائق أكتوبر - منطقة النوادي (Club Area)',
    projectType: 'residential',
    companyName: 'فيرست جروب للتطوير العقاري | First Group',
    projectName: 'كمبوند كنز حدائق أكتوبر (Kenz Hadayek October)',
    phaseName: 'Phase 3 - Luxury Living',
    ownerName: 'المهندس بشير مصطفى',
    consultant: 'ECG Engineering Consultants Group',
    contactName: 'مبيعات كنز حدائق أكتوبر',
    whatsapp: '201011223344',
    projectPDF: 'https://example.com/kenz-brochure.pdf',
    projectSize: 30,
    floors: 'G + 4 Floors',
    compoundLocationDetail: 'طريق الواحات مباشرة أمام حي الأشجار بجوار نادي الزمالك ونادي الشرطة',
    locationLink: 'https://maps.google.com/?q=Kenz+Compound+October',
    pricePerMeterMin: 32000,
    pricePerMeterMax: 42000,
    pricePerMeter: 36000,
    deliveryDate: 'immediate',
    finishingStatus: 'semi',
    maintenanceValue: 7,
    maintenanceType: 'percent',
    parkingType: 'included',
    cashDiscount: 25,
    isFeatured: true,
    badge: 'استلام فوري',
    unitTypes: [
      { id: 'kenz_1b_85', bedroomType: '1 Bedroom (غرفة واحدة)', rooms: 1, area: 85, gardenArea: 0, roofArea: 0, price: 3060000, finishing: 'semi' },
      { id: 'kenz_1b_105', bedroomType: '1 Bedroom (غرفة واحدة)', rooms: 1, area: 105, gardenArea: 40, roofArea: 0, price: 3780000, finishing: 'semi' },
      { id: 'kenz_2b_125', bedroomType: '2 Bedrooms (غرفتين نوم)', rooms: 2, area: 125, gardenArea: 0, roofArea: 0, price: 4500000, finishing: 'semi' },
      { id: 'kenz_2b_140', bedroomType: '2 Bedrooms (غرفتين نوم)', rooms: 2, area: 140, gardenArea: 50, roofArea: 0, price: 5040000, finishing: 'semi' },
      { id: 'kenz_3b_170', bedroomType: '3 Bedrooms (3 غرف نوم)', rooms: 3, area: 170, gardenArea: 0, roofArea: 0, price: 6120000, finishing: 'semi' },
      { id: 'kenz_3b_195', bedroomType: '3 Bedrooms (3 غرف نوم)', rooms: 3, area: 195, gardenArea: 65, roofArea: 0, price: 7020000, finishing: 'semi' },
      { id: 'kenz_dup_245', bedroomType: 'دوبلكس (Duplex)', rooms: 4, area: 245, gardenArea: 80, roofArea: 0, price: 8820000, finishing: 'semi' }
    ],
    paymentPlans: [
      {
        id: 'plan_kenz_1',
        name: 'استلام فوري (15% مقدم - 6 سنوات)',
        discountPercent: 0,
        downPaymentPercent: 15,
        years: 6,
        notes: '15% تعاقد واستلام فوري وأقساط متساوية على 6 سنوات'
      },
      {
        id: 'plan_kenz_2',
        name: 'عرض 8 سنوات (10% مقدم)',
        discountPercent: 0,
        downPaymentPercent: 10,
        years: 8,
        notes: '10% مقدم + 5% بعد سنة وأقساط على 8 سنوات'
      },
      {
        id: 'plan_kenz_cash',
        name: 'الدفع الكاش (خصم 25%)',
        discountPercent: 25,
        downPaymentPercent: 100,
        years: 1,
        notes: 'خصم فوري 25% من إجمالي السعر'
      }
    ]
  },
  {
    id: 'comp_sun_capital',
    locationId: 'sub_wahat_road',
    locationName: 'حدائق أكتوبر - طريق الواحات (Oasis Road)',
    projectType: 'residential',
    companyName: 'عربية القابضة | Arabia Holding',
    projectName: 'صن كابيتال حدائق أكتوبر (Sun Capital)',
    phaseName: 'The Fairways',
    ownerName: 'المهندس طارق شكري',
    consultant: 'CallisonRTKL Architects',
    contactName: 'مبيعات صن كابيتال',
    whatsapp: '201022334455',
    projectPDF: 'https://example.com/sun-capital.pdf',
    projectSize: 557,
    floors: 'G + 5 & Townhouses',
    compoundLocationDetail: 'مدخل الأهرامات الجديد، مباشرة على طريق الواحات والفيوم بجوار حديقة الحيوان الجديدة',
    locationLink: 'https://maps.google.com/?q=Sun+Capital+October',
    pricePerMeterMin: 45000,
    pricePerMeterMax: 60000,
    pricePerMeter: 52000,
    deliveryDate: '1y',
    finishingStatus: 'full',
    maintenanceValue: 8,
    maintenanceType: 'percent',
    parkingType: 'included',
    cashDiscount: 20,
    isFeatured: true,
    badge: 'مدينة الشمس',
    unitTypes: [
      { id: 'sun_1b_68', bedroomType: '1 Bedroom (غرفة واحدة)', rooms: 1, area: 68, gardenArea: 0, roofArea: 0, price: 3536000, finishing: 'full' },
      { id: 'sun_1b_88', bedroomType: '1 Bedroom (غرفة واحدة)', rooms: 1, area: 88, gardenArea: 35, roofArea: 0, price: 4576000, finishing: 'full' },
      { id: 'sun_2b_118', bedroomType: '2 Bedrooms (غرفتين نوم)', rooms: 2, area: 118, gardenArea: 0, roofArea: 0, price: 6136000, finishing: 'full' },
      { id: 'sun_2b_132', bedroomType: '2 Bedrooms (غرفتين نوم)', rooms: 2, area: 132, gardenArea: 45, roofArea: 0, price: 6864000, finishing: 'full' },
      { id: 'sun_3b_155', bedroomType: '3 Bedrooms (3 غرف نوم)', rooms: 3, area: 155, gardenArea: 0, roofArea: 0, price: 8060000, finishing: 'full' },
      { id: 'sun_3b_180', bedroomType: '3 Bedrooms (3 غرف نوم)', rooms: 3, area: 180, gardenArea: 55, roofArea: 0, price: 9360000, finishing: 'full' },
      { id: 'sun_town_210', bedroomType: 'تاون هاوس (Townhouse)', rooms: 4, area: 210, gardenArea: 90, roofArea: 40, price: 13800000, finishing: 'full' }
    ],
    paymentPlans: [
      {
        id: 'plan_sun_1',
        name: 'خطة 10 سنوات (10% مقدم)',
        discountPercent: 0,
        downPaymentPercent: 10,
        years: 10,
        notes: '10% مقدم وأقساط متساوية على 10 سنوات بدون فوائد'
      },
      {
        id: 'plan_sun_2',
        name: 'خطة 7 سنوات (5% مقدم)',
        discountPercent: 5,
        downPaymentPercent: 5,
        years: 7,
        notes: '5% مقدم وتقسيط 7 سنوات مع خصم 5%'
      }
    ]
  },
  {
    id: 'comp_hyde_park',
    locationId: 'sub_golden_square',
    locationName: 'المربع الذهبي (Golden Square)',
    projectType: 'residential',
    companyName: 'هايد بارك للتطوير العقاري | Hyde Park',
    projectName: 'هايد بارك التجمع (Hyde Park New Cairo)',
    phaseName: 'Grand Residences',
    ownerName: 'بنك الإسكان والتعمير & البنك الأهلي',
    consultant: 'Mimar Architecture & Engineering',
    contactName: 'إدارة المبيعات - هايد بارك',
    whatsapp: '201012345678',
    projectPDF: 'https://example.com/hyde-park-brochure.pdf',
    previousWorks: 'https://example.com/hyde-park-portfolio',
    projectSize: 1500,
    floors: 'G + 4 / Villas',
    compoundLocationDetail: 'شارع التسعين الجنوبي مباشرة، المربع الذهبي، بالقرب من الجامعة الأمريكية',
    locationLink: 'https://maps.google.com/?q=Hyde+Park+New+Cairo',
    pricePerMeterMin: 68000,
    pricePerMeterMax: 82000,
    pricePerMeter: 74000,
    deliveryDate: '2y',
    finishingStatus: 'semi',
    maintenanceValue: 8,
    maintenanceType: 'percent',
    parkingType: 'included',
    cashDiscount: 22,
    isFeatured: true,
    badge: 'الأكثر طلباً',
    unitTypes: [
      { id: 'hp_u1', bedroomType: 'شقة (Apartment)', rooms: 2, area: 135, gardenArea: 0, roofArea: 0, price: 9180000, finishing: 'semi' },
      { id: 'hp_u2', bedroomType: 'شقة (Apartment)', rooms: 3, area: 185, gardenArea: 0, roofArea: 0, price: 12580000, finishing: 'semi' },
      { id: 'hp_u3', bedroomType: 'تاون هاوس (Townhouse)', rooms: 4, area: 240, gardenArea: 75, roofArea: 40, price: 18200000, finishing: 'core_shell' },
      { id: 'hp_u4', bedroomType: 'دوبلكس (Duplex)', rooms: 4, area: 275, gardenArea: 60, roofArea: 0, price: 19800000, finishing: 'full' },
      { id: 'hp_u5', bedroomType: 'فيلا مستقلة (Villa)', rooms: 5, area: 380, gardenArea: 250, roofArea: 80, price: 32000000, finishing: 'core_shell' }
    ],
    paymentPlans: [
      {
        id: 'plan_hp_1',
        name: 'خطة 8 سنوات (5% مقدم)',
        discountPercent: 0,
        downPaymentPercent: 5,
        years: 8,
        notes: '5% مقدم + أقساط متساوية على 8 سنوات بدون فوائد',
        customBullets: [
          { id: 'b_hp_1', type: 'after_3m', percent: 5 }
        ]
      },
      {
        id: 'plan_hp_2',
        name: 'خطة 10 سنوات (10% مقدم)',
        discountPercent: 0,
        downPaymentPercent: 10,
        years: 10,
        notes: '10% مقدم + 5% بعد سنة + أقساط مريحة على 10 سنوات',
        customBullets: [
          { id: 'b_hp_2', type: 'annual', percent: 5, selectedYears: [1, 2] }
        ]
      },
      {
        id: 'plan_hp_cash',
        name: 'الدفع الكاش (خصم 22%)',
        discountPercent: 22,
        downPaymentPercent: 100,
        years: 1,
        notes: 'خصم فوري 22% عند الدفع كاش'
      }
    ]
  },
  {
    id: 'comp_badya_palm_hills',
    locationId: 'sub_october',
    locationName: '6 أكتوبر (6th of October)',
    projectType: 'residential',
    companyName: 'بالم هيلز للتعمير | Palm Hills Developments',
    projectName: 'بادية بالم هيلز (Badya Palm Hills)',
    phaseName: 'The Palm Enclave',
    ownerName: 'ياسين منصور - مجموعة المنصور',
    consultant: 'AS+P Albert Speer + Partner',
    contactName: 'مبيعات بالم هيلز',
    whatsapp: '201099887766',
    projectPDF: 'https://example.com/badya-brochure.pdf',
    previousWorks: 'https://example.com/palm-hills-projects',
    projectSize: 3000,
    floors: 'G + 3 & Standalone',
    compoundLocationDetail: 'طريق الواحات، امتداد 6 أكتوبر بالقرب من الأهرامات ومطار سفنكس',
    locationLink: 'https://maps.google.com/?q=Badya+Palm+Hills',
    pricePerMeterMin: 65000,
    pricePerMeterMax: 78000,
    pricePerMeter: 71000,
    deliveryDate: '1y',
    finishingStatus: 'full',
    maintenanceValue: 7.5,
    maintenanceType: 'percent',
    parkingType: 'optional',
    parkingFee: 250000,
    cashDiscount: 20,
    isFeatured: true,
    badge: 'تسليم قريب',
    unitTypes: [
      { id: 'bd_u1', bedroomType: 'شقة (Apartment)', rooms: 1, area: 85, gardenArea: 0, roofArea: 0, price: 6200000, finishing: 'full' },
      { id: 'bd_u2', bedroomType: 'شقة (Apartment)', rooms: 2, area: 125, gardenArea: 0, roofArea: 0, price: 8875000, finishing: 'full' },
      { id: 'bd_u3', bedroomType: 'شقة (Apartment)', rooms: 3, area: 165, gardenArea: 0, roofArea: 0, price: 11715000, finishing: 'full' },
      { id: 'bd_u4', bedroomType: 'توين هاوس (Twinhouse)', rooms: 4, area: 230, gardenArea: 90, roofArea: 35, price: 17500000, finishing: 'full' },
      { id: 'bd_u5', bedroomType: 'فيلا مستقلة (Villa)', rooms: 5, area: 310, gardenArea: 180, roofArea: 50, price: 24900000, finishing: 'full' }
    ],
    paymentPlans: [
      {
        id: 'plan_bd_1',
        name: 'عرض بادية 10 سنوات (0% مقدم)',
        discountPercent: 0,
        downPaymentPercent: 0,
        years: 10,
        notes: 'بدون أي مقدم وأقساط متساوية على 10 سنوات كاملة',
        customBullets: []
      },
      {
        id: 'plan_bd_2',
        name: '5% مقدم وتقسيط 8 سنوات',
        discountPercent: 5,
        downPaymentPercent: 5,
        years: 8,
        notes: '5% خصم إضافي مع 5% مقدم وأقساط على 8 سنوات'
      }
    ]
  },
  {
    id: 'comp_solana_ora',
    locationId: 'sub_new_zayed',
    locationName: 'زايد الجديدة (New Zayed)',
    projectType: 'residential',
    companyName: 'أورا ديفلوبرز | Ora Developers',
    projectName: 'سولانا زايد الجديدة (Solana New Zayed)',
    phaseName: 'Phase 1 - Valley',
    ownerName: 'م. نجيب ساويرس',
    consultant: 'SB Architects (San Francisco)',
    contactName: 'فريق مبيعات أورا',
    whatsapp: '201055554444',
    projectPDF: 'https://example.com/solana-brochure.pdf',
    projectSize: 316,
    floors: 'فيلات وتوين وتاون هاوس فقط',
    compoundLocationDetail: 'زايد الجديدة مباشرة على طريق الضبعة بجوار الدائري الأوسطي',
    locationLink: 'https://maps.google.com/?q=Solana+New+Zayed',
    pricePerMeterMin: 85000,
    pricePerMeterMax: 110000,
    pricePerMeter: 95000,
    deliveryDate: '3y',
    finishingStatus: 'full',
    maintenanceValue: 8,
    maintenanceType: 'percent',
    parkingType: 'included',
    cashDiscount: 18,
    isFeatured: true,
    badge: 'فاخر بالكامل',
    unitTypes: [
      { id: 'sol_u1', bedroomType: 'تاون هاوس (Townhouse)', rooms: 3, area: 210, gardenArea: 60, roofArea: 30, price: 19950000, finishing: 'full' },
      { id: 'sol_u2', bedroomType: 'توين هاوس (Twinhouse)', rooms: 4, area: 260, gardenArea: 100, roofArea: 40, price: 25400000, finishing: 'full' },
      { id: 'sol_u3', bedroomType: 'فيلا مستقلة (Villa)', rooms: 5, area: 385, gardenArea: 220, roofArea: 70, price: 38500000, finishing: 'full' }
    ],
    paymentPlans: [
      {
        id: 'plan_sol_1',
        name: '5% مقدم وتقسيط 8 سنوات',
        discountPercent: 0,
        downPaymentPercent: 5,
        years: 8,
        notes: '5% مقدم + 5% بعد 3 شهور + أقساط متساوية على 8 سنوات',
        customBullets: [
          { id: 'b_sol_1', type: 'after_3m', percent: 5 }
        ]
      }
    ]
  },
  {
    id: 'comp_eastshire',
    locationId: 'sub_5th_settlement',
    locationName: 'التجمع الخامس (5th Settlement)',
    projectType: 'residential',
    companyName: 'القمزي العقارية | Al Qamzi Developments',
    projectName: 'إيست شاير التجمع (Eastshire New Cairo)',
    phaseName: 'Signature Boutique',
    ownerName: 'مجموعة القمزي الإماراتية',
    consultant: 'Raef Fahmy Architects',
    contactName: 'مبيعات القمزي',
    whatsapp: '201011112222',
    projectSize: 26,
    floors: 'G + 2 (تاون وفيلا فقط)',
    compoundLocationDetail: 'التجمع الخامس، بالقرب من شارع التسعين الشمالي ودوان تاون مول',
    locationLink: 'https://maps.google.com/?q=Eastshire+New+Cairo',
    pricePerMeterMin: 72000,
    pricePerMeterMax: 88000,
    pricePerMeter: 80000,
    deliveryDate: 'immediate',
    finishingStatus: 'semi',
    maintenanceValue: 7,
    maintenanceType: 'percent',
    parkingType: 'included',
    cashDiscount: 25,
    badge: 'استلام فوري RTM',
    unitTypes: [
      { id: 'es_u1', bedroomType: 'تاون هاوس (Townhouse)', rooms: 3, area: 165, gardenArea: 50, roofArea: 30, price: 13200000, finishing: 'semi' },
      { id: 'es_u2', bedroomType: 'توين هاوس (Twinhouse)', rooms: 4, area: 245, gardenArea: 80, roofArea: 40, price: 19600000, finishing: 'semi' },
      { id: 'es_u3', bedroomType: 'فيلا مستقلة (Villa)', rooms: 5, area: 335, gardenArea: 160, roofArea: 60, price: 27500000, finishing: 'semi' }
    ],
    paymentPlans: [
      {
        id: 'plan_es_1',
        name: 'استلام فوري - 10% مقدم و 7 سنوات',
        discountPercent: 0,
        downPaymentPercent: 10,
        years: 7,
        notes: 'ادفع 10% واستلم وحدتك فوراً مع تقسيط 7 سنوات'
      }
    ]
  },
  {
    id: 'comp_nile_business',
    locationId: 'sub_cbd',
    locationName: 'منطقة الأعمال المركزية (CBD)',
    projectType: 'commercial',
    companyName: 'النيل للتطوير العقاري | Nile Developments',
    projectName: 'نايل بيزنس سيتي (Nile Business City CBD)',
    phaseName: 'Tycoon Tower',
    ownerName: 'م. محمد طاهر',
    consultant: 'SIAC Construction & Artoc',
    contactName: 'إدارة المبيعات التجارية',
    whatsapp: '201088776655',
    projectSize: 8,
    floors: 'G + 50 أدوار (ناطحة سحاب)',
    compoundLocationDetail: 'منطقة الأعمال المركزية CBD، أمام البرج الأيقوني والنهر الأخضر مباشرة',
    locationLink: 'https://maps.google.com/?q=Nile+Business+City+New+Capital',
    commercialPrices: {
      adminMin: 120000,
      adminMax: 180000,
      adminFinish: 'full',
      commMin: 220000,
      commMax: 350000,
      commFinish: 'core_shell',
      clinicMin: 130000,
      clinicMax: 195000,
      clinicFinish: 'full'
    },
    deliveryDate: '3y',
    finishingStatus: 'mixed',
    maintenanceValue: 10,
    maintenanceType: 'percent',
    parkingType: 'extra',
    parkingFee: 300000,
    cashDiscount: 30,
    badge: 'ناطحة سحاب أيقونية',
    unitTypes: [
      { id: 'nbc_u1', bedroomType: 'إداري (Administrative)', rooms: 1, area: 45, price: 6300000, finishing: 'full' },
      { id: 'nbc_u2', bedroomType: 'إداري (Administrative)', rooms: 2, area: 85, price: 11900000, finishing: 'full' },
      { id: 'nbc_u3', bedroomType: 'تجاري (Commercial)', rooms: 1, area: 55, price: 14300000, finishing: 'core_shell' },
      { id: 'nbc_u4', bedroomType: 'عيادة (Clinic)', rooms: 2, area: 60, price: 9000000, finishing: 'full' }
    ],
    paymentPlans: [
      {
        id: 'plan_nbc_1',
        name: '10% مقدم وتقسيط 7 سنوات',
        discountPercent: 0,
        downPaymentPercent: 10,
        years: 7,
        notes: '10% مقدم وأقساط متساوية على 7 سنوات بدون فوائد'
      },
      {
        id: 'plan_nbc_2',
        name: '20% مقدم وتقسيط 9 سنوات',
        discountPercent: 0,
        downPaymentPercent: 20,
        years: 9,
        notes: '20% مقدم وتقسيط 9 سنوات مريحة'
      }
    ]
  },
  {
    id: 'comp_silversands',
    locationId: 'sub_sidi_abdelrahman',
    locationName: 'سيدي عبد الرحمن (Sidi Abdel Rahman)',
    projectType: 'hotel',
    companyName: 'أورا ديفلوبرز | Ora Developers',
    projectName: 'سيلفر ساندس الساحل (Silversands North Coast)',
    phaseName: 'Silver Beach Residences',
    ownerName: 'م. نجيب ساويرس',
    consultant: 'Wimberly Allison Tong & Goo (WATG)',
    contactName: 'مبيعات الساحل الشمالي',
    whatsapp: '201055554444',
    projectSize: 500,
    floors: 'Chalets G+2 & Beach Villas',
    compoundLocationDetail: 'الكيلو 243 طريق الإسكندرية - مطروح، خليج سيدي حنيش وسيدي عبد الرحمن',
    locationLink: 'https://maps.google.com/?q=Silversands+North+Coast',
    pricePerMeterMin: 115000,
    pricePerMeterMax: 160000,
    pricePerMeter: 135000,
    deliveryDate: '2y',
    finishingStatus: 'full',
    maintenanceValue: 9,
    maintenanceType: 'percent',
    parkingType: 'included',
    cashDiscount: 15,
    badge: 'إطلالة بحر مباشرة',
    unitTypes: [
      { id: 'ss_u1', bedroomType: 'شاليه (Chalet)', rooms: 2, area: 115, gardenArea: 40, roofArea: 0, price: 16500000, finishing: 'full' },
      { id: 'ss_u2', bedroomType: 'شاليه (Chalet)', rooms: 3, area: 155, gardenArea: 0, roofArea: 60, price: 21500000, finishing: 'full' },
      { id: 'ss_u3', bedroomType: 'توين هاوس (Twinhouse)', rooms: 4, area: 240, gardenArea: 120, roofArea: 40, price: 34000000, finishing: 'full' },
      { id: 'ss_u4', bedroomType: 'فيلا صف أول (Beachfront Villa)', rooms: 5, area: 420, gardenArea: 350, roofArea: 80, price: 65000000, finishing: 'full' }
    ],
    paymentPlans: [
      {
        id: 'plan_ss_1',
        name: '10% مقدم وتقسيط 8 سنوات تشطيب فاخر بالتكييفات',
        discountPercent: 0,
        downPaymentPercent: 10,
        years: 8,
        notes: 'تشطيب فندقي متكامل، 10% مقدم وأقساط 8 سنوات'
      }
    ]
  }
];
