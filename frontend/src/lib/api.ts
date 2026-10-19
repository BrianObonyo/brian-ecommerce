const BASE = "/api";

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Request failed: ${res.status}`);
  }

  return res.json();
}

export interface Product {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  imageUrl: string | null;
  category: string;
  stock: number;
}

export const api = {
  listProducts: (params?: { category?: string; search?: string }) => {
    const qs = new URLSearchParams(params as Record<string, string>).toString();
    return request<{ products: Product[] }>(`/products${qs ? `?${qs}` : ""}`);
  },

  getProduct: (id: string) => request<{ product: Product }>(`/products/${id}`),

  register: (email: string, password: string) =>
    request<{ token: string; user: { id: string; email: string } }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  login: (email: string, password: string) =>
    request<{ token: string; user: { id: string; email: string } }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  getCart: () => request<{ cart: { items: { productId: string; quantity: number; product: Product }[] } }>("/cart"),

  addToCart: (productId: string, quantity = 1) =>
    request("/cart/items", { method: "POST", body: JSON.stringify({ productId, quantity }) }),

  updateCartItem: (productId: string, quantity: number) =>
    request(`/cart/items/${productId}`, { method: "PUT", body: JSON.stringify({ quantity }) }),

  checkout: () => request<{ orderId: string; clientSecret: string }>("/checkout", { method: "POST" }),

  listOrders: () => request<{ orders: unknown[] }>("/orders"),
};
