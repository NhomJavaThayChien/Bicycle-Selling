import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BikeCard from '../components/BikeCard';
import {
  clearWishlist,
  fetchWishlist,
  getWishlist,
  removeFromWishlistApi,
} from '../services/wishlistService';

function WishlistPage() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      const response = await fetchWishlist();
      setItems(response.length ? response : getWishlist());
    };

    load();
  }, []);

  const handleRemove = async (id) => {
    const next = await removeFromWishlistApi(id);
    setItems(next);
  };

  const handleClearAll = () => {
    clearWishlist();
    setItems([]);
  };

  if (!items.length) {
    return (
      <div style={{ maxWidth: '960px', margin: '0 auto', padding: '20px' }}>
        <h1>My Wishlist</h1>
        <p>Your wishlist is empty.</p>
        <button type="button" onClick={() => navigate('/bikes')}>
          Browse bikes
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>My Wishlist</h1>
        <button type="button" onClick={handleClearAll}>
          Clear all
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '16px',
        }}
      >
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              background: '#fff',
              padding: '12px',
            }}
          >
            <BikeCard bike={item} />
            <p style={{ color: '#555' }}>{item.location || 'Unknown location'}</p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="button" onClick={() => navigate(`/bikes/${item.id}`)}>
                View detail
              </button>
              <button type="button" onClick={() => handleRemove(item.id)}>
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WishlistPage;
