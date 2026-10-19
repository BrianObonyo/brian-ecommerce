# Brian E-commerce

A full-stack e-commerce platform: product catalog, cart, checkout, and order
management. Built as a clean reference implementation — separate backend API
and frontend, the kind of structure a real small-to-mid e-commerce product
would actually use.

## Features (current + planned)

- [x] Product catalog (list, detail, search, categories)
- [x] Cart (add/remove/update quantity, persisted per session)
- [x] Checkout flow (Stripe test mode)
- [x] Order history
- [x] Auth (email/password)
- [ ] Admin dashboard (manage products, view orders)
- [ ] Reviews and ratings
- [ ] Inventory tracking
- [ ] Discount codes

See [docs/roadmap.md](docs/roadmap.md).

## Architecture

```
brian-ecommerce/
├── backend/     REST API — Fastify, Prisma, PostgreSQL
└── frontend/    React (Vite) SPA consuming the API
```

See [docs/architecture.md](docs/architecture.md) for the full breakdown.

## Stack

- **Backend**: TypeScript, Fastify, Prisma, PostgreSQL, Stripe (test mode)
- **Frontend**: TypeScript, React, Vite, React Router

## Getting started

```bash
git clone https://github.com/BrianObonyo/brian-ecommerce.git
cd brian-ecommerce

# Backend
cd backend
cp .env.example .env
docker compose up -d        # starts Postgres
npm install
npm run db:migrate
npm run dev                 # http://localhost:4000

# Frontend (new terminal)
cd ../frontend
npm install
npm run dev                 # http://localhost:5173
```

## Contributing

Contributions welcome — see [CONTRIBUTING.md](CONTRIBUTING.md). Issues tagged
`good-first-issue` are scoped for a first PR.

## License

BSD 3-Clause — see [LICENSE](LICENSE).
