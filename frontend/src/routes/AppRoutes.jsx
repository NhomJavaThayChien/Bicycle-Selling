import { BrowserRouter, Route, Routes } from 'react-router-dom';
import BikeDetailPage from '../pages/BikeDetailPage';
import BikeListPage from '../pages/BikeListPage';
import CreateBikePage from '../pages/CreateBikePage';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import ProfilePage from '../pages/ProfilePage';
import RegisterPage from '../pages/RegisterPage';
import WishlistPage from '../pages/WishlistPage';

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/bikes" element={<BikeListPage />} />
        <Route path="/bikes/:id" element={<BikeDetailPage />} />
        <Route path="/create" element={<CreateBikePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
