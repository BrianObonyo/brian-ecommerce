import type { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function productRoutes(app: FastifyInstance) {
  app.get("/products", async (req, reply) => {
    const { category, search } = req.query as { category?: string; search?: string };

    const products = await prisma.product.findMany({
      where: {
        ...(category ? { category } : {}),
        ...(search ? { name: { contains: search, mode: "insensitive" } } : {}),
      },
      orderBy: { createdAt: "desc" },
    });

    return reply.send({ products });
  });

  app.get("/products/:id", async (req, reply) => {
    const { id } = req.params as { id: string };
    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) return reply.code(404).send({ error: "Product not found" });
    return reply.send({ product });
  });
}
