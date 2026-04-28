import { Link } from "react-router-dom";
import { formatPrice } from "../utils/formatPrice";

function BikeCard({ bike }) {
  const title = bike?.title || bike?.name || "Bike name";
  const price = Number(bike?.price || 0);
  const imageUrl = bike?.primaryImageUrl || bike?.image || "";

  return (
    <div className="bike-card">
      {imageUrl && (
        bike?.id ? (
          <Link to={`/bikes/${bike.id}`} className="bike-card__image-link" aria-label={`Xem chi tiết ${title}`}>
            <img src={imageUrl} alt={title} className="bike-card__image" />
          </Link>
        ) : (
          <img src={imageUrl} alt={title} className="bike-card__image" />
        )
      )}
      <h3>{title}</h3>
      <p>{formatPrice(price)}</p>
    </div>
  );
}

export default BikeCard;
