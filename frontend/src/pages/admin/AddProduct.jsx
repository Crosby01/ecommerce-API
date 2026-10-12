import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function AddProduct() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    const token = localStorage.getItem("token");

    if (!token) {
      setError("You must be logged in as an admin.");
      setLoading(false);
      return;
    }

    const product = {
      name,
      description,
      price: Number(price),
      stock: Number(stock),
    };

    try {
      const response = await fetch(
        "http://localhost:8080/api/admin/products",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(product),
        }
      );

      if (!response.ok) {
        const message = await response.text();

        throw new Error(
          message || "Failed to create product."
        );
      }

      await response.json();

      navigate("/admin/products");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <p className="eyebrow">CATALOG</p>

      <h1>Add Product</h1>

      <form
        className="admin-form"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          placeholder="Product name"
          value={name}
          onChange={(event) =>
            setName(event.target.value)
          }
          required
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(event) =>
            setPrice(event.target.value)
          }
          min="0"
          step="0.01"
          required
        />

        <input
          type="number"
          placeholder="Inventory quantity"
          value={stock}
          onChange={(event) =>
            setStock(event.target.value)
          }
          min="0"
          required
        />

        <textarea
          placeholder="Product description"
          value={description}
          onChange={(event) =>
            setDescription(event.target.value)
          }
          required
        />

        {error && <p>{error}</p>}

        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Creating Product..."
            : "Create Product"}
        </button>

        <Link to="/admin/products">
          Cancel
        </Link>
      </form>
    </>
  );
}

export default AddProduct;