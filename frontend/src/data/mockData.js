export const CATEGORIES = [
  {
    id: 'all',
    name: 'All Clothing',
    icon: 'Sparkles',
    count: 22,
    description: 'Browse our full fashion apparel collection',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'women',
    name: "Women's Clothes",
    icon: 'Heart',
    count: 9,
    description: 'Silk midi dresses, blazers, blouses, skirts & trench coats',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'men',
    name: "Men's Clothes",
    icon: 'UserCheck',
    count: 7,
    description: 'Tailored suits, compression tees, chinos, sweaters & jackets',
    image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'outerwear',
    name: 'Coats & Jackets',
    icon: 'Shield',
    count: 4,
    description: 'Wool trench coats, denim jackets & double-breasted overcoats',
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'kids',
    name: 'Kids & Youth',
    icon: 'Smile',
    count: 2,
    description: 'Cotton hoodies, t-shirts & cozy joggers for children',
    image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80'
  }
];

export const INITIAL_PRODUCTS = [
  // MEN'S CLOTHING (10 Unique Items)
  {
    id: 'prod-m1',
    name: 'Apex Pro Performance Compression Tee',
    category: 'men',
    price: 4800.00, // LKR
    originalPrice: 6000.00,
    rating: 5.0,
    reviewsCount: 1,
    isNew: true,
    isFeatured: true,
    stock: 18,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Pitch Black', hex: '#000000', image: '/apex_compression_tee.png' },
      { name: 'Stealth Grey', hex: '#334155', image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80' }
    ],
    image: '/apex_compression_tee.png', // User's requested black compression tee model image!
    gallery: ['/apex_compression_tee.png', 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=80'],
    description: 'Ultra-lightweight performance stretch compression top engineered with four-way flex fabric and sweat-wicking technology.',
    fabric: '88% Nylon, 12% Spandex Ultra-Flex',
    careInstructions: 'Machine wash cold inside out.',
    sku: 'ACH-MN-01'
  },
  {
    id: 'prod-m2',
    name: 'Classic Egyptian Cotton Oxford Dress Shirt',
    category: 'men',
    price: 7800.00,
    originalPrice: 9500.00,
    rating: 0.0,
    reviewsCount: 0,
    isNew: false,
    isFeatured: true,
    stock: 25,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Crisp White', hex: '#ffffff', image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80' },
      { name: 'Sky Blue', hex: '#38bdf8', image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80' }
    ],
    image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
    gallery: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=800&q=80'],
    description: '100% Egyptian cotton Oxford shirt with button-down collar and wrinkle-resistant weave.',
    fabric: '100% Long-Staple Egyptian Cotton',
    careInstructions: 'Machine wash warm.',
    sku: 'ACH-MN-02'
  },
  {
    id: 'prod-m3',
    name: 'Vintage Wash Denim Trucker Jacket',
    category: 'outerwear',
    price: 14500.00,
    originalPrice: 17500.00,
    rating: 0.0,
    reviewsCount: 0,
    isNew: true,
    isFeatured: true,
    stock: 8,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Washed Vintage Blue', hex: '#60a5fa', image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80' },
      { name: 'Jet Black Denim', hex: '#18181b', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80' }
    ],
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80',
    gallery: ['https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80'],
    description: 'Heavyweight 14oz organic cotton denim jacket with drop-shoulder silhouette.',
    fabric: '100% Organic Cotton Denim',
    careInstructions: 'Machine wash cold inside out.',
    sku: 'ACH-MN-03'
  },
  {
    id: 'prod-m4',
    name: 'Slim-Fit Stretch Chino Trousers',
    category: 'men',
    price: 8900.00,
    originalPrice: 11000.00,
    rating: 0.0,
    reviewsCount: 0,
    isNew: false,
    isFeatured: false,
    stock: 19,
    sizes: ['30', '32', '34', '36'],
    colors: [
      { name: 'Beige Khaki', hex: '#d97706', image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80' },
      { name: 'Midnight Navy', hex: '#1e3a8a', image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80' }
    ],
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80',
    gallery: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80'],
    description: 'Tailored slim-fit chinos with subtle stretch elastane for flexible all-day comfort.',
    fabric: '98% Cotton, 2% Elastane',
    careInstructions: 'Machine wash cold.',
    sku: 'ACH-MN-04'
  },
  {
    id: 'prod-m5',
    name: 'Cashmere Ribbed Crewneck Knit Sweater',
    category: 'men',
    price: 12800.00,
    originalPrice: 16000.00,
    rating: 0.0,
    reviewsCount: 0,
    isNew: true,
    isFeatured: false,
    stock: 11,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Oatmeal Beige', hex: '#fef3c7', image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=800&q=80' },
      { name: 'Charcoal Grey', hex: '#334155', image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80' }
    ],
    image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=800&q=80',
    gallery: ['https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80'],
    description: 'Ultra-soft Mongolian cashmere ribbed knit sweater designed for elegant layering.',
    fabric: '100% Grade-A Mongolian Cashmere',
    careInstructions: 'Hand wash cold or dry clean.',
    sku: 'ACH-MN-05'
  },
  {
    id: 'prod-m6',
    name: 'Classic Linen Casual Button-Down Shirt',
    category: 'men',
    price: 6900.00,
    originalPrice: 8500.00,
    rating: 0.0,
    reviewsCount: 0,
    isNew: false,
    isFeatured: false,
    stock: 15,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Natural White', hex: '#ffffff', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80' },
      { name: 'Light Blue', hex: '#93c5fd', image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80' }
    ],
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
    gallery: ['https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80'],
    description: 'Breathable 100% French linen shirt. Lightweight and relaxed for warm climate comfort.',
    fabric: '100% French Linen',
    careInstructions: 'Machine wash cold.',
    sku: 'ACH-MN-06'
  },
  {
    id: 'prod-m7',
    name: 'Double-Breasted Wool Overcoat',
    category: 'outerwear',
    price: 28000.00,
    originalPrice: 34000.00,
    rating: 0.0,
    reviewsCount: 0,
    isNew: true,
    isFeatured: true,
    stock: 5,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Camel Tan', hex: '#b45309', image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80' },
      { name: 'Onyx Black', hex: '#000000', image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80' }
    ],
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
    gallery: ['https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80'],
    description: 'Heavyweight double-breasted wool long trench coat with horn buttons and satin lining.',
    fabric: '80% Wool, 20% Polyamide',
    careInstructions: 'Dry clean only.',
    sku: 'ACH-MN-07'
  },
  {
    id: 'prod-m8',
    name: 'Urban Utility Cargo Pants',
    category: 'men',
    price: 9200.00,
    originalPrice: 11500.00,
    rating: 0.0,
    reviewsCount: 0,
    isNew: false,
    isFeatured: false,
    stock: 14,
    sizes: ['30', '32', '34', '36'],
    colors: [
      { name: 'Dark Khaki', hex: '#78350f', image: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=800&q=80' },
      { name: 'Stealth Black', hex: '#18181b', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80' }
    ],
    image: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=800&q=80',
    gallery: ['https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80'],
    description: 'Durable cotton twill cargo trousers with deep side flap pockets and cuffed hems.',
    fabric: '100% Cotton Twill',
    careInstructions: 'Machine wash warm.',
    sku: 'ACH-MN-08'
  },
  {
    id: 'prod-m9',
    name: 'Premium Heavyweight Cotton Polo Shirt',
    category: 'men',
    price: 5800.00,
    originalPrice: 7200.00,
    rating: 0.0,
    reviewsCount: 0,
    isNew: false,
    isFeatured: false,
    stock: 21,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Navy Blue', hex: '#1e3a8a', image: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=800&q=80' },
      { name: 'Pure White', hex: '#ffffff', image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80' }
    ],
    image: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=800&q=80',
    gallery: ['https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=800&q=80'],
    description: 'Heavyweight pique cotton polo shirt with mother-of-pearl buttons and tailored fit.',
    fabric: '100% Combed Cotton',
    careInstructions: 'Machine wash warm.',
    sku: 'ACH-MN-09'
  },
  {
    id: 'prod-m10',
    name: 'Leather Moto Biker Casual Jacket',
    category: 'outerwear',
    price: 32500.00,
    originalPrice: 39000.00,
    rating: 0.0,
    reviewsCount: 0,
    isNew: true,
    isFeatured: true,
    stock: 4,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Midnight Black', hex: '#09090b', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80' },
      { name: 'Espresso Brown', hex: '#451a03', image: 'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?auto=format&fit=crop&w=800&q=80' }
    ],
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
    gallery: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?auto=format&fit=crop&w=800&q=80'],
    description: 'Full-grain lambskin leather biker jacket with asymmetrical zip closure and quilted shoulders.',
    fabric: '100% Lambskin Leather',
    careInstructions: 'Leather clean only.',
    sku: 'ACH-MN-10'
  },

  // WOMEN'S CLOTHING (10 Unique Items)
  {
    id: 'prod-w1',
    name: 'Silk Cascade Midi Wrap Dress',
    category: 'women',
    price: 18500.00, // LKR
    originalPrice: 22500.00,
    rating: 4.0,
    reviewsCount: 1,
    isNew: true,
    isFeatured: true,
    stock: 12,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Emerald Green', hex: '#065f46', image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80' },
      { name: 'Champagne Rose', hex: '#f43f5e', image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80' }
    ],
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
    gallery: ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80'],
    description: 'Flowing mulberry silk midi dress with elegant side wrap drape and adjustable waist tie.',
    fabric: '100% Mulberry Silk',
    careInstructions: 'Hand wash cold or dry clean.',
    sku: 'ACH-WM-01'
  },
  {
    id: 'prod-w2',
    name: 'Pleated High-Waisted Wide-Leg Trousers',
    category: 'women',
    price: 11200.00,
    originalPrice: 14000.00,
    rating: 0.0,
    reviewsCount: 0,
    isNew: false,
    isFeatured: true,
    stock: 16,
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Oatmeal Beige', hex: '#d97706', image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80' },
      { name: 'Slate Grey', hex: '#475569', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80' }
    ],
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
    gallery: ['https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80'],
    description: 'Chic wide-leg pleated trousers with tailored waistband and flattering high-rise drape.',
    fabric: '70% Wool, 28% Viscose, 2% Elastane',
    careInstructions: 'Dry clean recommended.',
    sku: 'ACH-WM-02'
  },
  {
    id: 'prod-w3',
    name: 'Ribbed Knit Turtleneck Sweater',
    category: 'women',
    price: 8900.00,
    originalPrice: 11500.00,
    rating: 0.0,
    reviewsCount: 0,
    isNew: true,
    isFeatured: false,
    stock: 18,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Cream Ivory', hex: '#fef3c7', image: 'https://images.unsplash.com/photo-1574201635302-388dd92a4c3f?auto=format&fit=crop&w=800&q=80' },
      { name: 'Soft Sage', hex: '#84cc16', image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80' }
    ],
    image: 'https://images.unsplash.com/photo-1574201635302-388dd92a4c3f?auto=format&fit=crop&w=800&q=80',
    gallery: ['https://images.unsplash.com/photo-1574201635302-388dd92a4c3f?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80'],
    description: 'Cozy fine-gauge ribbed turtleneck knit sweater with long fitted sleeves.',
    fabric: '90% Cotton, 10% Cashmere',
    careInstructions: 'Hand wash cold.',
    sku: 'ACH-WM-03'
  },
  {
    id: 'prod-w4',
    name: 'Elegance Floral Chiffon Maxi Dress',
    category: 'women',
    price: 16800.00,
    originalPrice: 21000.00,
    rating: 0.0,
    reviewsCount: 0,
    isNew: true,
    isFeatured: true,
    stock: 10,
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Pastel Floral', hex: '#fb7185', image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80' },
      { name: 'Navy Bloom', hex: '#1e3a8a', image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80' }
    ],
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80',
    gallery: ['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80'],
    description: 'Flowing floral printed chiffon maxi dress with long bishop sleeves and tiered ruffle hem.',
    fabric: '100% Silk Chiffon',
    careInstructions: 'Dry clean only.',
    sku: 'ACH-WM-04'
  },
  {
    id: 'prod-w5',
    name: 'Tailored Double-Breasted Blazer',
    category: 'women',
    price: 22000.00,
    originalPrice: 27000.00,
    rating: 0.0,
    reviewsCount: 0,
    isNew: false,
    isFeatured: true,
    stock: 7,
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Ivory White', hex: '#ffffff', image: 'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?auto=format&fit=crop&w=800&q=80' },
      { name: 'Midnight Black', hex: '#09090b', image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80' }
    ],
    image: 'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?auto=format&fit=crop&w=800&q=80',
    gallery: ['https://images.unsplash.com/photo-1548624313-0396c75e4b1a?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80'],
    description: 'Sophisticated women blazer featuring sharp peak lapels and tortoiseshell buttons.',
    fabric: '65% Wool, 35% Viscose',
    careInstructions: 'Dry clean only.',
    sku: 'ACH-WM-05'
  },
  {
    id: 'prod-w6',
    name: 'Silk Satin Button-Up Blouse',
    category: 'women',
    price: 9500.00,
    originalPrice: 12000.00,
    rating: 0.0,
    reviewsCount: 0,
    isNew: false,
    isFeatured: false,
    stock: 14,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Blush Pink', hex: '#f472b6', image: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=800&q=80' },
      { name: 'Pearl White', hex: '#ffffff', image: 'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?auto=format&fit=crop&w=800&q=80' }
    ],
    image: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=800&q=80',
    gallery: ['https://images.unsplash.com/photo-1564257631407-4deb1f99d992?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?auto=format&fit=crop&w=800&q=80'],
    description: 'Lustrous silk satin blouse with subtle button closure and relaxed cuff sleeves.',
    fabric: '100% Silk Satin',
    careInstructions: 'Hand wash cold.',
    sku: 'ACH-WM-06'
  },
  {
    id: 'prod-w7',
    name: 'High-Rise Straight Leg Denim Jeans',
    category: 'women',
    price: 10800.00,
    originalPrice: 13500.00,
    rating: 0.0,
    reviewsCount: 0,
    isNew: false,
    isFeatured: false,
    stock: 17,
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Vintage Indigo', hex: '#3b82f6', image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80' },
      { name: 'Washed Black', hex: '#27272a', image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80' }
    ],
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
    gallery: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80'],
    description: 'Classic 90s style high-waisted straight leg jeans crafted from 100% rigid cotton denim.',
    fabric: '100% Organic Cotton Denim',
    careInstructions: 'Machine wash cold.',
    sku: 'ACH-WM-07'
  },
  {
    id: 'prod-w8',
    name: 'Classic Belted Wool Trench Coat',
    category: 'outerwear',
    price: 29500.00,
    originalPrice: 36000.00,
    rating: 0.0,
    reviewsCount: 0,
    isNew: true,
    isFeatured: true,
    stock: 6,
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Classic Camel', hex: '#b45309', image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80' },
      { name: 'Charcoal Black', hex: '#09090b', image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80' }
    ],
    image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80',
    gallery: ['https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80'],
    description: 'Timeless double-breasted long wool trench coat featuring storm flaps and waist belt.',
    fabric: '85% Merino Wool, 15% Cashmere',
    careInstructions: 'Dry clean only.',
    sku: 'ACH-WM-08'
  },
  {
    id: 'prod-w9',
    name: 'Chic Pleated A-Line Midi Skirt',
    category: 'women',
    price: 7900.00,
    originalPrice: 9800.00,
    rating: 0.0,
    reviewsCount: 0,
    isNew: false,
    isFeatured: false,
    stock: 13,
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Metallic Gold', hex: '#d97706', image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=800&q=80' },
      { name: 'Onyx Black', hex: '#000000', image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80' }
    ],
    image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=800&q=80',
    gallery: ['https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80'],
    description: 'High-waisted sunray pleated midi skirt with smooth elastic waistband.',
    fabric: '100% Polyester Satin',
    careInstructions: 'Hand wash cold.',
    sku: 'ACH-WM-09'
  },
  {
    id: 'prod-w10',
    name: 'Cozy Oversized Cable Knit Cardigan',
    category: 'women',
    price: 10200.00,
    originalPrice: 13000.00,
    rating: 0.0,
    reviewsCount: 0,
    isNew: true,
    isFeatured: false,
    stock: 15,
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Warm Cream', hex: '#fef3c7', image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80' },
      { name: 'Soft Mocha', hex: '#78350f', image: 'https://images.unsplash.com/photo-1574201635302-388dd92a4c3f?auto=format&fit=crop&w=800&q=80' }
    ],
    image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80',
    gallery: ['https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1574201635302-388dd92a4c3f?auto=format&fit=crop&w=800&q=80'],
    description: 'Chunky cable knit open-front cardigan with tortoiseshell buttons and deep pockets.',
    fabric: '70% Wool, 30% Acrylic',
    careInstructions: 'Hand wash cold.',
    sku: 'ACH-WM-10'
  },

  // KIDS & YOUTH CLOTHING (2 Unique Items)
  {
    id: 'prod-k1',
    name: 'Kids Organic Cotton Fleece Hoodie & Joggers',
    category: 'kids',
    price: 6800.00, // LKR
    originalPrice: 8500.00,
    rating: 0.0,
    reviewsCount: 0,
    isNew: true,
    isFeatured: true,
    stock: 20,
    sizes: ['3-4Y', '5-6Y', '7-8Y', '9-10Y'],
    colors: [
      { name: 'Honey Amber', hex: '#f59e0b', image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80' },
      { name: 'Forest Mint', hex: '#10b981', image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=800&q=80' }
    ],
    image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80',
    gallery: ['https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=800&q=80'],
    description: 'Cozy organic cotton fleece hoodie and matching jogger pants for children.',
    fabric: '100% Organic Cotton Fleece',
    careInstructions: 'Machine wash warm.',
    sku: 'ACH-KD-01'
  },
  {
    id: 'prod-k2',
    name: 'Kids Striped Cotton Crewneck T-Shirt',
    category: 'kids',
    price: 3500.00,
    originalPrice: 4500.00,
    rating: 0.0,
    reviewsCount: 0,
    isNew: false,
    isFeatured: false,
    stock: 24,
    sizes: ['3-4Y', '5-6Y', '7-8Y', '9-10Y'],
    colors: [
      { name: 'Navy & White Striped', hex: '#1e3a8a', image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=800&q=80' },
      { name: 'Crimson & White Striped', hex: '#dc2626', image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80' }
    ],
    image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=800&q=80',
    gallery: ['https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80'],
    description: 'Soft combed cotton striped t-shirt for boys and girls.',
    fabric: '100% Combed Cotton',
    careInstructions: 'Machine wash warm.',
    sku: 'ACH-KD-02'
  }
];

export const MOCK_USERS = [
  {
    id: 'user-cust-01',
    name: 'Sasanka Perera',
    email: 'customer@avenza.com',
    username: 'customer',
    password: 'password123',
    role: 'customer',
    status: 'active',
    phone: '+94 77 123 4567',
    address: 'No. 45, Flower Road, Colombo 07',
    city: 'Colombo',
    postalCode: '00700',
    country: 'Sri Lanka',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'user-admin-01',
    name: 'Sasanka P.B.S',
    email: 'admin@avenza.com',
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    status: 'active',
    phone: '+94 71 987 6543',
    address: 'SLIIT Campus, New Kandy Rd, Malabe',
    city: 'Malabe',
    postalCode: '10115',
    country: 'Sri Lanka',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'user-staff-01',
    name: 'Kamal Silva',
    email: 'staff@avenza.com',
    username: 'staff',
    password: 'staff123',
    role: 'inventory_staff',
    status: 'active',
    phone: '+94 72 345 6789',
    address: 'Main Warehouse, Galle Road, Dehiwala',
    city: 'Dehiwala',
    postalCode: '10350',
    country: 'Sri Lanka',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
  }
];

export const INITIAL_SETTINGS = {
  storeName: 'Avenza Clothing Store',
  storeEmail: 'support@avenza.com',
  storePhone: '+94 11 234 5678',
  storeAddress: 'No. 100, Galle Road, Colombo 03, Sri Lanka',
  currency: 'LKR (Rs.)',
  taxRate: '8',
  freeShippingThreshold: '15000',
  lowStockThreshold: '5',
  maintenanceMode: false,
  maintenanceNoticeTime: 'September 12, 2026 at 06:00 PM (SLST)',
  emailNotifications: true
};

export const INITIAL_ORDERS = [
  {
    id: 'AVENZA-10089',
    userId: 'user-cust-01',
    customerName: 'Sasanka Perera',
    email: 'customer@avenza.com',
    date: '2026-09-12',
    totalAmount: 32500.00,
    status: 'Processing',
    trackingNumber: 'TRK-AVENZA-99201',
    estimatedDelivery: '2026-09-15',
    shippingAddress: {
      address: 'No. 45, Flower Road',
      city: 'Colombo 07',
      postalCode: '00700'
    },
    items: [
      {
        id: 'prod-w1',
        name: 'Silk Cascade Midi Wrap Dress',
        category: 'women',
        price: 18500.00,
        size: 'S',
        color: 'Emerald Green',
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=300&q=80'
      },
      {
        id: 'prod-w3',
        name: 'High-Waisted Tailored Linen Trousers',
        category: 'women',
        price: 14000.00,
        size: 'M',
        color: 'Beige',
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=300&q=80'
      }
    ]
  },
  {
    id: 'AVENZA-10085',
    userId: 'user-cust-02',
    customerName: 'Nimali Fernando',
    email: 'nimali@gmail.com',
    date: '2026-09-10',
    totalAmount: 24800.00,
    status: 'Shipped',
    trackingNumber: 'TRK-AVENZA-99185',
    estimatedDelivery: '2026-09-13',
    shippingAddress: {
      address: 'No. 12, Kandy Road',
      city: 'Kadawatha',
      postalCode: '11830'
    },
    items: [
      {
        id: 'prod-m1',
        name: 'Italian Wool Blend Double-Breasted Blazer',
        category: 'men',
        price: 24800.00,
        size: 'L',
        color: 'Navy Blue',
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=300&q=80'
      }
    ]
  },
  {
    id: 'AVENZA-10078',
    userId: 'user-cust-03',
    customerName: 'Kavinda Jayasinghe',
    email: 'kavinda@yahoo.com',
    date: '2026-09-06',
    totalAmount: 17300.00,
    status: 'Delivered',
    trackingNumber: 'TRK-AVENZA-99078',
    estimatedDelivery: '2026-09-09',
    shippingAddress: {
      address: 'No. 88, Galle Road',
      city: 'Panadura',
      postalCode: '12500'
    },
    items: [
      {
        id: 'prod-m2',
        name: 'Classic Egyptian Cotton Oxford Dress Shirt',
        category: 'men',
        price: 7800.00,
        size: 'M',
        color: 'Crisp White',
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=300&q=80'
      },
      {
        id: 'prod-k1',
        name: 'Organic Cotton Denim Overalls (Kids)',
        category: 'kids',
        price: 9500.00,
        size: 'M',
        color: 'Denim Blue',
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=300&q=80'
      }
    ]
  },
  {
    id: 'AVENZA-10062',
    userId: 'user-cust-04',
    customerName: 'Dinushi De Silva',
    email: 'dinushi@gmail.com',
    date: '2026-09-02',
    totalAmount: 42000.00,
    status: 'Delivered',
    trackingNumber: 'TRK-AVENZA-99062',
    estimatedDelivery: '2026-09-05',
    shippingAddress: {
      address: 'No. 204, Havelock Road',
      city: 'Colombo 05',
      postalCode: '00500'
    },
    items: [
      {
        id: 'prod-o1',
        name: 'Water-Resistant Trench Coat with Belt',
        category: 'outerwear',
        price: 32000.00,
        size: 'M',
        color: 'Camel',
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=300&q=80'
      },
      {
        id: 'prod-w2',
        name: 'Floral Print Chiffon Maxi Dress',
        category: 'women',
        price: 10000.00,
        size: 'S',
        color: 'Floral Red',
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=300&q=80'
      }
    ]
  },
  {
    id: 'AVENZA-99420',
    userId: 'user-cust-01',
    customerName: 'Sasanka Perera',
    email: 'customer@avenza.com',
    date: '2026-08-11',
    totalAmount: 26300.00,
    status: 'Delivered',
    trackingNumber: 'TRK-AVENZA-8849201',
    estimatedDelivery: '2026-08-14',
    shippingAddress: {
      address: 'No. 45, Flower Road',
      city: 'Colombo 07',
      postalCode: '00700'
    },
    items: [
      {
        id: 'prod-m2',
        name: 'Classic Egyptian Cotton Oxford Dress Shirt',
        category: 'men',
        price: 7800.00,
        size: 'L',
        color: 'Crisp White',
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=300&q=80'
      },
      {
        id: 'prod-w1',
        name: 'Silk Cascade Midi Wrap Dress',
        category: 'women',
        price: 18500.00,
        size: 'S',
        color: 'Emerald Green',
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=300&q=80'
      }
    ]
  }
];

export const SALES_SUMMARY = {
  totalRevenue: 2845000.00, // LKR
  totalOrders: 182,
  activeCustomers: 140,
  lowStockAlerts: 2,
  monthlyRevenueData: [
    { month: 'Jan', revenue: 310000 },
    { month: 'Feb', revenue: 360000 },
    { month: 'Mar', revenue: 420000 },
    { month: 'Apr', revenue: 490000 },
    { month: 'May', revenue: 510000 },
    { month: 'Jun', revenue: 620000 },
    { month: 'Jul', revenue: 710000 },
    { month: 'Aug', revenue: 840000 }
  ]
};

