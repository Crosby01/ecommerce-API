import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useCart } from "../context/useCart";

function Success() {
  const { fetchCartCount } = useCart();

  useEffect(() => {
    fetchCartCount();
  }, [fetchCartCount]);

  return (
    <main className="success-page">
      <p className="eyebrow">ORDER CONFIRMED</p>

      <h1>Thank you.</h1>

      <p>
        Your payment was successful and your order is
        being confirmed.
      </p>

      <p>
        Your order will be updated once payment confirmation
        is received.
      </p>

      <div>
        <Link to="/" className="hero-button">
          Continue Shopping
        </Link>

        <Link to="/cart" className="hero-button">
          View Cart
        </Link>
      </div>
    </main>
  );
}

export default Success;