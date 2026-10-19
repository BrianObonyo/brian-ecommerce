import Fastify from "fastify";
import cors from "@fastify/cors";
import authRoutes from "./routes/auth.js";
import productRoutes from "./routes/products.js";
import cartRoutes from "./routes/cart.js";
import checkoutRoutes from "./routes/checkout.js";
import orderRoutes from "./routes/orders.js";

const app = Fastify({ logger: true });

await app.register(cors, {
  origin: process.env.FRONTEND_ORIGIN ?? "http://localhost:5173",
});

await app.register(authRoutes);
await app.register(productRoutes);
await app.register(cartRoutes);
await app.register(checkoutRoutes);
await app.register(orderRoutes);

app.get("/health", async () => ({ status: "ok" }));

const PORT = Number(process.env.PORT ?? 4000);

app.listen({ port: PORT, host: "0.0.0.0" }).then(() => {
  app.log.info(`Brian E-commerce API listening on :${PORT}`);
});
