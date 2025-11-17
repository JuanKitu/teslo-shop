// seed-database.ts
import { initialData } from './seed';
import { countries } from './seed-countries';
import prisma from '../lib/prisma';

async function main() {
  console.log('🧹 Limpiando base de datos...');

  // Orden correcto de eliminación respetando relaciones
  await prisma.orderAddress.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.userAddress.deleteMany();
  await prisma.user.deleteMany();
  await prisma.country.deleteMany();

  await prisma.productImage.deleteMany();
  await prisma.variantOptionValue.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productVariantOption.deleteMany();
  await prisma.productAttribute.deleteMany();
  await prisma.productCategory.deleteMany();
  await prisma.productBrand.deleteMany();
  await prisma.product.deleteMany();

  await prisma.attributeDefinition.deleteMany();
  await prisma.variantOption.deleteMany();
  await prisma.categoryMedia.deleteMany();
  await prisma.category.deleteMany();
  await prisma.brandMedia.deleteMany();
  await prisma.brand.deleteMany();

  console.log('✅ Base de datos limpiada\n');

  // ===================================
  // PAÍSES Y USUARIOS
  // ===================================
  console.log('🌍 Creando países...');
  await prisma.country.createMany({ data: countries });

  console.log('👥 Creando usuarios...');
  await prisma.user.createMany({ data: initialData.users });

  // ===================================
  // CATEGORÍAS (con jerarquía)
  // ===================================
  console.log('📁 Creando categorías...');
  const categoryMap: Record<string, string> = {};

  // Primero crear categorías padre (sin parentSlug)
  for (const cat of initialData.categories.filter((c) => !c.parentSlug)) {
    const created = await prisma.category.create({
      data: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        isActive: true,
        isFeatured: cat.isFeatured || false,
      },
    });
    categoryMap[cat.slug] = created.id;
  }

  // Luego categorías hijas
  for (const cat of initialData.categories.filter((c) => c.parentSlug)) {
    const created = await prisma.category.create({
      data: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        parentId: cat.parentSlug ? categoryMap[cat.parentSlug] : null,
        isActive: true,
        isFeatured: cat.isFeatured || false,
      },
    });
    categoryMap[cat.slug] = created.id;
  }

  // ===================================
  // MARCAS
  // ===================================
  console.log('🏷️  Creando marcas...');
  const brandMap: Record<string, string> = {};

  for (const brand of initialData.brands) {
    const created = await prisma.brand.create({
      data: {
        name: brand.name,
        slug: brand.slug,
        description: brand.description,
        type: brand.type || 'brand',
        isActive: true,
      },
    });
    brandMap[brand.slug] = created.id;
  }

  // ===================================
  // OPCIONES DE VARIANTE GLOBALES
  // ===================================
  console.log('⚙️  Creando opciones de variante...');

  const colorOption = await prisma.variantOption.create({
    data: {
      name: 'Color',
      slug: 'color',
      type: 'COLOR',
      position: 0,
      isRequired: true,
      isFilterable: true,
    },
  });

  const sizeOption = await prisma.variantOption.create({
    data: {
      name: 'Size',
      slug: 'size',
      type: 'SELECT',
      position: 1,
      isRequired: true,
      isFilterable: true,
    },
  });

  // ===================================
  // ATRIBUTOS DESCRIPTIVOS
  // ===================================
  console.log('📋 Creando definiciones de atributos...');

  const materialAttr = await prisma.attributeDefinition.create({
    data: {
      name: 'Material',
      slug: 'material',
      type: 'TEXT',
      group: 'Specifications',
      order: 0,
      isFilterable: true,
    },
  });

  const weightAttr = await prisma.attributeDefinition.create({
    data: {
      name: 'Weight',
      slug: 'weight',
      type: 'TEXT',
      group: 'Specifications',
      order: 1,
      unit: 'g',
    },
  });

  const careAttr = await prisma.attributeDefinition.create({
    data: {
      name: 'Care Instructions',
      slug: 'care',
      type: 'TEXT',
      group: 'Care',
      order: 0,
    },
  });

  // ===================================
  // PRODUCTOS
  // ===================================
  console.log('🛍️  Creando productos...\n');

  let totalVariantsCreated = 0;

  for (let productIndex = 0; productIndex < initialData.products.length; productIndex++) {
    const product = initialData.products[productIndex];
    const { variants, images, categories, brand, attributes, ...productData } = product;

    console.log(`  📦 ${productIndex + 1}/${initialData.products.length} - ${product.title}`);

    // 1. Crear producto base
    const dbProduct = await prisma.product.create({
      data: {
        ...productData,
        isActive: true,
      },
    });

    // 2. Asociar categorías (múltiples)
    for (let i = 0; i < categories.length; i++) {
      const categorySlug = categories[i];
      if (categoryMap[categorySlug]) {
        await prisma.productCategory.create({
          data: {
            productId: dbProduct.id,
            categoryId: categoryMap[categorySlug],
            isPrimary: i === 0, // la primera es la primaria
            order: i,
          },
        });
      }
    }

    // 3. Asociar marca
    if (brand && brandMap[brand]) {
      await prisma.productBrand.create({
        data: {
          productId: dbProduct.id,
          brandId: brandMap[brand],
          isPrimary: true,
          order: 0,
        },
      });
    }

    // 4. Añadir atributos descriptivos
    if (attributes?.material) {
      await prisma.productAttribute.create({
        data: {
          productId: dbProduct.id,
          attributeId: materialAttr.id,
          valueText: attributes.material,
        },
      });
    }

    if (attributes?.weight) {
      await prisma.productAttribute.create({
        data: {
          productId: dbProduct.id,
          attributeId: weightAttr.id,
          valueText: attributes.weight,
        },
      });
    }

    if (attributes?.care) {
      await prisma.productAttribute.create({
        data: {
          productId: dbProduct.id,
          attributeId: careAttr.id,
          valueText: attributes.care,
        },
      });
    }

    // 5. Imágenes generales del producto
    if (images?.length) {
      const imageData = images.map((url, index) => ({
        url: `/products/${url}`,
        productId: dbProduct.id,
        order: index,
        alt: product.title,
      }));
      await prisma.productImage.createMany({ data: imageData });
    }

    // 6. Recopilar colores y tallas únicos de las variantes
    const uniqueColors = [...new Set(variants.map((v) => v.color))];
    const uniqueSizes = [...new Set(variants.flatMap((v) => Object.keys(v.stockBySize)))];

    // 7. Crear ProductVariantOption para Color
    await prisma.productVariantOption.create({
      data: {
        productId: dbProduct.id,
        optionId: colorOption.id,
        position: 0,
        values: uniqueColors,
      },
    });

    // 8. Crear ProductVariantOption para Size
    await prisma.productVariantOption.create({
      data: {
        productId: dbProduct.id,
        optionId: sizeOption.id,
        position: 1,
        values: uniqueSizes,
      },
    });

    // 9. Crear variantes reales
    let productVariantCount = 0;

    for (const variant of variants) {
      const { color, stockBySize, images: variantImages, sku } = variant;

      for (const [size, stock] of Object.entries(stockBySize)) {
        if (stock === 0) continue;

        // 🆕 Generar SKU único: P001-BLK-XS, P002-GRE-M, etc.
        const colorCode = color.substring(0, 3).toUpperCase();
        const productCode = `P${(productIndex + 1).toString().padStart(3, '0')}`;

        const variantSku = sku
          ? `${sku}-${colorCode}-${size}`
          : `${productCode}-${colorCode}-${size}`;

        // Crear la variante
        const dbVariant = await prisma.productVariant.create({
          data: {
            productId: dbProduct.id,
            sku: variantSku,
            inStock: stock,
            price: null, // usa el precio base del producto
            isActive: true,
          },
        });

        // Crear valores de opciones para esta variante
        await prisma.variantOptionValue.createMany({
          data: [
            {
              variantId: dbVariant.id,
              optionId: colorOption.id,
              value: color,
            },
            {
              variantId: dbVariant.id,
              optionId: sizeOption.id,
              value: size,
            },
          ],
        });

        // Imágenes específicas de la variante (por color)
        if (variantImages?.length) {
          const variantImageData = variantImages.map((url, index) => ({
            url: `/products/${url}`,
            variantId: dbVariant.id,
            order: index,
            alt: `${product.title} - ${color} - ${size}`,
          }));
          await prisma.productImage.createMany({ data: variantImageData });
        }

        productVariantCount++;
        totalVariantsCreated++;
      }
    }

    console.log(`       ✅ ${productVariantCount} variantes creadas`);
  }

  console.log('\n' + '='.repeat(50));
  console.log('✅ Seed ejecutado correctamente\n');
  console.log('📊 Resumen:');
  console.log(`  - ${initialData.users.length} usuarios`);
  console.log(`  - ${initialData.categories.length} categorías`);
  console.log(`  - ${initialData.brands.length} marcas`);
  console.log(`  - ${initialData.products.length} productos`);
  console.log(`  - ${totalVariantsCreated} variantes totales`);
  console.log(`  - 2 opciones de variante (Color, Size)`);
  console.log(`  - 3 atributos descriptivos`);
  console.log('='.repeat(50) + '\n');
}

// Ejecutar solo si no es producción
if (process.env.NODE_ENV !== 'production') {
  main()
    .catch((e) => {
      console.error('❌ Error en seed:', e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
