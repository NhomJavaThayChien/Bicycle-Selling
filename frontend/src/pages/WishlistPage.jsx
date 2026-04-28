import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, 
  Trash2, 
  MapPin, 
  ArrowRight, 
  ShoppingBag,
  ExternalLink
} from "lucide-react";
import BikeCard from "../components/BikeCard";
import {
  clearWishlist,
  fetchWishlist,
  getWishlist,
  removeFromWishlistApi,
} from "../services/wishlistService";
import "./WishlistPage.css";

function WishlistPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const response = await fetchWishlist();
        setItems(response.length ? response : getWishlist());
      } catch (error) {
        console.error("Failed to load wishlist:", error);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleRemove = async (id) => {
    const next = await removeFromWishlistApi(id);
    setItems(next);
  };

  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear your entire wishlist?")) {
      clearWishlist();
      setItems([]);
    }
  };

  if (loading) {
    return (
      <div className="wishlist-page">
        <div className="wishlist-loading">
          <div className="spinner"></div>
          <p>Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="wishlist-page">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="wishlist-empty"
        >
          <div className="empty-icon-container">
            <Heart size={64} fill="#f0f0f0" color="#bfbfbf" />
          </div>
          <h2>Your Wishlist is Empty</h2>
          <p>Seems like you haven't found your dream bike yet. Explore our collection and save your favorites here!</p>
          <button 
            type="button" 
            className="browse-btn"
            onClick={() => navigate("/bikes")}
          >
            <ShoppingBag size={20} />
            Browse Collection
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-header">
        <h1 className="wishlist-title">
          <Heart size={32} fill="#ff4d4f" color="#ff4d4f" />
          My Wishlist
        </h1>
        <button 
          type="button" 
          className="clear-wishlist-btn"
          onClick={handleClearAll}
        >
          <Trash2 size={18} />
          Clear All
        </button>
      </div>

      <div className="wishlist-grid">
        <AnimatePresence>
          {items.map((item, index) => (
            <motion.div
              key={item.id || index}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
              transition={{ delay: index * 0.05 }}
              className="wishlist-item-card"
            >
              <button 
                type="button" 
                className="remove-item-btn"
                onClick={() => handleRemove(item.id)}
                title="Remove from wishlist"
              >
                <Trash2 size={18} />
              </button>
              
              <div className="wishlist-card-content">
                <BikeCard bike={item} />
              </div>
              
              <div className="wishlist-card-footer">
                <div className="location-tag">
                  <MapPin size={14} />
                  <span>{item.location || "Location not specified"}</span>
                </div>
                <button 
                  type="button" 
                  className="view-detail-btn"
                  onClick={() => navigate(`/bikes/${item.id}`)}
                >
                  View Details
                  <ExternalLink size={16} style={{ marginLeft: '8px' }} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default WishlistPage;

