import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/api/products/${id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch product.");
        }

        const product = await response.json();

        setName(product.name);
        setPrice(product.price);
        setStock(product.stock);
        setDescription(product.description);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSaving(true);

    const token = localStorage.getItem("token");

    if (!token) {
      setError("You must be logged in as an admin.");
      setSaving(false);
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
        `http://localhost:8080/api/admin/products/${id}`,
        {
          method: "PUT",
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
          message || "Failed to update product."
        );
      }

      await response.json();

      navigate("/admin/products");
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p>Loading product...</p>;
  }

  return (
    <>
      <p className="eyebrow">
        PRODUCT {id}
      </p>

      <h1>Edit Product</h1>

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
          disabled={saving}
        >
          {saving
            ? "Saving Changes..."
            : "Save Changes"}
        </button>

        <Link to="/admin/products">
          Cancel
        </Link>
      </form>
    </>
  );
}

export default EditProduct;