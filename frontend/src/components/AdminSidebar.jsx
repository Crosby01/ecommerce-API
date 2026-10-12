import { Link } from "react-router-dom";

function AdminSidebar() {
  return (
    <aside className="admin-sidebar">

      <Link to="/admin" className="admin-logo">
        MAISON
      </Link>

      <nav>
        <Link to="/admin">Dashboard</Link>
        <Link to="/admin/products">Products</Link>
        <Link to="/admin/products/add">Add Product</Link>
        <Link to="/admin/inventory">Inventory</Link>
        <Link to="/admin/orders">Orders</Link>
      </nav>

      <Link to="/admin/login" className="logout">
        Logout
      </Link>

    </aside>
  );
}

export default AdminSidebar;