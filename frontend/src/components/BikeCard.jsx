import { formatPrice } from '../utils/formatPrice';

function BikeCard({ bike }) {
  const title = bike?.title || bike?.name || 'Bike name';
  const price = Number(bike?.price || 0);
  const imageUrl = bike?.primaryImageUrl || bike?.image || '';

  return (
    <div>
      {imageUrl && (
        <img
          src={imageUrl}
          alt={title}
          style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '6px' }}
        />
      )}
      <h3>{title}</h3>
      <p>{formatPrice(price)}</p>
    </div>
  );
}

export default BikeCard;
