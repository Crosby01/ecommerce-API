import { useState } from "react";

function Payment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please login before making a payment.");
      }

      const response = await fetch(
        "http://localhost:8080/api/payments/create",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create payment.");
      }

      const data = await response.json();

      if (!data.checkoutUrl) {
        throw new Error("Stripe checkout URL was not returned.");
      }

      window.location.href = data.checkoutUrl;
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <p className="eyebrow">PAYMENT</p>

      <h1>Secure Payment</h1>

      <p>
        You will be redirected to Stripe to securely
        complete your payment.
      </p>

      {error && <p>{error}</p>}

      <button
        className="hero-button"
        onClick={handlePayment}
        disabled={loading}
      >
        {loading
          ? "Redirecting to Stripe..."
          : "Continue to Stripe"}
      </button>
    </main>
  );
}

export default Payment;