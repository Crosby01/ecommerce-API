import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useCart } from "../context/useCart";

function ProductDetails() {
  const { id } = useParams();

  const { fetchCartCount } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cartMessage, setCartMessage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/products/${id}`
        );

        if (!response.ok) {
          throw new Error("Product not found");
        }

        const data = await response.json();

        setProduct(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setCartMessage(
        "Please login before adding products to your cart."
      );
      return;
    }

    try {
      setCartMessage("");

      const response = await fetch(
        `http://localhost:8080/api/cart?productId=${id}&quantity=1`,
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

      // Refresh the shared cart count
      await fetchCartCount();

      setCartMessage("Product added to cart!");
    } catch (error) {
      setCartMessage(error.message);
    }
  };

  if (loading) {
    return (
      <main className="page">
        <p>Loading product...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="page">
        <p>{error}</p>

        <Link to="/search">
          ← Back to products
        </Link>
      </main>
    );
  }

  return (
    <main className="page">
      <Link to="/search">
        ← Back to products
      </Link>

      <section className="product-detail">
        <div className="product-image large">
          {product.name}
        </div>

        <div className="detail-info">
          <p className="eyebrow">
            MAISON COLLECTION
          </p>

          <h1>{product.name}</h1>

          <p className="price">
            ₦{product.price}
          </p>

          <p>{product.description}</p>

          <p>
            Stock: {product.stock}
          </p>

          <button onClick={handleAddToCart}>
            Add to Cart
          </button>

          {cartMessage && (
            <p>{cartMessage}</p>
          )}

          <Link
            to="/cart"
            className="text-link"
          >
            View Cart →
          </Link>
        </div>
      </section>
    </main>
  );
}

export default ProductDetails;