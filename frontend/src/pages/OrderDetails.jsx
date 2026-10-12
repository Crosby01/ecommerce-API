import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function OrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("You must be logged in to view this order.");
        }

        const response = await fetch(
          `http://localhost:8080/api/orders/${id}`,
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
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return <p>Loading order...</p>;
  }

  if (error) {
    return (
      <>
        <p>{error}</p>
        <Link to="/orders">Back to Orders</Link>
      </>
    );
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
          to="/orders"
          className="hero-button"
        >
          Back to Orders
        </Link>
      </div>

      <div className="dashboard-grid">
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

        <div>
          <span>Date</span>
          <strong>
            {new Date(order.createdAt).toLocaleDateString()}
          </strong>
        </div>
      </div>

      <div className="admin-table">
        <h2>Items</h2>

        {order.items.length === 0 ? (
          <p>No items found.</p>
        ) : (
          order.items.map((item, index) => (
            <div
              className="table-row"
              key={item.productId ?? index}
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