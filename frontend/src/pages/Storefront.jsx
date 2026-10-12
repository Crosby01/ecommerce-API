import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";

function Storefront() {
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
          throw new Error("Failed to fetch products");
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

  return (
    <main>
      <section className="hero">
        <p className="eyebrow">THE NEW COLLECTION</p>

        <h1>
          Simple.
          <br />
          Refined.
          <br />
          Timeless.
        </h1>

        <p>
          Thoughtfully designed products for everyday life.
        </p>

        <Link to="/search" className="hero-button">
          Explore Collection
        </Link>
      </section>

      <section id="arrivals" className="products-section">
        <div className="section-heading">
          <p className="eyebrow">CURATED FOR YOU</p>
          <h2>New Arrivals</h2>
        </div>

        {loading && <p>Loading products...</p>}

        {error && <p>{error}</p>}

        {!loading && !error && (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}
      </section>

      <section id="about" className="about-section">
        <p className="eyebrow">ABOUT MAISON</p>

        <h2>Less, but better.</h2>

        <p>
          We believe great products don't need to shout.
          Every detail is considered, every element has a purpose.
        </p>
      </section>

      <footer>
        © 2026 MAISON. All rights reserved.
      </footer>
    </main>
  );
}

export default Storefront;