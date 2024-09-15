import { PrismaClient } from "@prisma/client";

import { faker } from "@faker-js/faker";
import { randBetweenDate, randNumber, randProduct } from "@ngneat/falso";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const seedSuperAdmin = async () => {
  const passwordHash = await bcrypt.hash("admin123", 5);
  await prisma.user.create({
    data: {
      username: "admin123",
      passwordHash,
      email: faker.internet.email(),
      role: "SUPER_ADMIN",
    },
  });
};

const seedCategories = async () => {
  const uniqueCategories = new Set<string>();

  while (uniqueCategories.size < 20) {
    uniqueCategories.add(faker.commerce.department());
  }

  const categoriesData = Array.from(uniqueCategories).map((name) => ({
    name,
  }));

  await prisma.category.createMany({
    data: categoriesData,
  });

  const createdCategories = await prisma.category.findMany();

  return createdCategories;
};

const seedProducts = async (categoryIds: string[]) => {

  const products = Array.from({ length: 50 }, () => {
    const productName = faker.commerce.productName();
    return {
      name: productName,
      description: `<p>${faker.commerce.productDescription()}</p>`,
      isActive: true,
      categories: {
        connect: faker.helpers
          .arrayElements(categoryIds, faker.number.int({ min: 1, max: 3 }))
          .map((id) => ({ id })),
      },
      Variant: {
        create: [
          {
            id: faker.commerce.isbn(),
            name: "S",
            price: randNumber({ min: 50000, max: 1000000 }),
            stock: randNumber({ min: 10, max: 100 }),
            images: [
              faker.image.url(),
              faker.image.url(),
              faker.image.url(),
              faker.image.url(),
              faker.image.url(),
              faker.image.url(),
              faker.image.url(),
              faker.image.url(),
              faker.image.url(),
              faker.image.url(),
              faker.image.url(),
            ],
          },
          {
            id: faker.commerce.isbn(),
            name: "M",
            price: randNumber({ min: 50000, max: 1000000 }),
            stock: randNumber({ min: 10, max: 100 }),
            images: [
              faker.image.url(),
              faker.image.url(),
              faker.image.url(),
              faker.image.url(),
              faker.image.url(),
              faker.image.url(),
              faker.image.url(),
              faker.image.url(),
              faker.image.url(),
              faker.image.url(),
              faker.image.url(),
            ],
          },
          {
            id: faker.commerce.isbn(),
            name: "L",
            price: randNumber({ min: 50000, max: 1000000 }),
            stock: randNumber({ min: 10, max: 100 }),
            images: [
              faker.image.url(),
              faker.image.url(),
              faker.image.url(),
              faker.image.url(),
              faker.image.url(),
              faker.image.url(),
              faker.image.url(),
              faker.image.url(),
              faker.image.url(),
              faker.image.url(),
              faker.image.url(),
            ],
          },
          {
            id: faker.commerce.isbn(),
            name: "XL",
            price: randNumber({ min: 50000, max: 1000000 }),
            stock: randNumber({ min: 10, max: 100 }),
            images: [
              faker.image.urlPicsumPhotos(),
              faker.image.url(),
              faker.image.url(),
              faker.image.url(),
              faker.image.url(),
              faker.image.url(),
              faker.image.url(),
              faker.image.url(),
              faker.image.url(),
              faker.image.url(),
              faker.image.url(),
            ],
          },

          {
            id: faker.commerce.isbn(),
            name: "XXL",
            price: randNumber({ min: 50000, max: 1000000 }),
            stock: randNumber({ min: 10, max: 100 }),
            images: [
              faker.image.url(),
              faker.image.url(),
              faker.image.url(),
              faker.image.url(),
              faker.image.url(),
              faker.image.url(),
              faker.image.url(),
              faker.image.url(),
              faker.image.url(),
              faker.image.url(),
              faker.image.url(),
            ],
          },
        ],
      },
    };
  });

  for (const product of products) {
    await prisma.product.create({ data: product });
  }
};

const seedContent = async () => {
  await prisma.content.createMany({
    data: [
      { title: "Top", description: "<p>Top content</p>" },
      { title: "Middle", description: "<p>Middle content</p>" },
      { title: "Logo", description: "<p>Company logo here</p>" },
    ],
  });
};

async function main() {
  console.log("Start seeding...");

  await seedSuperAdmin();

  const categories = await seedCategories();
  const categoryIds = categories.map((category) => category.id);

  await seedProducts(categoryIds);
  await seedContent();

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
