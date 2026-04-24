import { Route, Routes } from "react-router-dom";
// ... (Giữ nguyên các import cũ của bạn)
import BikeDetailPage from "../pages/BikeDetailPage";
import BikeListPage from "../pages/BikeListPage";
import CheckoutPage from "../pages/CheckoutPage";
import CreateListingPage from "../pages/CreateListingPage";
import HomePage from "../pages/HomePage";
import InboxPage from "../pages/InboxPage";
import LoginPage from "../pages/LoginPage";
import ChatPage from "../pages/ChatPage";
import OrderHistoryPage from "../pages/OrderHistoryPage";
import PaymentSuccessPage from "../pages/PaymentSuccessPage";
import ProfilePage from "../pages/ProfilePage";
import RegisterPage from "../pages/RegisterPage";
import SellerDashboardPage from "../pages/SellerDashboardPage";
import SellerProfilePage from "../pages/SellerProfilePage";
import WishlistPage from "../pages/WishlistPage";
import ProtectedRoute from "./ProtectedRoute";
import AdminProfile from "../pages/admin/AdminProfile";

// ======= IMPORT ADMIN =======
import AdminLayout from "../layouts/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import UserManagement from "../pages/admin/UserManagement";
import Category from "../pages/admin/Category";
import Brand from "../pages/admin/Brand";
import CarApproval from "../pages/admin/CarApproval";

// ======= IMPORT TUẦN 3 (NEW) =======
import DisputeManagement from "../pages/admin/DisputeManagement";
import TransactionManagement from "../pages/admin/TransactionManagement";
import InspectorDashboard from "../pages/Inspector/InspectorDashboard";

function AppRoutes() {
  return (
    <Routes>
      {/* ================= PUBLIC ROUTES ================= */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/payment-success" element={<PaymentSuccessPage />} />
      <Route path="/bikes" element={<BikeListPage />} />
      <Route path="/bikes/:id" element={<BikeDetailPage />} />
      <Route path="/users/:userId/profile" element={<SellerProfilePage />} />

      {/* ================= USER PROTECTED ROUTES ================= */}
      <Route
        path="/inbox"
        element={
          <ProtectedRoute>
            <InboxPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/chat/:id"
        element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkout/:id"
        element={
          <ProtectedRoute>
            <CheckoutPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <OrderHistoryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/seller/dashboard"
        element={
          <ProtectedRoute>
            <SellerDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/seller/create"
        element={
          <ProtectedRoute>
            <CreateListingPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/seller/edit/:id"
        element={
          <ProtectedRoute>
            <CreateListingPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/create"
        element={
          <ProtectedRoute>
            <CreateListingPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/wishlist"
        element={
          <ProtectedRoute>
            <WishlistPage />
          </ProtectedRoute>
        }
      />

      {/* ================= ADMIN ROUTES ================= */}
      {/* Mình bọc từng trang Admin vào AdminLayout và ProtectedRoute để giữ đúng cấu trúc của bạn */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Dashboard />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <UserManagement />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/profile"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <AdminProfile />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/categories"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Category />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/brands"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <Brand />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/approvals"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <CarApproval />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* ================= TUẦN 3: ADMIN ROUTES (NEW) ================= */}
      <Route
        path="/admin/disputes"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <DisputeManagement />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/transactions"
        element={
          <ProtectedRoute>
            <AdminLayout>
              <TransactionManagement />
            </AdminLayout>
          </ProtectedRoute>
        }
      />

      {/* ================= TUẦN 3: INSPECTOR ROUTES (NEW) ================= */}
      <Route
        path="/inspector/dashboard"
        element={
          <ProtectedRoute>
            <InspectorDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;
