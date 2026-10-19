import { useEffect, useState } from "react";
import { api, type Product } from "../lib/api";

interface CartItem {
  productId: string;
  quantity: number;
  product: Product;
}

export default function Cart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [checkoutStatus, setCheckoutStatus] = useState<string | null>(null);

  function refresh() {
    api.getCart().then((res) => setItems(res.cart.items));
  }

  useEffect(refresh, []);

  async function updateQuantity(productId: string, quantity: number) {
    await api.updateCartItem(productId, quantity);
    refresh();
  }

  async function handleCheckout() {
    try {
      const res = await api.checkout();
      setCheckoutStatus(`Order ${res.orderId} created — complete payment with Stripe's client SDK next.`);
    } catch (e) {
      setCheckoutStatus(e instanceof Error ? e.message : "Checkout failed.");
    }
  }

  const total = items.reduce((sum, i) => sum + i.product.priceCents * i.quantity, 0);

  return (
    <div className="cart">
      <h2>Your cart</h2>
      {items.length === 0 && <p>Your cart is empty.</p>}
      {items.map((item) => (
        <div key={item.productId} className="cart-item">
          <span>{item.product.name}</span>
          <input
            type="number"
            min={0}
            value={item.quantity}
            onChange={(e) => updateQuantity(item.productId, Number(e.target.value))}
          />
          <span>${((item.product.priceCents * item.quantity) / 100).toFixed(2)}</span>
        </div>
      ))}
      {items.length > 0 && (
        <>
          <p className="total">Total: ${(total / 100).toFixed(2)}</p>
          <button onClick={handleCheckout}>Checkout</button>
        </>
      )}
      {checkoutStatus && <p>{checkoutStatus}</p>}
    </div>
  );
}
