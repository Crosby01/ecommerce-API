import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Search() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      try {
        const response = await fetch(
          "http://localhost:8080/api/products?page=0&size=10"
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        if (!cancelled) {
          setProducts(data.content ?? []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSearch = async (event) => {
    const value = event.target.value;
    setSearch(value);

    try {
      setLoading(true);
      setError("");

      const url = value.trim()
        ? `http://localhost:8080/api/products/search?name=${encodeURIComponent(
            value.trim()
          )}&page=0&size=10`
        : "http://localhost:8080/api/products?page=0&size=10";

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await response.json();
      setProducts(data.content ?? []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page">
      <p className="eyebrow">COLLECTION</p>
      <h1>Search Products</h1>

      <input
        className="search-input"
        placeholder="Search products..."
        value={search}
        onChange={handleSearch}
      />

      {loading && <p>Loading products...</p>}
      {error && <p>{error}</p>}

      {!loading && !error && (
        <div className="simple-product-list">
          {products.map((product) => (
            <Link key={product.id} to={`/product/${product.id}`}>
              <span>{product.name}</span>
              <strong>₦{product.price}</strong>
            </Link>
          ))}
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <p>No products found.</p>
      )}
    </main>
  );
}

export default Search;