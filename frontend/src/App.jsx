import { BrowserRouter, Routes, Route } from "react-router-dom";

import { CartProvider } from "./context/CartProvider";
import { AuthProvider } from "./context/AuthProvider";

import AdminRoute from "./components/AdminRoute";

import ProtectedRoute from "./components/ProtectedRoute";

import OrderDetails from "./pages/OrderDetails";

import MyOrders from "./pages/MyOrders";

import Navbar from "./components/Navbar";
import AdminSidebar from "./components/AdminSidebar";

import Storefront from "./pages/Storefront";
import ProductDetails from "./pages/ProductDetails";
import Search from "./pages/Search";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Payment from "./pages/Payment";
import Success from "./pages/Success";

import AdminLogin from "./pages/admin/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import AddProduct from "./pages/admin/AddProduct";
import EditProduct from "./pages/admin/EditProduct";
import Inventory from "./pages/admin/Inventory";
import Orders from "./pages/admin/Orders";
import AdminOrderDetails from "./pages/admin/OrderDetails";

function AdminLayout({ children }) {
  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-content">
        {children}
      </main>
    </div>
  );
}

function App() {
  return (
    <CartProvider>
      <AuthProvider>
        <BrowserRouter>
          <Navbar />

          <Routes>
            {/* Public routes */}

            <Route
              path="/"
              element={<Storefront />}
            />

            <Route
              path="/product/:id"
              element={<ProductDetails />}
            />

            <Route
              path="/search"
              element={<Search />}
            />

            <Route
              path="/signup"
              element={<Signup />}
            />

            <Route
              path="/login"
              element={<Login />}
            />

            <Route
              path="/cart"
              element={<Cart />}
            />

            <Route
              path="/checkout"
              element={<Checkout />}
            />

            <Route
              path="/payment"
              element={<Payment />}
            />

            <Route
              path="/success"
              element={<Success />}
            />

            {/* Customer orders */}

            <Route
  path="/orders"
  element={
    <ProtectedRoute>
      <MyOrders />
    </ProtectedRoute>
  }
/>

<Route
  path="/orders/:id"
  element={
    <ProtectedRoute>
      <OrderDetails />
    </ProtectedRoute>
  }
/>


            {/* Admin login */}

            <Route
              path="/admin/login"
              element={<AdminLogin />}
            />

            {/* Protected admin routes */}

            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <Dashboard />
                  </AdminLayout>
                </AdminRoute>
              }
            />

            <Route
              path="/admin/products"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <Products />
                  </AdminLayout>
                </AdminRoute>
              }
            />

            <Route
              path="/admin/products/add"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <AddProduct />
                  </AdminLayout>
                </AdminRoute>
              }
            />

            <Route
              path="/admin/products/edit/:id"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <EditProduct />
                  </AdminLayout>
                </AdminRoute>
              }
            />

            <Route
              path="/admin/inventory"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <Inventory />
                  </AdminLayout>
                </AdminRoute>
              }
            />

            <Route
              path="/admin/orders"
              element={
                <AdminRoute>
                  <AdminLayout>
                    <Orders />
                  </AdminLayout>
                </AdminRoute>
              }
            />

            <Route
              path="/admin/orders/:id"
              element={
                <AdminRoute>
                  <AdminLayout>
  <AdminOrderDetails />
</AdminLayout>
                </AdminRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </CartProvider>
  );
}

export default App;