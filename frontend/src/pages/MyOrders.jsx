import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("You must be logged in to view your orders.");
        }

        const response = await fetch(
          "http://localhost:8080/api/orders",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const message = await response.text();

          throw new Error(
            message || "Failed to fetch your orders."
          );
        }

        const data = await response.json();

        setOrders(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <>
      <p className="eyebrow">YOUR ORDERS</p>

      <div className="admin-heading">
        <div>
          <h1>My Orders</h1>
        </div>
      </div>

      {loading && <p>Loading orders...</p>}

      {error && <p>{error}</p>}

      {!loading && !error && (
        <div className="admin-table">
          {orders.length === 0 ? (
            <p>You have no orders yet.</p>
          ) : (
            orders.map((order) => (
              <div
                className="table-row"
                key={order.id}
              >
                <span>
                  Order #{order.id}
                </span>

                <span>
                  ₦{order.totalAmount.toLocaleString()}
                </span>

                <span>
                  {order.status}
                </span>

                <Link to={`/orders/${order.id}`}>
                  View
                </Link>
              </div>
            ))
          )}
        </div>
      )}
    </>
  );
}

export default MyOrders;