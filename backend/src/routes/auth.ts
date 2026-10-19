import type { FastifyInstance } from "fastify";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { hashPassword, verifyPassword, signToken } from "../lib/auth.js";

const prisma = new PrismaClient();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export default async function authRoutes(app: FastifyInstance) {
  app.post("/auth/register", async (req, reply) => {
    const body = registerSchema.parse(req.body);
    const passwordHash = await hashPassword(body.password);

    const user = await prisma.user.create({
      data: { email: body.email, passwordHash },
    });
    await prisma.cart.create({ data: { userId: user.id } });

    const token = signToken(user.id);
    return reply.code(201).send({ token, user: { id: user.id, email: user.email } });
  });

  app.post("/auth/login", async (req, reply) => {
    const body = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email: body.email } });

    if (!user || !(await verifyPassword(body.password, user.passwordHash))) {
      return reply.code(401).send({ error: "Invalid credentials" });
    }

    const token = signToken(user.id);
    return reply.send({ token, user: { id: user.id, email: user.email } });
  });
}
