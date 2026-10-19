import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const products = [
    { name: "Classic Tee", description: "100% cotton crewneck t-shirt.", priceCents: 2500, category: "apparel", stock: 50 },
    { name: "Canvas Tote Bag", description: "Durable everyday tote.", priceCents: 1800, category: "accessories", stock: 30 },
    { name: "Ceramic Mug", description: "12oz stoneware mug.", priceCents: 1400, category: "home", stock: 75 },
    { name: "Notebook, Dot Grid", description: "A5 dot-grid notebook, 160 pages.", priceCents: 1200, category: "stationery", stock: 100 },
  ];

  for (const p of products) {
    await prisma.product.create({ data: p });
  }

  console.log(`Seeded ${products.length} products.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
