import { useEffect, useState } from "react";

function Inventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/api/products"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch inventory.");
        }

        const data = await response.json();

        setProducts(data.content);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const getStockStatus = (stock) => {
    if (stock === 0) {
      return "Out of Stock";
    }

    if (stock <= 5) {
      return "Low Stock";
    }

    return "In Stock";
  };

  return (
    <>
      <p className="eyebrow">STOCK MANAGEMENT</p>

      <h1>Inventory</h1>

      {loading && <p>Loading inventory...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && (
        <div className="admin-table">
          {products.length === 0 ? (
            <p>No products found.</p>
          ) : (
            products.map((product) => (
              <div
                className="table-row"
                key={product.id}
              >
                <span>{product.name}</span>

                <span>
                  {product.stock} units
                </span>

                <strong>
                  {getStockStatus(product.stock)}
                </strong>
              </div>
            ))
          )}
        </div>
      )}
    </>
  );
}

export default Inventory;