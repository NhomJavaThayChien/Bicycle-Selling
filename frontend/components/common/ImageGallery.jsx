export default function ImageGallery({ images }) {
  return (
    <div className="gallery">
      {images.map((img, i) => (
        <img key={i} src={img} alt="" />
      ))}
    </div>
  );
}
