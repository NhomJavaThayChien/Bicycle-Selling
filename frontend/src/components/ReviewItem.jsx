function ReviewItem({ review }) {
  return (
    <div>
      <strong>{review?.author || 'User'}</strong>
      <p>{review?.content || ''}</p>
    </div>
  );
}

export default ReviewItem;
