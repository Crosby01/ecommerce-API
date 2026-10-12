import { useCallback, useState } from "react";
import { CartContext } from "./CartContext";

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);

  const fetchCartCount = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setCartCount(0);
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:8080/api/cart",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        setCartCount(0);
        return;
      }

      const data = await response.json();

      const count = data.items.reduce(
        (total, item) => total + item.quantity,
        0
      );

      setCartCount(count);
    } catch {
      setCartCount(0);
    }
  }, []);

  const addToCart = async (productId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to add items to your cart.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/api/cart?productId=${productId}&quantity=1`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add product to cart");
      }

      await fetchCartCount();

      alert("Added to cart!");
    } catch (error) {
      alert(error.message);
    }
  };

  const removeFromCart = async (cartItemId) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to manage your cart.");
      return;
    }

    try {
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

      await fetchCartCount();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartCount,
        fetchCartCount,
        setCartCount,
        addToCart,
        removeFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}