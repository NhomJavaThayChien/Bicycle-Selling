import { Route, Routes } from "react-router-dom";
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

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/payment-success" element={<PaymentSuccessPage />} />
      <Route path="/bikes" element={<BikeListPage />} />
      <Route path="/bikes/:id" element={<BikeDetailPage />} />
      <Route path="/users/:userId/profile" element={<SellerProfilePage />} />
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
    </Routes>
  );
}

export default AppRoutes;
