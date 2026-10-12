import { useState } from "react";
import { Link } from "react-router-dom";

function Checkout() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please login before checkout.");
      }

      const response = await fetch(
        "http://localhost:8080/api/cart",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to load cart.");
      }

      const data = await response.json();

      if (!data.items || data.items.length === 0) {
        throw new Error("Your cart is empty.");
      }

      setCart(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const total = cart
    ? cart.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      )
    : 0;

  return (
    <main className="auth-page">
      <p className="eyebrow">CHECKOUT</p>

      <h1>Complete Your Order</h1>

      {!cart && !loading && !error && (
        <button onClick={fetchCart}>
          Review Order
        </button>
      )}

      {loading && <p>Loading order...</p>}

      {error && <p>{error}</p>}

      {cart && (
        <>
          <div className="cart-total">
            <span>Order Total</span>
            <strong>₦{total}</strong>
          </div>

          <div>
            {cart.items.map((item) => (
              <div className="cart-item" key={item.id}>
                <div>
                  <h3>{item.productName}</h3>

                  <p>
                    ₦{item.price} × {item.quantity}
                  </p>
                </div>

                <strong>
                  ₦{item.price * item.quantity}
                </strong>
              </div>
            ))}
          </div>

          <Link
            to="/payment"
            className="hero-button"
          >
            Continue to Payment
          </Link>
        </>
      )}

      {!cart && !loading && !error && (
        <p>
          Review your cart before continuing to payment.
        </p>
      )}
    </main>
  );
}

export default Checkout;