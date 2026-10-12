import { useEffect, useState } from "react";

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("You must be logged in as an admin.");
        }

        const response = await fetch(
          "http://localhost:8080/api/admin/dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const message = await response.text();

          throw new Error(
            message || "Failed to fetch dashboard."
          );
        }

        const data = await response.json();

        setDashboard(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <>
      <p className="eyebrow">OVERVIEW</p>

      <h1>Dashboard</h1>

      <div className="dashboard-grid">
        <div>
          <span>Products</span>
          <strong>{dashboard.products}</strong>
        </div>

        <div>
          <span>Orders</span>
          <strong>{dashboard.orders}</strong>
        </div>

        <div>
          <span>Revenue</span>
          <strong>
            ₦{dashboard.revenue.toLocaleString()}
          </strong>
        </div>
      </div>
    </>
  );
}

export default Dashboard;