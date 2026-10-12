import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const fetchProducts = async () => {
    try {
      setError("");

      const response = await fetch(
        "http://localhost:8080/api/products"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch products.");
      }

      const data = await response.json();

      setProducts(data.content);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (productId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("You must be logged in as an admin.");
      return;
    }

    try {
      setError("");
      setDeletingId(productId);

      const response = await fetch(
        `http://localhost:8080/api/admin/products/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const message = await response.text();

        throw new Error(
          message || "Failed to delete product."
        );
      }

      setProducts((currentProducts) =>
        currentProducts.filter(
          (product) => product.id !== productId
        )
      );
    } catch (error) {
      setError(error.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <div className="admin-heading">
        <div>
          <p className="eyebrow">CATALOG</p>
          <h1>Products</h1>
        </div>

        <Link
          to="/admin/products/add"
          className="hero-button"
        >
          Add Product
        </Link>
      </div>

      {loading && <p>Loading products...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && (
        <div className="admin-table">
          {products.length === 0 ? (
            <p>No products found.</p>
          ) : (
            products.map((product) => (
              <div
                key={product.id}
                className="table-row"
              >
                <span>{product.name}</span>

                <span>
                  ₦{product.price.toLocaleString()}
                </span>

                <span>
                  {product.stock} in stock
                </span>

                <Link
                  to={`/admin/products/edit/${product.id}`}
                >
                  Edit
                </Link>

                <button
                  onClick={() =>
                    handleDelete(product.id)
                  }
                  disabled={deletingId === product.id}
                >
                  {deletingId === product.id
                    ? "Deleting..."
                    : "Delete"}
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </>
  );
}

export default Products;