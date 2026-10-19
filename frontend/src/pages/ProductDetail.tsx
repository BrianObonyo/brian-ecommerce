import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api, type Product } from "../lib/api";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    api.getProduct(id).then((res) => setProduct(res.product));
  }, [id]);

  async function handleAddToCart() {
    if (!id) return;
    try {
      await api.addToCart(id, 1);
      setStatus("Added to cart.");
    } catch (e) {
      setStatus(e instanceof Error ? e.message : "Something went wrong.");
    }
  }

  if (!product) return <p>Loading…</p>;

  return (
    <div className="product-detail">
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p className="price">${(product.priceCents / 100).toFixed(2)}</p>
      <p>{product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}</p>
      <button onClick={handleAddToCart} disabled={product.stock === 0}>
        Add to cart
      </button>
      {status && <p>{status}</p>}
    </div>
  );
}
