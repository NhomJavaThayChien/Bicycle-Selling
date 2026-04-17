import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getListingById } from '../services/bikeService';
import {
  addToWishlistApi,
  fetchWishlist,
  isInWishlist,
  removeFromWishlistApi,
} from '../services/wishlistService';
import { formatPrice } from '../utils/formatPrice';

function BikeDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await getListingById(id);
        const data = response.data;
        setListing(data);
        setSelectedImage(data?.primaryImageUrl || data?.imageUrls?.[0] || '');
        const wishlistItems = await fetchWishlist();
        setWishlisted(
          wishlistItems.some((item) => item.id === data.id) || isInWishlist(data.id)
        );
      } catch {
        setError('Failed to load listing detail.');
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const galleryImages = useMemo(() => {
    if (!listing) {
      return [];
    }

    const source = listing.imageUrls?.length ? listing.imageUrls : [];
    if (source.length > 0) {
      return source;
    }

    return listing.primaryImageUrl ? [listing.primaryImageUrl] : [];
  }, [listing]);

  const handleToggleWishlist = async () => {
    if (!listing) {
      return;
    }

    if (wishlisted) {
      await removeFromWishlistApi(listing.id);
      setWishlisted(false);
      return;
    }

    await addToWishlistApi(listing);
    setWishlisted(true);
  };

  const handleContactSeller = () => {
    navigate('/profile');
  };

  const handleBuyNow = () => {
    navigate('/profile');
  };

  if (loading) {
    return <p style={{ padding: '20px' }}>Loading listing detail...</p>;
  }

  if (error || !listing) {
    return <p style={{ padding: '20px', color: '#b42318' }}>{error || 'Listing not found.'}</p>;
  }

  const specs = [
    ['Frame size', listing.frameSize],
    ['Frame material', listing.frameMaterial],
    ['Wheel size', listing.wheelSize],
    ['Brake type', listing.brakeType],
    ['Gear system', listing.gearSystem],
    ['Year', listing.yearOfManufacture],
    ['Color', listing.color],
    ['Weight', listing.weight ? `${listing.weight} kg` : null],
    ['Location', listing.location],
  ].filter((item) => item[1]);

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '20px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '24px' }}>
        <section>
          <div
            style={{
              width: '100%',
              height: '420px',
              border: '1px solid #ddd',
              borderRadius: '10px',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#fafafa',
            }}
          >
            {selectedImage ? (
              <img
                src={selectedImage}
                alt={listing.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <p>No image</p>
            )}
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '12px', flexWrap: 'wrap' }}>
            {galleryImages.map((image) => (
              <button
                key={image}
                type="button"
                onClick={() => setSelectedImage(image)}
                style={{
                  border: selectedImage === image ? '2px solid #0f766e' : '1px solid #ddd',
                  borderRadius: '6px',
                  padding: 0,
                  width: '84px',
                  height: '64px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  background: 'white',
                }}
              >
                <img src={image} alt="thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </button>
            ))}
          </div>
        </section>

        <section>
          <h1 style={{ marginTop: 0 }}>{listing.title}</h1>
          <p style={{ fontSize: '1.5rem', fontWeight: 700 }}>{formatPrice(Number(listing.price || 0))}</p>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
            {listing.inspectionStatus && (
              <span style={{ background: '#ecfdf3', color: '#067647', padding: '4px 8px', borderRadius: '999px' }}>
                Inspection: {listing.inspectionStatus}
              </span>
            )}
            {listing.condition && (
              <span style={{ background: '#eff8ff', color: '#175cd3', padding: '4px 8px', borderRadius: '999px' }}>
                {listing.condition}
              </span>
            )}
            {listing.status && (
              <span style={{ background: '#f4f3ff', color: '#5925dc', padding: '4px 8px', borderRadius: '999px' }}>
                {listing.status}
              </span>
            )}
          </div>

          <p>{listing.description}</p>

          <div style={{ display: 'flex', gap: '10px', marginTop: '14px', flexWrap: 'wrap' }}>
            <button type="button" onClick={handleToggleWishlist}>
              {wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </button>
            <button type="button" onClick={handleContactSeller}>
              Contact Seller
            </button>
            <button type="button" onClick={handleBuyNow}>
              Buy Now
            </button>
          </div>

          <div style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '14px', marginTop: '16px' }}>
            <h3 style={{ marginTop: 0 }}>Seller info</h3>
            <p>Username: {listing.sellerUsername || 'N/A'}</p>
            <p>Full name: {listing.sellerFullName || 'N/A'}</p>
            <p>Reputation: {listing.sellerReputation ?? 'N/A'}</p>
          </div>
        </section>
      </div>

      <section style={{ marginTop: '24px' }}>
        <h2>Specifications</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            {specs.map(([label, value]) => (
              <tr key={label}>
                <td style={{ borderBottom: '1px solid #eee', padding: '10px', width: '220px' }}>{label}</td>
                <td style={{ borderBottom: '1px solid #eee', padding: '10px' }}>{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default BikeDetailPage;
