//seed.ts
import bcryptjs from 'bcryptjs';

interface SeedProduct {
  description: string;
  images: string[];
  price: number;
  slug: string;
  tags: string[];
  title: string;
  categories: string[]; // 🆕 Array de slugs de categorías ['men', 'shirts']
  brand?: string;
  variants: ProductVariant[];
  attributes?: {
    material?: string;
    weight?: string;
    care?: string;
  };
}

interface ProductVariant {
  color: string;
  stockBySize: Partial<Record<ValidSizes, number>>;
  images: string[];
  sku?: string;
}

type ValidSizes = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL';

interface SeedUser {
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'user';
}

interface SeedCategory {
  name: string;
  slug: string;
  description?: string;
  parentSlug?: string;
  isFeatured?: boolean;
}

interface SeedBrand {
  name: string;
  slug: string;
  description?: string;
  type?: string;
}

interface SeedData {
  users: SeedUser[];
  categories: SeedCategory[];
  brands: SeedBrand[];
  products: SeedProduct[];
}

export const initialData: SeedData = {
  users: [
    {
      email: 'juan@gmail.com',
      password: bcryptjs.hashSync('123456'),
      name: 'Juan Manuel Santa Cruz',
      role: 'admin',
    },
    {
      email: 'pedro@gmail.com',
      password: bcryptjs.hashSync('123456'),
      name: 'Pedro Pascal',
      role: 'user',
    },
  ],

  // 🆕 Categorías con jerarquía de género
  categories: [
    // === NIVEL 1: GÉNERO ===
    { name: 'Men', slug: 'men', description: "Men's products", isFeatured: true },
    { name: 'Women', slug: 'women', description: "Women's products", isFeatured: true },
    { name: 'Kids', slug: 'kids', description: 'Kids products', isFeatured: true },
    { name: 'Unisex', slug: 'unisex', description: 'Unisex products', isFeatured: true },

    // === NIVEL 2: TIPO DE PRODUCTO (bajo Men) ===
    { name: "Men's Shirts", slug: 'men-shirts', parentSlug: 'men' },
    { name: "Men's Hoodies", slug: 'men-hoodies', parentSlug: 'men' },
    { name: "Men's Hats", slug: 'men-hats', parentSlug: 'men' },

    // === NIVEL 2: TIPO DE PRODUCTO (bajo Women) ===
    { name: "Women's Shirts", slug: 'women-shirts', parentSlug: 'women' },
    { name: "Women's Hoodies", slug: 'women-hoodies', parentSlug: 'women' },
    { name: "Women's Hats", slug: 'women-hats', parentSlug: 'women' },

    // === NIVEL 2: TIPO DE PRODUCTO (bajo Kids) ===
    { name: 'Kids Shirts', slug: 'kids-shirts', parentSlug: 'kids' },
    { name: 'Kids Jackets', slug: 'kids-jackets', parentSlug: 'kids' },

    // === NIVEL 2: TIPO DE PRODUCTO (bajo Unisex) ===
    { name: 'Unisex Hoodies', slug: 'unisex-hoodies', parentSlug: 'unisex' },
    { name: 'Unisex Hats', slug: 'unisex-hats', parentSlug: 'unisex' },
  ],

  brands: [
    { name: 'Tesla', slug: 'tesla', description: 'Official Tesla merchandise', type: 'brand' },
    {
      name: 'Chill Collection',
      slug: 'chill-collection',
      description: 'Premium, heavyweight exterior with soft fleece interior',
      type: 'collection',
    },
    {
      name: 'Raven Collection',
      slug: 'raven-collection',
      description: 'Sustainable bamboo cotton blend collection',
      type: 'collection',
    },
    {
      name: 'Turbine Collection',
      slug: 'turbine-collection',
      description: 'Lightweight everyday lifestyle collection',
      type: 'collection',
    },
    {
      name: 'Cybertruck',
      slug: 'cybertruck',
      description: 'Cybertruck-themed merchandise',
      type: 'line',
    },
  ],

  products: [
    {
      title: "Men's Chill Crew Neck Sweatshirt",
      description:
        "Introducing the Tesla Chill Collection. The Men's Chill Crew Neck Sweatshirt has a premium, heavyweight exterior and soft fleece interior for comfort in any season. The sweatshirt features a subtle thermoplastic polyurethane T logo on the chest and a Tesla wordmark below the back collar. Made from 60% cotton and 40% recycled polyester.",
      images: ['1740176-00-A_0_2000.jpg', '1740176-00-A_1.jpg'],
      price: 75,
      slug: 'mens_chill_crew_neck_sweatshirt',
      categories: ['men', 'men-shirts'], // 🆕
      tags: ['sweatshirt', 'chill', 'crew neck'],
      brand: 'chill-collection',
      attributes: { material: '60% cotton and 40% recycled polyester' },
      variants: [
        {
          color: 'Black',
          stockBySize: { XS: 5, S: 17, M: 0, L: 15, XL: 2, XXL: 11 },
          images: ['1740176-00-A_0_2000.jpg', '1740176-00-A_1.jpg'],
        },
        {
          color: 'Blue',
          stockBySize: { XS: 1, S: 10, M: 6, L: 13, XL: 4, XXL: 2 },
          images: ['1740176-00-A_0_2000.jpg', '1740176-00-A_1.jpg'],
        },
      ],
    },
    {
      title: "Men's Quilted Shirt Jacket",
      description:
        "The Men's Quilted Shirt Jacket features a uniquely fit, quilted design for warmth and mobility in cold weather seasons. With an overall street-smart aesthetic, the jacket features subtle silicone injected Tesla logos below the back collar and on the right sleeve, as well as custom matte metal zipper pulls. Made from 87% nylon and 13% polyurethane.",
      images: ['1740507-00-A_0_2000.jpg', '1740507-00-A_1.jpg'],
      price: 200,
      slug: 'men_quilted_shirt_jacket',
      categories: ['men', 'men-shirts'],
      tags: ['jacket', 'quilted', 'winter'],
      brand: 'tesla',
      attributes: { material: '87% nylon and 13% polyurethane' },
      variants: [
        {
          color: 'Green',
          stockBySize: { XS: 12, S: 13, M: 6, XL: 10, XXL: 2 },
          images: ['1740507-00-A_0_2000.jpg', '1740507-00-A_1.jpg'],
        },
        {
          color: 'White',
          stockBySize: { XS: 4, S: 16, M: 1, XL: 19, XXL: 4 },
          images: ['1740507-00-A_0_2000.jpg', '1740507-00-A_1.jpg'],
        },
      ],
    },
    {
      title: "Men's Raven Lightweight Zip Up Bomber Jacket",
      description:
        "Introducing the Tesla Raven Collection. The Men's Raven Lightweight Zip Up Bomber has a premium, modern silhouette made from a sustainable bamboo cotton blend for versatility in any season. The hoodie features subtle thermoplastic polyurethane Tesla logos on the left chest and below the back collar, a concealed chest pocket with custom matte zipper pulls and a french terry interior. Made from 70% bamboo and 30% cotton.",
      images: ['1740250-00-A_0_2000.jpg', '1740250-00-A_1.jpg'],
      price: 130,
      slug: 'men_raven_lightweight_zip_up_bomber_jacket',
      categories: ['men', 'men-shirts'],
      tags: ['bomber', 'raven', 'sustainable'],
      brand: 'raven-collection',
      attributes: { material: '70% bamboo and 30% cotton' },
      variants: [
        {
          color: 'Green',
          stockBySize: { S: 2, M: 4, L: 13, XL: 5, XXL: 15 },
          images: ['1740250-00-A_0_2000.jpg', '1740250-00-A_1.jpg'],
        },
        {
          color: 'White',
          stockBySize: { S: 17, M: 10, L: 9, XL: 6, XXL: 7 },
          images: ['1740250-00-A_0_2000.jpg', '1740250-00-A_1.jpg'],
        },
      ],
    },
    {
      title: "Men's Turbine Long Sleeve Tee",
      description:
        "Introducing the Tesla Turbine Collection. Designed for style, comfort and everyday lifestyle, the Men's Turbine Long Sleeve Tee features a subtle, water-based T logo on the left chest and our Tesla wordmark below the back collar. The lightweight material is double-dyed, creating a soft, casual style for ideal wear in any season. Made from 50% cotton and 50% polyester.",
      images: ['1740280-00-A_0_2000.jpg', '1740280-00-A_1.jpg'],
      price: 45,
      slug: 'men_turbine_long_sleeve_tee',
      categories: ['men', 'men-shirts'],
      tags: ['long sleeve', 'turbine', 'casual'],
      brand: 'turbine-collection',
      attributes: { material: '50% cotton and 50% polyester' },
      variants: [
        {
          color: 'Yellow',
          stockBySize: { XS: 1, S: 8, M: 16, L: 13 },
          images: ['1740280-00-A_0_2000.jpg', '1740280-00-A_1.jpg'],
        },
        {
          color: 'Black',
          stockBySize: { XS: 9, S: 16, M: 7, L: 1 },
          images: ['1740280-00-A_0_2000.jpg', '1740280-00-A_1.jpg'],
        },
      ],
    },
    {
      title: "Men's Turbine Short Sleeve Tee",
      description:
        "Introducing the Tesla Turbine Collection. Designed for style, comfort and everyday lifestyle, the Men's Turbine Short Sleeve Tee features a subtle, water-based Tesla wordmark across the chest and our T logo below the back collar. The lightweight material is double-dyed, creating a soft, casual style for ideal wear in any season. Made from 50% cotton and 50% polyester.",
      images: ['1741416-00-A_0_2000.jpg', '1741416-00-A_1.jpg'],
      price: 40,
      slug: 'men_turbine_short_sleeve_tee',
      categories: ['men', 'men-shirts'],
      tags: ['shirt', 'turbine'],
      brand: 'turbine-collection',
      attributes: { material: '50% cotton and 50% polyester' },
      variants: [
        {
          color: 'White',
          stockBySize: { M: 15, L: 10, XL: 6, XXL: 11 },
          images: ['1741416-00-A_0_2000.jpg', '1741416-00-A_1.jpg'],
        },
        {
          color: 'Green',
          stockBySize: { M: 14, L: 8, XL: 6, XXL: 9 },
          images: ['1741416-00-A_0_2000.jpg', '1741416-00-A_1.jpg'],
        },
      ],
    },
    {
      title: "Men's Cybertruck Owl Tee",
      description:
        'Designed for comfort, the Cybertruck Owl Tee is made from 100% cotton and features our signature Cybertruck icon on the back.',
      images: ['7654393-00-A_2_2000.jpg', '7654393-00-A_3.jpg'],
      price: 35,
      slug: 'men_cybertruck_owl_tee',
      categories: ['men', 'men-shirts'],
      tags: ['shirt', 'cybertruck'],
      brand: 'cybertruck',
      attributes: { material: '100% cotton' },
      variants: [
        {
          color: 'Black',
          stockBySize: { M: 18, L: 13, XL: 2, XXL: 15 },
          images: ['7654393-00-A_2_2000.jpg', '7654393-00-A_3.jpg'],
        },
        {
          color: 'Green',
          stockBySize: { M: 7, L: 18, XL: 15, XXL: 11 },
          images: ['7654393-00-A_2_2000.jpg', '7654393-00-A_3.jpg'],
        },
      ],
    },
    {
      title: "Men's Solar Roof Tee",
      description:
        "Inspired by our fully integrated home solar and storage system, the Tesla Solar Roof Tee advocates for clean, sustainable energy wherever you go. Designed for fit, comfort and style, the tee features an aerial view of our seamless Solar Roof design on the front with our signature T logo above 'Solar Roof' on the back. Made from 100% Peruvian cotton.",
      images: ['1703767-00-A_0_2000.jpg', '1703767-00-A_1.jpg'],
      price: 35,
      slug: 'men_solar_roof_tee',
      categories: ['men', 'men-shirts'],
      tags: ['shirt', 'solar'],
      brand: 'tesla',
      attributes: { material: '100% Peruvian cotton' },
      variants: [
        {
          color: 'Black',
          stockBySize: { S: 10, M: 16, L: 8, XL: 6 },
          images: ['1703767-00-A_0_2000.jpg', '1703767-00-A_1.jpg'],
        },
        {
          color: 'Blue',
          stockBySize: { S: 6, M: 3, L: 11, XL: 10 },
          images: ['1703767-00-A_0_2000.jpg', '1703767-00-A_1.jpg'],
        },
      ],
    },
    {
      title: "Men's Let the Sun Shine Tee",
      description:
        "Inspired by the world's most unlimited resource, the Let the Sun Shine Tee highlights our fully integrated home solar and storage system. Designed for fit, comfort and style, the tee features a sunset graphic along with our Tesla wordmark on the front and our signature T logo printed above 'Solar Roof' on the back. Made from 100% Peruvian cotton.",
      images: ['1700280-00-A_0_2000.jpg', '1700280-00-A_1.jpg'],
      price: 35,
      slug: 'men_let_the_sun_shine_tee',
      categories: ['men', 'men-shirts'],
      tags: ['shirt', 'solar'],
      brand: 'tesla',
      attributes: { material: '100% Peruvian cotton' },
      variants: [
        {
          color: 'Green',
          stockBySize: { XS: 2, S: 2, XL: 18, XXL: 8 },
          images: ['1700280-00-A_0_2000.jpg', '1700280-00-A_1.jpg'],
        },
        {
          color: 'Blue',
          stockBySize: { XS: 7, S: 9, XL: 18, XXL: 16 },
          images: ['1700280-00-A_0_2000.jpg', '1700280-00-A_1.jpg'],
        },
      ],
    },
    {
      title: "Men's 3D Large Wordmark Tee",
      description:
        "Designed for fit, comfort and style, the Men's 3D Large Wordmark Tee is made from 100% Peruvian cotton with a 3D silicone-printed Tesla wordmark printed across the chest.",
      images: ['8764734-00-A_0_2000.jpg', '8764734-00-A_1.jpg'],
      price: 35,
      slug: 'men_3d_large_wordmark_tee',
      categories: ['men', 'men-shirts'],
      tags: ['shirt'],
      brand: 'tesla',
      attributes: { material: '100% Peruvian cotton' },
      variants: [
        {
          color: 'Green',
          stockBySize: { XS: 9, S: 10, M: 3 },
          images: ['8764734-00-A_0_2000.jpg', '8764734-00-A_1.jpg'],
        },
        {
          color: 'Blue',
          stockBySize: { XS: 14, S: 17, M: 13 },
          images: ['8764734-00-A_0_2000.jpg', '8764734-00-A_1.jpg'],
        },
      ],
    },
    {
      title: "Men's 3D T Logo Tee",
      description:
        'Designed for fit, comfort and style, the Tesla T Logo Tee is made from 100% Peruvian cotton and features a silicone-printed T Logo on the left chest.',
      images: ['7652426-00-A_0_2000.jpg', '7652426-00-A_1.jpg'],
      price: 35,
      slug: 'men_3d_t_logo_tee',
      categories: ['men', 'men-shirts'],
      tags: ['shirt'],
      brand: 'tesla',
      attributes: { material: '100% Peruvian cotton' },
      variants: [
        {
          color: 'White',
          stockBySize: { XS: 19, S: 16 },
          images: ['7652426-00-A_0_2000.jpg', '7652426-00-A_1.jpg'],
        },
        {
          color: 'Black',
          stockBySize: { XS: 10, S: 10 },
          images: ['7652426-00-A_0_2000.jpg', '7652426-00-A_1.jpg'],
        },
      ],
    },
    {
      title: "Men's 3D Small Wordmark Tee",
      description:
        'Designed for comfort and style in any size, the Tesla Small Wordmark Tee is made from 100% Peruvian cotton and features a 3D silicone-printed wordmark on the left chest.',
      images: ['8528839-00-A_0_2000.jpg', '8528839-00-A_2.jpg'],
      price: 35,
      slug: 'men_3d_small_wordmark_tee',
      categories: ['men', 'men-shirts'],
      tags: ['shirt'],
      brand: 'tesla',
      attributes: { material: '100% Peruvian cotton' },
      variants: [
        {
          color: 'White',
          stockBySize: { XS: 6, S: 19, M: 17 },
          images: ['8528839-00-A_0_2000.jpg', '8528839-00-A_2.jpg'],
        },
        {
          color: 'Blue',
          stockBySize: { XS: 16, S: 10, M: 15 },
          images: ['8528839-00-A_0_2000.jpg', '8528839-00-A_2.jpg'],
        },
      ],
    },
    {
      title: "Men's Plaid Mode Tee",
      description:
        "Designed to celebrate Tesla's incredible performance mode, the Plaid Mode Tee features great fit, comfort and style. Made from 100% cotton, it's the next best thing to riding shotgun at the Nürburgring.",
      images: ['1549268-00-A_0_2000.jpg', '1549268-00-A_2.jpg'],
      price: 35,
      slug: 'men_plaid_mode_tee',
      categories: ['men', 'men-shirts'],
      tags: ['shirt', 'plaid'],
      brand: 'tesla',
      attributes: { material: '100% cotton' },
      variants: [
        {
          color: 'Yellow',
          stockBySize: { XS: 1, S: 3, M: 5, L: 19, XL: 3, XXL: 13 },
          images: ['1549268-00-A_0_2000.jpg', '1549268-00-A_2.jpg'],
        },
        {
          color: 'White',
          stockBySize: { XS: 9, S: 11, M: 14, L: 7, XL: 16, XXL: 3 },
          images: ['1549268-00-A_0_2000.jpg', '1549268-00-A_2.jpg'],
        },
      ],
    },
    {
      title: "Men's Powerwall Tee",
      description:
        "Inspired by our popular home battery, the Tesla Powerwall Tee is made from 100% cotton and features the phrase 'Pure Energy' under our signature logo in the back. Designed for fit, comfort and style, the exclusive tee promotes sustainable energy in any environment.",
      images: ['9877034-00-A_0_2000.jpg', '9877034-00-A_2.jpg'],
      price: 35,
      slug: 'men_powerwall_tee',
      categories: ['men', 'men-shirts'],
      tags: ['shirt', 'powerwall'],
      brand: 'tesla',
      attributes: { material: '100% cotton' },
      variants: [
        {
          color: 'Green',
          stockBySize: { XL: 0, XXL: 12 },
          images: ['9877034-00-A_0_2000.jpg', '9877034-00-A_2.jpg'],
        },
        {
          color: 'Blue',
          stockBySize: { XL: 15, XXL: 3 },
          images: ['9877034-00-A_0_2000.jpg', '9877034-00-A_2.jpg'],
        },
      ],
    },
    {
      title: "Men\'s Battery Day Tee",
      description:
        'Inspired by Tesla Battery Day and featuring the unveiled tabless battery cell, Battery Day Tee celebrates the future of energy storage and cell manufacturing. Designed for fit, comfort and style, Battery Day Tee is made from 100% cotton with a stylized cell printed across the chest. Made in Peru.',
      images: ['1633802-00-A_0_2000.jpg', '1633802-00-A_2.jpg'],
      price: 30,
      slug: 'men_battery_day_tee',
      categories: ['men', 'men-shirts'],
      tags: ['shirt', 'battery'],
      brand: 'tesla',
      attributes: { material: '100% cotton' },
      variants: [
        {
          color: 'White',
          stockBySize: { XS: 6, S: 17, XXL: 18 },
          images: ['1633802-00-A_0_2000.jpg', '1633802-00-A_2.jpg'],
        },
        {
          color: 'Red',
          stockBySize: { XS: 8, S: 17, XXL: 19 },
          images: ['1633802-00-A_0_2000.jpg', '1633802-00-A_2.jpg'],
        },
      ],
    },
    {
      title: "Men's Cybertruck Bulletproof Tee",
      description:
        'Designed for exceptional comfort and inspired by the Cybertruck unveil event, the Cybertruck Bulletproof Tee is made from 100% cotton and features our signature Cybertruck icon on the back.',
      images: ['7654399-00-A_0_2000.jpg', '7654399-00-A_1.jpg'],
      price: 30,
      slug: 'men_cybertruck_bulletproof_tee',
      categories: ['men', 'men-shirts'],
      tags: ['shirt', 'cybertruck'],
      brand: 'cybertruck',
      attributes: { material: '100% cotton' },
      variants: [
        {
          color: 'Yellow',
          stockBySize: { M: 16, L: 7 },
          images: ['7654399-00-A_0_2000.jpg', '7654399-00-A_1.jpg'],
        },
        {
          color: 'Blue',
          stockBySize: { M: 7, L: 19 },
          images: ['7654399-00-A_0_2000.jpg', '7654399-00-A_1.jpg'],
        },
      ],
    },
    {
      title: "Men's Haha Yes Tee",
      description:
        'Inspired by the Model Y order confirmation graphic, the limited edition Haha Yes Tee is designed for comfort and style. Made from 100% Peruvian cotton and featuring the Tesla wordmark across the chest, the exclusive tee will commemorate your order for years to come.',
      images: ['7652410-00-A_0.jpg', '7652410-00-A_1_2000.jpg'],
      price: 35,
      slug: 'men_haha_yes_tee',
      categories: ['men', 'men-shirts'],
      tags: ['shirt', 'limited edition'],
      brand: 'tesla',
      attributes: { material: '100% Peruvian cotton' },
      variants: [
        {
          color: 'Green',
          stockBySize: { XS: 18, S: 17, M: 18, L: 3, XL: 0, XXL: 12 },
          images: ['7652410-00-A_0.jpg', '7652410-00-A_1_2000.jpg'],
        },
        {
          color: 'Black',
          stockBySize: { XS: 13, S: 13, M: 0, L: 13, XL: 0, XXL: 2 },
          images: ['7652410-00-A_0.jpg', '7652410-00-A_1_2000.jpg'],
        },
      ],
    },
    {
      title: "Men's S3XY Tee",
      description:
        'Designed for fit, comfort and style, the limited edition S3XY Tee is made from 100% cotton with a 3D silicone-printed "S3XY" logo across the chest. Made in Peru.',
      images: ['8764600-00-A_0_2000.jpg', '8764600-00-A_2.jpg'],
      price: 35,
      slug: 'men_s3xy_tee',
      categories: ['men', 'men-shirts'],
      tags: ['shirt', 'limited edition'],
      brand: 'tesla',
      attributes: { material: '100% cotton' },
      variants: [
        {
          color: 'Blue',
          stockBySize: { XS: 15, S: 11, M: 18, L: 5 },
          images: ['8764600-00-A_0_2000.jpg', '8764600-00-A_2.jpg'],
        },
        {
          color: 'White',
          stockBySize: { XS: 14, S: 5, M: 2, L: 6 },
          images: ['8764600-00-A_0_2000.jpg', '8764600-00-A_2.jpg'],
        },
      ],
    },
    {
      title: "Men's 3D Wordmark Long Sleeve Tee",
      description:
        "Designed for fit, comfort and style, the Men's 3D Wordmark Long Sleeve Tee is made from 100% cotton and features an understated wordmark logo on the left chest.",
      images: ['8764813-00-A_0_2000.jpg', '8764813-00-A_1.jpg'],
      price: 40,
      slug: 'men_3d_wordmark_long_sleeve_tee',
      categories: ['men', 'men-shirts'],
      tags: ['shirt', 'long sleeve'],
      brand: 'tesla',
      attributes: { material: '100% cotton' },
      variants: [
        {
          color: 'Green',
          stockBySize: { XL: 10, XXL: 5 },
          images: ['8764813-00-A_0_2000.jpg', '8764813-00-A_1.jpg'],
        },
        {
          color: 'Yellow',
          stockBySize: { XL: 16, XXL: 18 },
          images: ['8764813-00-A_0_2000.jpg', '8764813-00-A_1.jpg'],
        },
      ],
    },
    {
      title: "Men's 3D T Logo Long Sleeve Tee",
      description:
        "Designed for fit, comfort and style, the Men's 3D T Logo Long Sleeve Tee is made from 100% cotton and features an understated T logo on the left chest.",
      images: ['8529198-00-A_0_2000.jpg', '8529198-00-A_1.jpg'],
      price: 40,
      slug: 'men_3d_t_logo_long_sleeve_tee',
      categories: ['men', 'men-shirts'],
      tags: ['shirt', 'long sleeve'],
      brand: 'tesla',
      attributes: { material: '100% cotton' },
      variants: [
        {
          color: 'Green',
          stockBySize: { XS: 18, XXL: 0 },
          images: ['8529198-00-A_0_2000.jpg', '8529198-00-A_1.jpg'],
        },
        {
          color: 'Blue',
          stockBySize: { XS: 17, XXL: 16 },
          images: ['8529198-00-A_0_2000.jpg', '8529198-00-A_1.jpg'],
        },
      ],
    },
    {
      title: "Men's Raven Lightweight Hoodie",
      description:
        "Introducing the Tesla Raven Collection. The Men's Raven Lightweight Hoodie has a premium, relaxed silhouette made from a sustainable bamboo cotton blend. The hoodie features subtle thermoplastic polyurethane Tesla logos across the chest and on the sleeve with a french terry interior for versatility in any season. Made from 70% bamboo and 30% cotton.",
      images: ['1740245-00-A_0_2000.jpg', '1740245-00-A_1.jpg'],
      price: 115,
      slug: 'men_raven_lightweight_hoodie',
      categories: ['men', 'men-hoodies'],
      tags: ['hoodie', 'raven'],
      brand: 'raven-collection',
      attributes: { material: '70% bamboo and 30% cotton' },
      variants: [
        {
          color: 'Yellow',
          stockBySize: { XS: 10, S: 2, M: 17, L: 16, XL: 13, XXL: 17 },
          images: ['1740245-00-A_0_2000.jpg', '1740245-00-A_1.jpg'],
        },
        {
          color: 'Blue',
          stockBySize: { XS: 19, S: 3, M: 5, L: 3, XL: 15, XXL: 3 },
          images: ['1740245-00-A_0_2000.jpg', '1740245-00-A_1.jpg'],
        },
      ],
    },
    {
      title: 'Chill Pullover Hoodie',
      description:
        'Introducing the Tesla Chill Collection. The Chill Pullover Hoodie has a premium, heavyweight exterior and soft fleece interior for comfort in any season. The unisex hoodie features subtle thermoplastic polyurethane Tesla logos across the chest and on the sleeve, a double layer single seam hood and pockets with custom matte zipper pulls. Made from 60% cotton and 40% recycled polyester.',
      images: ['1740051-00-A_0_2000.jpg', '1740051-00-A_1.jpg'],
      price: 130,
      slug: 'chill_pullover_hoodie',
      categories: ['unisex', 'unisex-hoodies'],
      tags: ['hoodie', 'chill'],
      brand: 'chill-collection',
      attributes: { material: '60% cotton and 40% recycled polyester' },
      variants: [
        {
          color: 'Yellow',
          stockBySize: { XS: 9, S: 19, M: 4, L: 1, XL: 5, XXL: 12 },
          images: ['1740051-00-A_0_2000.jpg', '1740051-00-A_1.jpg'],
        },
        {
          color: 'Blue',
          stockBySize: { XS: 6, S: 5, M: 3, L: 18, XL: 6, XXL: 2 },
          images: ['1740051-00-A_0_2000.jpg', '1740051-00-A_1.jpg'],
        },
      ],
    },
    {
      title: "Men's Chill Full Zip Hoodie",
      description:
        "Introducing the Tesla Chill Collection. The Men's Chill Full Zip Hoodie has a premium, heavyweight exterior and soft fleece interior for comfort in any season. The hoodie features subtle thermoplastic polyurethane Tesla logos on the left chest and sleeve, a double layer single seam hood and pockets with custom matte zipper pulls. Made from 60% cotton and 40% recycled polyester.",
      images: ['1741111-00-A_0_2000.jpg', '1741111-00-A_1.jpg'],
      price: 85,
      slug: 'men_chill_full_zip_hoodie',
      categories: ['men', 'men-hoodies'],
      tags: ['hoodie', 'chill'],
      brand: 'chill-collection',
      attributes: { material: '60% cotton and 40% recycled polyester' },
      variants: [
        {
          color: 'Yellow',
          stockBySize: { XS: 2, L: 19, XL: 3, XXL: 14 },
          images: ['1741111-00-A_0_2000.jpg', '1741111-00-A_1.jpg'],
        },
        {
          color: 'White',
          stockBySize: { XS: 10, L: 6, XL: 19, XXL: 9 },
          images: ['1741111-00-A_0_2000.jpg', '1741111-00-A_1.jpg'],
        },
      ],
    },
    {
      title: "Men's Chill Quarter Zip Pullover - Gray",
      description:
        "Introducing the Tesla Chill Collection. The Men's Chill Quarter Zip Pullover has a premium, heavyweight exterior and soft fleece interior for comfort in any season. The pullover features subtle thermoplastic polyurethane Tesla logos on the left chest and below the back collar, as well as a custom matte zipper pull. Made from 60% cotton and 40% recycled polyester.",
      images: ['1740140-00-A_0_2000.jpg', '1740140-00-A_1.jpg'],
      price: 85,
      slug: 'men_chill_quarter_zip_pullover_gray',
      categories: ['men', 'men-shirts'],
      tags: ['pullover', 'chill'],
      brand: 'chill-collection',
      attributes: { material: '60% cotton and 40% recycled polyester' },
      variants: [
        {
          color: 'Black',
          stockBySize: { XS: 16, S: 11, M: 17 },
          images: ['1740140-00-A_0_2000.jpg', '1740140-00-A_1.jpg'],
        },
        {
          color: 'Red',
          stockBySize: { XS: 1, S: 19, M: 15 },
          images: ['1740140-00-A_0_2000.jpg', '1740140-00-A_1.jpg'],
        },
      ],
    },
    {
      title: "Men's Chill Quarter Zip Pullover - White",
      description:
        "Introducing the Tesla Chill Collection. The Men's Chill Quarter Zip Pullover has a premium, heavyweight exterior and soft fleece interior for comfort in any season. The pullover features subtle thermoplastic polyurethane Tesla logos on the left chest and below the back collar, as well as a custom matte zipper pull. Made from 60% cotton and 40% recycled polyester.",
      images: ['1740145-00-A_2_2000.jpg', '1740145-00-A_1.jpg'],
      price: 85,
      slug: 'men_chill_quarter_zip_pullover_white',
      categories: ['men', 'men-shirts'],
      tags: ['pullover', 'chill'],
      brand: 'chill-collection',
      attributes: { material: '60% cotton and 40% recycled polyester' },
      variants: [
        {
          color: 'Red',
          stockBySize: { XS: 17, S: 2, M: 15, L: 16 },
          images: ['1740145-00-A_2_2000.jpg', '1740145-00-A_1.jpg'],
        },
        {
          color: 'Blue',
          stockBySize: { XS: 1, S: 12, M: 6, L: 7 },
          images: ['1740145-00-A_2_2000.jpg', '1740145-00-A_1.jpg'],
        },
      ],
    },
    {
      title: '3D Large Wordmark Pullover Hoodie',
      description:
        'The Unisex 3D Large Wordmark Pullover Hoodie features soft fleece and an adjustable, jersey-lined hood for comfort and coverage. Designed in a unisex style, the pullover hoodie includes a tone-on-tone 3D silicone-printed wordmark across the chest.',
      images: ['8529107-00-A_0_2000.jpg', '8529107-00-A_1.jpg'],
      price: 70,
      slug: '3d_large_wordmark_pullover_hoodie',
      categories: ['unisex', 'unisex-hoodies'],
      tags: ['hoodie'],
      brand: 'tesla',
      variants: [
        {
          color: 'Blue',
          stockBySize: { XS: 7, S: 3, XL: 2, XXL: 5 },
          images: ['8529107-00-A_0_2000.jpg', '8529107-00-A_1.jpg'],
        },
        {
          color: 'Yellow',
          stockBySize: { XS: 14, S: 18, XL: 0, XXL: 10 },
          images: ['8529107-00-A_0_2000.jpg', '8529107-00-A_1.jpg'],
        },
      ],
    },
    {
      title: 'Cybertruck Graffiti Hoodie',
      description:
        'As with the iconic Tesla logo, the Cybertruck Graffiti Hoodie is a classic in the making. Unisex style featuring soft fleece and an adjustable, jersey-lined hood for comfortable coverage.',
      images: ['7654420-00-A_0_2000.jpg', '7654420-00-A_1_2000.jpg'],
      price: 60,
      slug: 'cybertruck_graffiti_hoodie',
      categories: ['unisex', 'unisex-hoodies'],
      tags: ['hoodie', 'cybertruck'],
      brand: 'cybertruck',
      variants: [
        {
          color: 'Green',
          stockBySize: { XS: 9, S: 3, M: 8, L: 4, XL: 14, XXL: 2 },
          images: ['7654420-00-A_0_2000.jpg', '7654420-00-A_1_2000.jpg'],
        },
        {
          color: 'Red',
          stockBySize: { XS: 11, S: 5, M: 8, L: 11, XL: 18, XXL: 7 },
          images: ['7654420-00-A_0_2000.jpg', '7654420-00-A_1_2000.jpg'],
        },
      ],
    },
    {
      title: 'Relaxed T Logo Hat',
      description:
        'The Relaxed T Logo Hat is a classic silhouette combined with modern details, featuring a 3D T logo and a custom metal buckle closure. The ultrasoft design is flexible and abrasion resistant, while the inner sweatband includes quilted padding for extra comfort and moisture wicking. The visor is fully made from recycled plastic bottles. 100% Cotton.',
      images: ['1657932-00-A_0_2000.jpg', '1657932-00-A_1.jpg'],
      price: 30,
      slug: 'relaxed_t_logo_hat',
      categories: ['unisex', 'unisex-hats'],
      tags: ['hat', 'cap'],
      brand: 'tesla',
      attributes: { material: '100% Cotton' },
      variants: [
        {
          color: 'Yellow',
          stockBySize: { XS: 9, S: 3, M: 3, L: 1, XL: 10, XXL: 15 },
          images: ['1657932-00-A_0_2000.jpg', '1657932-00-A_1.jpg'],
        },
        {
          color: 'Green',
          stockBySize: { XS: 4, S: 19, M: 13, L: 2, XL: 6, XXL: 19 },
          images: ['1657932-00-A_0_2000.jpg', '1657932-00-A_1.jpg'],
        },
      ],
    },
    {
      title: 'Thermal Cuffed Beanie',
      description:
        'The Thermal Cuffed Beanie is perfect for cold weather. Features a classic cuffed design with embroidered Tesla wordmark.',
      images: ['1740417-00-A_0_2000.jpg', '1740417-00-A_1.jpg'],
      price: 35,
      slug: 'thermal_cuffed_beanie',
      categories: ['unisex', 'unisex-hats'],
      tags: ['beanie', 'winter'],
      brand: 'tesla',
      attributes: { material: '100% Cotton' },
      variants: [
        {
          color: 'Blue',
          stockBySize: { XS: 10, S: 16, M: 18, L: 15, XL: 1, XXL: 17 },
          images: ['1740417-00-A_0_2000.jpg', '1740417-00-A_1.jpg'],
        },
        {
          color: 'White',
          stockBySize: { XS: 3, S: 16, M: 12, L: 13, XL: 12, XXL: 11 },
          images: ['1740417-00-A_0_2000.jpg', '1740417-00-A_1.jpg'],
        },
      ],
    },
    {
      title: "Women's Cropped Puffer Jacket",
      description:
        "The Women's Cropped Puffer Jacket features a uniquely cropped silhouette for the perfect, modern style while on the go during the cozy season ahead. The puffer features subtle silicone injected Tesla logos below the back collar and on the right sleeve, custom matte metal zipper pulls and a soft, fleece lined collar. Made from 87% nylon and 13% polyurethane.",
      images: ['1740535-00-A_0_2000.jpg', '1740535-00-A_1.jpg'],
      price: 225,
      slug: 'women_cropped_puffer_jacket',
      categories: ['women', 'women-hoodies'],
      tags: ['jacket', 'puffer'],
      brand: 'tesla',
      attributes: { material: '87% nylon and 13% polyurethane' },
      variants: [
        {
          color: 'Red',
          stockBySize: { XS: 4, S: 5, M: 12 },
          images: ['1740535-00-A_0_2000.jpg', '1740535-00-A_1.jpg'],
        },
        {
          color: 'Black',
          stockBySize: { XS: 12, S: 12, M: 18 },
          images: ['1740535-00-A_0_2000.jpg', '1740535-00-A_1.jpg'],
        },
      ],
    },
    {
      title: "Women's Chill Half Zip Cropped Hoodie",
      description:
        "Introducing the Tesla Chill Collection. The Women's Chill Half Zip Cropped Hoodie has a premium, soft fleece exterior and cropped silhouette for comfort in everyday lifestyle. The hoodie features an elastic hem that gathers at the waist, subtle thermoplastic polyurethane Tesla logos along the hood and on the sleeve, a double layer single seam hood and a custom ring zipper pull. Made from 60% cotton and 40% recycled polyester.",
      images: ['1740226-00-A_0_2000.jpg', '1740226-00-A_1.jpg'],
      price: 130,
      slug: 'women_chill_half_zip_cropped_hoodie',
      categories: ['women', 'women-hoodies'],
      tags: ['hoodie', 'chill', 'cropped'],
      brand: 'chill-collection',
      attributes: { material: '60% cotton and 40% recycled polyester' },
      variants: [
        {
          color: 'Red',
          stockBySize: { XS: 6, S: 5, M: 3, XXL: 10 },
          images: ['1740226-00-A_0_2000.jpg', '1740226-00-A_1.jpg'],
        },
        {
          color: 'Black',
          stockBySize: { XS: 9, S: 9, M: 15, XXL: 12 },
          images: ['1740226-00-A_0_2000.jpg', '1740226-00-A_1.jpg'],
        },
      ],
    },
    {
      title: "Women's Raven Slouchy Crew Sweatshirt",
      description:
        "Introducing the Tesla Raven Collection. The Women's Raven Slouchy Crew Sweatshirt has a premium, relaxed silhouette made from a sustainable bamboo cotton blend. The slouchy crew features a subtle thermoplastic polyurethane Tesla wordmark on the left sleeve and a french terry interior for a cozy look and feel in every season. Pair it with your Raven Joggers or favorite on the go fit. Made from 70% bamboo and 30% cotton.",
      images: ['1740260-00-A_0_2000.jpg', '1740260-00-A_1.jpg'],
      price: 110,
      slug: 'women_raven_slouchy_crew_sweatshirt',
      categories: ['women', 'women-hoodies'],
      tags: ['sweatshirt', 'raven'],
      brand: 'raven-collection',
      attributes: { material: '70% bamboo and 30% cotton' },
      variants: [
        {
          color: 'Yellow',
          stockBySize: { XS: 0, S: 16, M: 5, L: 3, XL: 5, XXL: 6 },
          images: ['1740260-00-A_0_2000.jpg', '1740260-00-A_1.jpg'],
        },
        {
          color: 'White',
          stockBySize: { XS: 3, S: 13, M: 16, L: 3, XL: 19, XXL: 3 },
          images: ['1740260-00-A_0_2000.jpg', '1740260-00-A_1.jpg'],
        },
      ],
    },
    {
      title: "Women's Turbine Cropped Long Sleeve Tee",
      description:
        "Introducing the Tesla Turbine Collection. Designed for style, comfort and everyday lifestyle, the Women's Turbine Cropped Long Sleeve Tee features a subtle, water-based Tesla wordmark across the chest and our T logo below the back collar. The lightweight material is double-dyed, creating a soft, casual style with a cropped silhouette. Made from 50% cotton and 50% polyester.",
      images: ['1740290-00-A_0_2000.jpg', '1740290-00-A_1.jpg'],
      price: 45,
      slug: 'women_turbine_cropped_long_sleeve_tee',
      categories: ['women', 'women-shirts'],
      tags: ['shirt', 'turbine', 'cropped'],
      brand: 'turbine-collection',
      attributes: { material: '50% cotton and 50% polyester' },
      variants: [
        {
          color: 'Red',
          stockBySize: { XS: 12, S: 7, M: 7, L: 0, XL: 9, XXL: 11 },
          images: ['1740290-00-A_0_2000.jpg', '1740290-00-A_1.jpg'],
        },
        {
          color: 'Black',
          stockBySize: { XS: 3, S: 10, M: 8, L: 0, XL: 6, XXL: 14 },
          images: ['1740290-00-A_0_2000.jpg', '1740290-00-A_1.jpg'],
        },
      ],
    },
    {
      title: "Women's Turbine Cropped Short Sleeve Tee",
      description:
        "Introducing the Tesla Turbine Collection. Designed for style, comfort and everyday lifestyle, the Women's Turbine Cropped Short Sleeve Tee features a subtle, water-based Tesla wordmark across the chest and our T logo below the back collar. The lightweight material is double-dyed, creating a soft, casual style with a cropped silhouette. Made from 50% cotton and 50% polyester.",
      images: ['1741441-00-A_0_2000.jpg', '1741441-00-A_1.jpg'],
      price: 40,
      slug: 'women_turbine_cropped_short_sleeve_tee',
      categories: ['women', 'women-shirts'],
      tags: ['shirt', 'turbine', 'cropped'],
      brand: 'turbine-collection',
      attributes: { material: '50% cotton and 50% polyester' },
      variants: [
        {
          color: 'White',
          stockBySize: { XS: 11, S: 18 },
          images: ['1741441-00-A_0_2000.jpg', '1741441-00-A_1.jpg'],
        },
        {
          color: 'Blue',
          stockBySize: { XS: 1, S: 6 },
          images: ['1741441-00-A_0_2000.jpg', '1741441-00-A_1.jpg'],
        },
      ],
    },
    {
      title: "Women's T Logo Short Sleeve Scoop Neck Tee",
      description:
        "Designed for style and comfort, the ultrasoft Women's T Logo Short Sleeve Scoop Neck Tee features a tonal 3D silicone-printed T logo on the left chest. Made of 50% Peruvian cotton and 50% Peruvian viscose.",
      images: ['8765090-00-A_0_2000.jpg', '8765090-00-A_1.jpg'],
      price: 35,
      slug: 'women_t_logo_short_sleeve_scoop_neck_tee',
      categories: ['women', 'women-shirts'],
      tags: ['shirt'],
      brand: 'tesla',
      attributes: { material: '50% Peruvian cotton and 50% Peruvian viscose' },
      variants: [
        {
          color: 'Yellow',
          stockBySize: { XS: 12, S: 4, M: 10, L: 1, XL: 1, XXL: 8 },
          images: ['8765090-00-A_0_2000.jpg', '8765090-00-A_1.jpg'],
        },
        {
          color: 'Black',
          stockBySize: { XS: 18, S: 3, M: 5, L: 10, XL: 11, XXL: 0 },
          images: ['8765090-00-A_0_2000.jpg', '8765090-00-A_1.jpg'],
        },
      ],
    },
    {
      title: "Women's T Logo Long Sleeve Scoop Neck Tee",
      description:
        "Designed for style and comfort, the ultrasoft Women's T Logo Long Sleeve Scoop Neck Tee features a tonal 3D silicone-printed T logo on the left chest. Made of 50% Peruvian cotton and 50% Peruvian viscose.",
      images: ['8765100-00-A_0_2000.jpg', '8765100-00-A_1.jpg'],
      price: 40,
      slug: 'women_t_logo_long_sleeve_scoop_neck_tee',
      categories: ['women', 'women-shirts'],
      tags: ['shirt', 'long sleeve'],
      brand: 'tesla',
      attributes: { material: '50% Peruvian cotton and 50% Peruvian viscose' },
      variants: [
        {
          color: 'White',
          stockBySize: { XS: 1, S: 0, L: 3, XL: 8, XXL: 9 },
          images: ['8765100-00-A_0_2000.jpg', '8765100-00-A_1.jpg'],
        },
        {
          color: 'Black',
          stockBySize: { XS: 1, S: 18, L: 9, XL: 12, XXL: 3 },
          images: ['8765100-00-A_0_2000.jpg', '8765100-00-A_1.jpg'],
        },
      ],
    },
    {
      title: "Women's Small Wordmark Short Sleeve V-Neck Tee",
      description:
        "Designed for style and comfort, the Women's Small Wordmark Short Sleeve V-Neck Tee features a tonal 3D silicone-printed wordmark on the left chest. Made of 100% Peruvian cotton.",
      images: ['8765120-00-A_0_2000.jpg', '8765120-00-A_1.jpg'],
      price: 35,
      slug: 'women_small_wordmark_short_sleeve_v_neck_tee',
      categories: ['women', 'women-shirts'],
      tags: ['shirt', 'v-neck'],
      brand: 'tesla',
      attributes: { material: '100% Peruvian cotton' },
      variants: [
        {
          color: 'White',
          stockBySize: { XS: 9, S: 8, M: 10, L: 9, XL: 5, XXL: 8 },
          images: ['8765120-00-A_0_2000.jpg', '8765120-00-A_1.jpg'],
        },
        {
          color: 'Red',
          stockBySize: { XS: 0, S: 0, M: 0, L: 16, XL: 15, XXL: 8 },
          images: ['8765120-00-A_0_2000.jpg', '8765120-00-A_1.jpg'],
        },
      ],
    },
    {
      title: "Women's Large Wordmark Short Sleeve Crew Neck Tee",
      description:
        "Designed for style and comfort, the Women's Large Wordmark Short Sleeve Crew Neck Tee features a tonal 3D silicone-printed wordmark across the chest. Made of 100% Peruvian pima cotton.",
      images: ['8765115-00-A_0_2000.jpg', '8765115-00-A_1.jpg'],
      price: 35,
      slug: 'women_large_wordmark_short_sleeve_crew_neck_tee',
      categories: ['women', 'women-shirts'],
      tags: ['shirt'],
      brand: 'tesla',
      attributes: { material: '100% Peruvian pima cotton' },
      variants: [
        {
          color: 'Green',
          stockBySize: { XL: 17, XXL: 5 },
          images: ['8765115-00-A_0_2000.jpg', '8765115-00-A_1.jpg'],
        },
        {
          color: 'Yellow',
          stockBySize: { XL: 16, XXL: 16 },
          images: ['8765115-00-A_0_2000.jpg', '8765115-00-A_1.jpg'],
        },
      ],
    },
    {
      title: "Women's Plaid Mode Tee",
      description:
        "Designed to celebrate Tesla's incredible performance mode, the Plaid Mode Tee features great fit, comfort and style. Made from 100% cotton, it's the next best thing to riding shotgun at the Nürburgring.",
      images: ['1549275-00-A_0_2000.jpg', '1549275-00-A_1.jpg'],
      price: 35,
      slug: 'women_plaid_mode_tee',
      categories: ['women', 'women-shirts'],
      tags: ['shirt', 'plaid'],
      brand: 'tesla',
      attributes: { material: '100% cotton' },
      variants: [
        {
          color: 'Blue',
          stockBySize: { S: 14, M: 13 },
          images: ['1549275-00-A_0_2000.jpg', '1549275-00-A_1.jpg'],
        },
        {
          color: 'Red',
          stockBySize: { S: 5, M: 17 },
          images: ['1549275-00-A_0_2000.jpg', '1549275-00-A_1.jpg'],
        },
      ],
    },
    {
      title: "Women's Powerwall Tee",
      description:
        "Inspired by our popular home battery, the Tesla Powerwall Tee is made from 100% cotton and features the phrase 'Pure Energy' under our signature logo in the back. Designed for fit, comfort and style, the exclusive tee promotes sustainable energy in any environment.",
      images: ['9877040-00-A_0_2000.jpg', '9877040-00-A_1.jpg'],
      price: 130,
      slug: 'women_powerwall_tee',
      categories: ['women', 'women-shirts'],
      tags: ['shirt', 'powerwall'],
      brand: 'tesla',
      attributes: { material: '100% cotton' },
      variants: [
        {
          color: 'Blue',
          stockBySize: { XS: 19, S: 8, M: 11, L: 2, XL: 11, XXL: 18 },
          images: ['9877040-00-A_0_2000.jpg', '9877040-00-A_1.jpg'],
        },
        {
          color: 'Red',
          stockBySize: { XS: 7, S: 19, M: 6, L: 7, XL: 15, XXL: 7 },
          images: ['9877040-00-A_0_2000.jpg', '9877040-00-A_1.jpg'],
        },
      ],
    },
    {
      title: "Women's Corp Jacket",
      description:
        "Fully customized and uniquely styled, the Women's Corp Jacket features a silicone-printed 'T' logo on the left chest and prominent Tesla wordmark across the back.",
      images: ['5645680-00-A_0_2000.jpg', '5645680-00-A_3.jpg'],
      price: 90,
      slug: 'women_corp_jacket',
      categories: ['women', 'women-shirts'],
      tags: ['jacket'],
      brand: 'tesla',
      variants: [
        {
          color: 'Blue',
          stockBySize: { M: 11, L: 1, XL: 7, XXL: 7 },
          images: ['5645680-00-A_0_2000.jpg', '5645680-00-A_3.jpg'],
        },
        {
          color: 'Yellow',
          stockBySize: { M: 5, L: 5, XL: 6, XXL: 7 },
          images: ['5645680-00-A_0_2000.jpg', '5645680-00-A_3.jpg'],
        },
      ],
    },
    {
      title: "Women's Raven Joggers",
      description:
        "Introducing the Tesla Raven Collection. The Women's Raven Joggers have a premium, relaxed silhouette made from a sustainable bamboo cotton blend. The joggers feature a subtle thermoplastic polyurethane Tesla wordmark and T logo and a french terry interior for a cozy look and feel in every season. Pair them with your Raven Slouchy Crew Sweatshirt, Raven Lightweight Zip Up Jacket or other favorite on the go fit. Made from 70% bamboo and 30% cotton.",
      images: ['1740270-00-A_0_2000.jpg', '1740270-00-A_1.jpg'],
      price: 100,
      slug: 'women_raven_joggers',
      categories: ['women', 'women-shirts'],
      tags: ['joggers', 'raven'],
      brand: 'raven-collection',
      attributes: { material: '70% bamboo and 30% cotton' },
      variants: [
        {
          color: 'Blue',
          stockBySize: { XS: 4, S: 17, M: 7, L: 13, XL: 14, XXL: 5 },
          images: ['1740270-00-A_0_2000.jpg', '1740270-00-A_1.jpg'],
        },
        {
          color: 'Yellow',
          stockBySize: { XS: 19, S: 17, M: 19, L: 17, XL: 14, XXL: 12 },
          images: ['1740270-00-A_0_2000.jpg', '1740270-00-A_1.jpg'],
        },
      ],
    },
    {
      title: 'Kids Cybertruck Long Sleeve Tee',
      description:
        'Designed for fit, comfort and style, the Kids Cybertruck Graffiti Long Sleeve Tee features a water-based Cybertruck graffiti wordmark across the chest, a Tesla wordmark down the left arm and our signature T logo on the back collar. Made from 50% cotton and 50% polyester.',
      images: ['1742694-00-A_1_2000.jpg', '1742694-00-A_3.jpg'],
      price: 30,
      slug: 'kids_cybertruck_long_sleeve_tee',
      categories: ['kids', 'kids-shirts'],
      tags: ['shirt', 'cybertruck', 'long sleeve'],
      brand: 'cybertruck',
      attributes: { material: '50% cotton and 50% polyester' },
      variants: [
        {
          color: 'Blue',
          stockBySize: { XS: 13, S: 13, M: 4 },
          images: ['1742694-00-A_1_2000.jpg', '1742694-00-A_3.jpg'],
        },
        {
          color: 'Yellow',
          stockBySize: { XS: 19, S: 12, M: 8 },
          images: ['1742694-00-A_1_2000.jpg', '1742694-00-A_3.jpg'],
        },
      ],
    },
    {
      title: 'Kids Scribble T Logo Tee',
      description:
        'The Kids Scribble T Logo Tee is made from 100% Peruvian cotton and features a Tesla T sketched logo for every young artist to wear.',
      images: ['8529312-00-A_0_2000.jpg', '8529312-00-A_1.jpg'],
      price: 25,
      slug: 'kids_scribble_t_logo_tee',
      categories: ['kids', 'kids-shirts'],
      tags: ['shirt'],
      brand: 'tesla',
      attributes: { material: '100% Peruvian cotton' },
      variants: [
        {
          color: 'Blue',
          stockBySize: { XS: 8, S: 2, M: 12 },
          images: ['8529312-00-A_0_2000.jpg', '8529312-00-A_1.jpg'],
        },
        {
          color: 'Yellow',
          stockBySize: { XS: 19, S: 8, M: 9 },
          images: ['8529312-00-A_0_2000.jpg', '8529312-00-A_1.jpg'],
        },
      ],
    },
    {
      title: 'Kids Cybertruck Tee',
      description:
        'The Kids Cybertruck Tee features the iconic Cybertruck graffiti wordmark and is made from 100% Peruvian cotton for maximum comfort.',
      images: ['8529342-00-A_0_2000.jpg', '8529342-00-A_1.jpg'],
      price: 25,
      slug: 'kids_cybertruck_tee',
      categories: ['kids', 'kids-shirts'],
      tags: ['shirt', 'cybertruck'],
      brand: 'cybertruck',
      attributes: { material: '100% Peruvian cotton' },
      variants: [
        {
          color: 'Red',
          stockBySize: { XS: 11, S: 19, M: 8 },
          images: ['8529342-00-A_0_2000.jpg', '8529342-00-A_1.jpg'],
        },
        {
          color: 'Black',
          stockBySize: { XS: 8, S: 7, M: 19 },
          images: ['8529342-00-A_0_2000.jpg', '8529342-00-A_1.jpg'],
        },
      ],
    },
    {
      title: 'Kids Racing Stripe Tee',
      description:
        "The refreshed Kids Racing Stripe Tee is made from 100% Peruvian cotton, featuring a newly enhanced racing stripe with a brushed Tesla wordmark that's perfect for any speed racer.",
      images: ['8529354-00-A_0_2000.jpg', '8529354-00-A_1.jpg'],
      price: 30,
      slug: 'kids_racing_stripe_tee',
      categories: ['kids', 'kids-shirts'],
      tags: ['shirt', 'racing'],
      brand: 'tesla',
      attributes: { material: '100% Peruvian cotton' },
      variants: [
        {
          color: 'White',
          stockBySize: { XS: 10, S: 2, M: 15 },
          images: ['8529354-00-A_0_2000.jpg', '8529354-00-A_1.jpg'],
        },
        {
          color: 'Blue',
          stockBySize: { XS: 3, S: 7, M: 0 },
          images: ['8529354-00-A_0_2000.jpg', '8529354-00-A_1.jpg'],
        },
      ],
    },
    {
      title: 'Kids 3D T Logo Tee',
      description:
        'Designed for fit, comfort and style, the Tesla T Logo Tee is made from 100% Peruvian cotton and features a silicone-printed T Logo on the left chest.',
      images: ['7652465-00-A_0_2000.jpg', '7652465-00-A_1.jpg'],
      price: 30,
      slug: 'kids_3d_t_logo_tee',
      categories: ['kids', 'kids-shirts'],
      tags: ['shirt'],
      brand: 'tesla',
      attributes: { material: '100% Peruvian cotton' },
      variants: [
        {
          color: 'Black',
          stockBySize: { XS: 18, S: 17, M: 3 },
          images: ['7652465-00-A_0_2000.jpg', '7652465-00-A_1.jpg'],
        },
        {
          color: 'Blue',
          stockBySize: { XS: 5, S: 7, M: 14 },
          images: ['7652465-00-A_0_2000.jpg', '7652465-00-A_1.jpg'],
        },
      ],
    },
    {
      title: 'Kids Checkered Tee',
      description:
        'The checkered tee is made from long grain, GMO free Peruvian cotton. Peru is the only country in the world where cotton is picked by hand on a large scale. The 4,500-year-old tradition prevents damage to the fiber during the picking process and removes the need to use chemicals to open the cotton plants before harvest. This environmentally friendly process results in cotton that is soft, strong, and lustrous – and the tee will get even softer with every wash.',
      images: ['100042307_0_2000.jpg', '100042307_alt_2000.jpg'],
      price: 30,
      slug: 'kids_checkered_tee',
      categories: ['kids', 'kids-shirts'],
      tags: ['shirt'],
      brand: 'tesla',
      attributes: { material: '100% Peruvian cotton' },
      variants: [
        {
          color: 'Red',
          stockBySize: { XS: 7, S: 9, M: 10 },
          images: ['100042307_0_2000.jpg', '100042307_alt_2000.jpg'],
        },
        {
          color: 'Blue',
          stockBySize: { XS: 9, S: 2, M: 9 },
          images: ['100042307_0_2000.jpg', '100042307_alt_2000.jpg'],
        },
      ],
    },
    {
      title: 'Made on Earth by Humans Onesie',
      description:
        'For the future space traveler with discerning taste, a soft, cotton onesie with snap closure bottom. Clear labeling provided in case of contact with a new spacefaring civilization. 100% Cotton. Made in Peru',
      images: ['1473809-00-A_1_2000.jpg', '1473809-00-A_alt.jpg'],
      price: 25,
      slug: 'made_on_earth_by_humans_onesie',
      categories: ['kids', 'kids-shirts'],
      tags: ['onesie'],
      brand: 'tesla',
      attributes: { material: '100% Cotton' },
      variants: [
        {
          color: 'White',
          stockBySize: { XS: 4, S: 11 },
          images: ['1473809-00-A_1_2000.jpg', '1473809-00-A_alt.jpg'],
        },
        {
          color: 'Black',
          stockBySize: { XS: 14, S: 1 },
          images: ['1473809-00-A_1_2000.jpg', '1473809-00-A_alt.jpg'],
        },
      ],
    },
    {
      title: 'Scribble T Logo Onesie',
      description:
        'The Kids Scribble T Logo Onesie is made from 100% Peruvian cotton and features a Tesla T sketched logo for every little artist to wear.',
      images: ['8529387-00-A_0_2000.jpg', '8529387-00-A_1.jpg'],
      price: 30,
      slug: 'scribble_t_logo_onesie',
      categories: ['kids', 'kids-shirts'],
      tags: ['onesie'],
      brand: 'tesla',
      attributes: { material: '100% Peruvian cotton' },
      variants: [
        {
          color: 'Red',
          stockBySize: { XS: 1, S: 14 },
          images: ['8529387-00-A_0_2000.jpg', '8529387-00-A_1.jpg'],
        },
        {
          color: 'Yellow',
          stockBySize: { XS: 2, S: 7 },
          images: ['8529387-00-A_0_2000.jpg', '8529387-00-A_1.jpg'],
        },
      ],
    },
    {
      title: 'Zero Emissions (Almost) Onesie',
      description:
        'Show your commitment to sustainable energy with this cheeky onesie for your young one. Note: Does not prevent emissions. 100% Cotton. Made in Peru.',
      images: ['1473834-00-A_2_2000.jpg', '1473829-00-A_2_2000.jpg'],
      price: 30,
      slug: 'zero_emissions_almost_onesie',
      categories: ['kids', 'kids-shirts'],
      tags: ['onesie'],
      brand: 'tesla',
      attributes: { material: '100% Cotton' },
      variants: [
        {
          color: 'Black',
          stockBySize: { XS: 16, S: 12 },
          images: ['1473834-00-A_2_2000.jpg', '1473829-00-A_2_2000.jpg'],
        },
        {
          color: 'Yellow',
          stockBySize: { XS: 19, S: 18 },
          images: ['1473834-00-A_2_2000.jpg', '1473829-00-A_2_2000.jpg'],
        },
      ],
    },
    {
      title: 'Kids Cyberquad Bomber Jacket',
      description:
        'Wear your Kids Cyberquad Bomber Jacket during your adventures on Cyberquad for Kids. The bomber jacket features a graffiti-style illustration of our Cyberquad silhouette and wordmark. With three zippered pockets and our signature T logo and Tesla wordmark printed along the sleeves, Kids Cyberquad Bomber Jacket is perfect for wherever the trail takes you. Made from 60% cotton and 40% polyester.',
      images: ['1742702-00-A_0_2000.jpg', '1742702-00-A_1.jpg'],
      price: 65,
      slug: 'kids_cyberquad_bomber_jacket',
      categories: ['kids', 'kids-jackets'],
      tags: ['jacket', 'cybertruck'],
      brand: 'cybertruck',
      attributes: { material: '60% cotton and 40% polyester' },
      variants: [
        {
          color: 'Yellow',
          stockBySize: { XS: 19, S: 14, M: 7 },
          images: ['1742702-00-A_0_2000.jpg', '1742702-00-A_1.jpg'],
        },
        {
          color: 'Green',
          stockBySize: { XS: 5, S: 9, M: 3 },
          images: ['1742702-00-A_0_2000.jpg', '1742702-00-A_1.jpg'],
        },
      ],
    },
    {
      title: 'Kids Corp Jacket',
      description:
        'Cruise the playground in style with the Kids Corp Jacket. Modeled after the original Tesla Corp Jacket, the Kids Corp Jacket features the same understated style and high-quality materials but at a pint-sized scale.',
      images: ['1506211-00-A_0_2000.jpg', '1506211-00-A_1_2000.jpg'],
      price: 30,
      slug: 'kids_corp_jacket',
      categories: ['kids', 'kids-jackets'],
      tags: ['jacket'],
      brand: 'tesla',
      variants: [
        {
          color: 'Yellow',
          stockBySize: { XS: 14, S: 3, M: 4 },
          images: ['1506211-00-A_0_2000.jpg', '1506211-00-A_1_2000.jpg'],
        },
        {
          color: 'Green',
          stockBySize: { XS: 19, S: 19, M: 2 },
          images: ['1506211-00-A_0_2000.jpg', '1506211-00-A_1_2000.jpg'],
        },
      ],
    },
  ],
};
