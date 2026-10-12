import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";
import { useCart } from "../context/useCart";

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { fetchCartCount } = useCart();

  const getToken = () => localStorage.getItem("token");

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        throw new Error("Please login to view your cart.");
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
        throw new Error("Failed to fetch cart");
      }

      const data = await response.json();

      setCart(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadCart = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Please login to view your cart.");
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
          throw new Error("Failed to fetch cart");
        }

        const data = await response.json();

        if (!cancelled) {
          setCart(data);
        }
      } catch (error) {
        if (!cancelled) {
          setError(error.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadCart();

    return () => {
      cancelled = true;
    };
  }, []);

  const updateQuantity = async (
    cartItemId,
    quantity
  ) => {
    if (quantity < 1) {
      return;
    }

    try {
      setError("");

      const token = getToken();

      const response = await fetch(
        `http://localhost:8080/api/cart/${cartItemId}?quantity=${quantity}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update quantity");
      }

      await fetchCart();
      await fetchCartCount();
    } catch (error) {
      setError(error.message);
    }
  };

  const removeItem = async (cartItemId) => {
    try {
      setError("");

      const token = getToken();

      const response = await fetch(
        `http://localhost:8080/api/cart/${cartItemId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to remove item from cart");
      }

      await fetchCart();
      await fetchCartCount();
    } catch (error) {
      setError(error.message);
    }
  };

  const total = cart
    ? cart.items.reduce(
        (sum, item) =>
          sum + item.price * item.quantity,
        0
      )
    : 0;

  return (
    <main className="page">
      <p className="eyebrow">YOUR BAG</p>

      <h1>Shopping Cart</h1>

      {loading && <p>Loading cart...</p>}

      {error && <p>{error}</p>}

      {cart && (
        <>
          {cart.items.length === 0 ? (
            <>
              <p>Your cart is empty.</p>

              <Link
                to="/search"
                className="hero-button"
              >
                Continue Shopping
              </Link>
            </>
          ) : (
            <>
              <div className="cart-list">
                {cart.items.map((item) => (
                  <div
                    className="cart-item"
                    key={item.id}
                  >
                    <div className="cart-item-info">
                      <h3>{item.productName}</h3>

                      <p className="cart-item-price">
                        ₦{item.price.toLocaleString()}
                      </p>

                      <div className="quantity-control">
                        <button
                          className="quantity-button"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.quantity - 1
                            )
                          }
                          disabled={item.quantity <= 1}
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>

                        <span className="quantity-number">
                          {item.quantity}
                        </span>

                        <button
                          className="quantity-button"
                          onClick={() =>
                            updateQuantity(
                              item.id,
                              item.quantity + 1
                            )
                          }
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() =>
                          removeItem(item.id)
                        }
                      >
                        Remove
                      </button>
                    </div>

                    <strong className="cart-item-total">
                      ₦
                      {(
                        item.price * item.quantity
                      ).toLocaleString()}
                    </strong>
                  </div>
                ))}
              </div>

              <div className="cart-total">
                <span>Total</span>

                <strong>
                  ₦{total.toLocaleString()}
                </strong>
              </div>

              <Link
                to="/checkout"
                className="hero-button"
              >
                Proceed to Checkout
              </Link>
            </>
          )}
        </>
      )}
    </main>
  );
}

export default Cart;