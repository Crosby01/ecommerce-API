import { Link } from "react-router-dom";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";

function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);

  return (
    <article className="product-card">
      <Link to={`/product/${product.id}`}>
        <div className="product-image">
          <span>{product.name}</span>
        </div>
      </Link>

      <div className="product-info">
        <div>
          <h3>{product.name}</h3>
          <p>{product.description}</p>
        </div>

        <strong>
          {"₦" + product.price.toLocaleString()}
        </strong>
      </div>

      <button onClick={() => addToCart(product.id)}>
        Add to Cart
      </button>
    </article>
  );
}

export default ProductCard;