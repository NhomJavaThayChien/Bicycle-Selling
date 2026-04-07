import { BrowserRouter, Route, Routes } from 'react-router-dom';
import BikeDetailPage from '../pages/BikeDetailPage';
import BikeListPage from '../pages/BikeListPage';
import CreateBikePage from '../pages/CreateBikePage';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import ProfilePage from '../pages/ProfilePage';
import RegisterPage from '../pages/RegisterPage';
import WishlistPage from '../pages/WishlistPage';
import ProtectedRoute from './ProtectedRoute';

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/bikes" element={<BikeListPage />} />
        <Route path="/bikes/:id" element={<BikeDetailPage />} />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreateBikePage />
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
    </BrowserRouter>
  );
}

export default AppRoutes;
