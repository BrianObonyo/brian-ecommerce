import type { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { requireAuth } from "../middleware/requireAuth.js";

const prisma = new PrismaClient();

const addItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().min(1).default(1),
});

const updateItemSchema = z.object({
  quantity: z.number().int().min(0),
});

export default async function cartRoutes(app: FastifyInstance) {
  app.get("/cart", { preHandler: requireAuth }, async (req, reply) => {
    const cart = await prisma.cart.findUnique({
      where: { userId: req.userId! },
      include: { items: { include: { product: true } } },
    });
    return reply.send({ cart });
  });

  app.post("/cart/items", { preHandler: requireAuth }, async (req, reply) => {
    const body = addItemSchema.parse(req.body);
    const cart = await prisma.cart.findUniqueOrThrow({ where: { userId: req.userId! } });

    const item = await prisma.cartItem.upsert({
      where: { cartId_productId: { cartId: cart.id, productId: body.productId } },
      update: { quantity: { increment: body.quantity } },
      create: { cartId: cart.id, productId: body.productId, quantity: body.quantity },
    });

    return reply.code(201).send({ item });
  });

  app.put("/cart/items/:productId", { preHandler: requireAuth }, async (req, reply) => {
    const { productId } = req.params as { productId: string };
    const body = updateItemSchema.parse(req.body);
    const cart = await prisma.cart.findUniqueOrThrow({ where: { userId: req.userId! } });

    if (body.quantity === 0) {
      await prisma.cartItem.delete({
        where: { cartId_productId: { cartId: cart.id, productId } },
      });
      return reply.send({ removed: true });
    }

    const item = await prisma.cartItem.update({
      where: { cartId_productId: { cartId: cart.id, productId } },
      data: { quantity: body.quantity },
    });

    return reply.send({ item });
  });
}
