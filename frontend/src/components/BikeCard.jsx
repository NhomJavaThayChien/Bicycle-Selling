function BikeCard({ bike }) {
  return (
    <div>
      <h3>{bike?.name || 'Bike name'}</h3>
      <p>{bike?.price || 0}</p>
    </div>
  );
}

export default BikeCard;
