import { initialData } from './seed';
import { countries } from './seed-countries';
import prisma from '../lib/prisma';
import { Size } from '../interfaces';

async function main() {
  console.log('🧹 Limpiando base de datos...');
  await prisma.orderAddress.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();

  await prisma.userAddress.deleteMany();
  await prisma.user.deleteMany();
  await prisma.country.deleteMany();

  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  await prisma.country.createMany({ data: countries });

  await prisma.user.createMany({ data: initialData.users });

  const categoriesData = initialData.categories.map((name) => ({ name }));
  await prisma.category.createMany({ data: categoriesData });

  const categoriesDB = await prisma.category.findMany();
  const categoriesMap = categoriesDB.reduce(
    (map, category) => {
      map[category.name.toLowerCase()] = category.id;
      return map;
    },
    {} as Record<string, string>
  );

  // 👕 Productos
  for (const product of initialData.products) {
    const { variants, images, type, ...rest } = product;

    const dbProduct = await prisma.product.create({
      data: {
        ...rest,
        categoryId: categoriesMap[type],
      },
    });

    // Imágenes generales
    if (images?.length) {
      await prisma.productImage.createMany({
        data: images.map((url) => ({
          url,
          productId: dbProduct.id,
        })),
      });
    }

    // Variantes
    for (const variant of variants) {
      const color = variant.color;

      for (const [size, stock] of Object.entries(variant.stockBySize)) {
        if (stock <= 0) continue;

        const dbVariant = await prisma.productVariant.create({
          data: {
            productId: dbProduct.id,
            color,
            size: size as Size,
            inStock: stock,
          },
        });

        // Imágenes del color asociadas a esta talla
        if (variant.images?.length) {
          await prisma.productImage.createMany({
            data: variant.images.map((url) => ({
              url,
              variantId: dbVariant.id,
            })),
          });
        }
      }
    }
  }

  console.log('✅ Seed ejecutado correctamente');
}

if (process.env.NODE_ENV !== 'production') {
  main()
    .catch((e) => console.error(e))
    .finally(async () => {
      await prisma.$disconnect();
    });
}
