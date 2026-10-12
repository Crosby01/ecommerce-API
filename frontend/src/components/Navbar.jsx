import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useCart } from "../context/useCart";

function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const scrollToSection = (sectionId) => {
  if (window.location.pathname !== "/") {
    navigate("/", { replace: false });

    setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({
        behavior: "smooth",
      });
    }, 100);

    return;
  }

  document.getElementById(sectionId)?.scrollIntoView({
    behavior: "smooth",
  });
};

  return (
    <header className="navbar">
      <Link to="/" className="logo">
        MAISON
      </Link>

      <nav>
        <a
          href="/#arrivals"
          onClick={(event) => {
            event.preventDefault();
            scrollToSection("arrivals");
          }}
        >
          New Arrivals
        </a>

        <Link to="/search">Collections</Link>

        <a
          href="/#about"
          onClick={(event) => {
            event.preventDefault();
            scrollToSection("about");
          }}
        >
          About
        </a>
      </nav>

      <div className="nav-actions">
        {isAuthenticated ? (
          <>
            <button onClick={handleLogout}>Logout</button>
            <Link to="/cart">Cart ({cartCount})</Link>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Navbar;