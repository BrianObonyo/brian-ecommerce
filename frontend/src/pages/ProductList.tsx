import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, type Product } from "../lib/api";

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .listProducts()
      .then((res) => setProducts(res.products))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading products…</p>;
  if (error) return <p>Couldn't load products: {error}</p>;

  return (
    <div className="product-grid">
      {products.map((p) => (
        <Link key={p.id} to={`/products/${p.id}`} className="product-card">
          <h3>{p.name}</h3>
          <p>${(p.priceCents / 100).toFixed(2)}</p>
        </Link>
      ))}
    </div>
  );
}
