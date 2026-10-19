import type { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import { requireAuth } from "../middleware/requireAuth.js";

const prisma = new PrismaClient();

export default async function orderRoutes(app: FastifyInstance) {
  app.get("/orders", { preHandler: requireAuth }, async (req, reply) => {
    const orders = await prisma.order.findMany({
      where: { userId: req.userId! },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
    });
    return reply.send({ orders });
  });

  app.get("/orders/:id", { preHandler: requireAuth }, async (req, reply) => {
    const { id } = req.params as { id: string };
    const order = await prisma.order.findFirst({
      where: { id, userId: req.userId! },
      include: { items: { include: { product: true } } },
    });

    if (!order) return reply.code(404).send({ error: "Order not found" });
    return reply.send({ order });
  });
}
