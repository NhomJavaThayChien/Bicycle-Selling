import { useState } from "react";
import { Link } from "react-router-dom";
import { formatPrice } from "../utils/formatPrice";

function BikeCard({ bike, linkTo }) {
  const title = bike?.title || bike?.name || "Bike name";
  const price = Number(bike?.price || 0);
  
  const defaultImage = "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=800";
  const initialImage = bike?.primaryImageUrl || bike?.image || defaultImage;
  
  const [imgSrc, setImgSrc] = useState(initialImage);
  const targetLink = linkTo || (bike?.id ? `/bikes/${bike.id}` : null);

  const handleImgError = () => {
    if (imgSrc !== defaultImage) {
      setImgSrc(defaultImage);
    }
  };

  return (
    <div className="bike-card">
      <div className="bike-card__image-container">
        {targetLink ? (
          <Link to={targetLink} className="bike-card__image-link" aria-label={`Xem chi tiết ${title}`}>
            <img 
              src={imgSrc} 
              alt={title} 
              className="bike-card__image" 
              onError={handleImgError}
            />
          </Link>
        ) : (
          <img 
            src={imgSrc} 
            alt={title} 
            className="bike-card__image" 
            onError={handleImgError}
          />
        )}
      </div>
      <div className="bike-card__info">
        <h3 style={{ 
          display: '-webkit-box', 
          WebkitLineClamp: 2, 
          WebkitBoxOrient: 'vertical', 
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          height: '2.8em',
          lineHeight: '1.4em',
          margin: '0 0 8px 0'
        }}>
          {title}
        </h3>
        <p className="bike-card__price">{formatPrice(price)}</p>
      </div>
    </div>
  );
}

export default BikeCard;

