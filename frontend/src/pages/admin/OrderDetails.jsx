import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function OrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("You must be logged in as an admin.");
        }

        const response = await fetch(
          `http://localhost:8080/api/admin/orders/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const message = await response.text();

          throw new Error(
            message || "Failed to fetch order."
          );
        }

        const data = await response.json();

        setOrder(data);
        setStatus(data.status);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  const handleStatusUpdate = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("You must be logged in as an admin.");
      }

      setSaving(true);
      setError("");
      setSuccess("");

      const response = await fetch(
        `http://localhost:8080/api/admin/orders/${id}/status`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: status,
          }),
        }
      );

      if (!response.ok) {
        const message = await response.text();

        throw new Error(
          message || "Failed to update order status."
        );
      }

      const updatedOrder = await response.json();

      setOrder(updatedOrder);
      setStatus(updatedOrder.status);
      setSuccess("Order status updated successfully.");
    } catch (error) {
      setError(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p>Loading order...</p>;
  }

  if (error && !order) {
    return <p>{error}</p>;
  }

  if (!order) {
    return <p>Order not found.</p>;
  }

  return (
    <>
      <div className="admin-heading">
        <div>
          <p className="eyebrow">ORDER DETAILS</p>
          <h1>Order #{order.id}</h1>
        </div>

        <Link
          to="/admin/orders"
          className="hero-button"
        >
          Back to Orders
        </Link>
      </div>

      {error && <p>{error}</p>}
      {success && <p>{success}</p>}

      <div className="dashboard-grid">
        <div>
          <span>Customer</span>
          <strong>{order.userEmail}</strong>
        </div>

        <div>
          <span>Status</span>
          <strong>{order.status}</strong>
        </div>

        <div>
          <span>Total</span>
          <strong>
            ₦{order.totalAmount.toLocaleString()}
          </strong>
        </div>
      </div>

      <div className="admin-table">
        <h2>Update Status</h2>

        <div className="table-row">
          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value)
            }
          >
            <option value="PENDING">PENDING</option>
            <option value="PAID">PAID</option>
            <option value="PROCESSING">PROCESSING</option>
            <option value="SHIPPED">SHIPPED</option>
            <option value="DELIVERED">DELIVERED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>

          <button
            onClick={handleStatusUpdate}
            disabled={saving || status === order.status}
          >
            {saving ? "Saving..." : "Update Status"}
          </button>
        </div>
      </div>

      <div className="admin-table">
        <h2>Items</h2>

        {order.items.length === 0 ? (
          <p>No items found.</p>
        ) : (
          order.items.map((item) => (
            <div
              className="table-row"
              key={item.productId}
            >
              <span>{item.productName}</span>

              <span>
                Quantity: {item.quantity}
              </span>

              <span>
                ₦{item.price.toLocaleString()}
              </span>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default OrderDetails;