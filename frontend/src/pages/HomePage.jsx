import { useNavigate } from 'react-router-dom';
import BikeCard from '../components/BikeCard';

function HomePage() {
  const navigate = useNavigate();

  // Mock featured bikes data
  const featuredBikes = [
    {
      id: 1,
      name: 'Mountain Bike Pro',
      price: 450,
      image: 'bike1.jpg',
    },
    {
      id: 2,
      name: 'Road Bike Deluxe',
      price: 650,
      image: 'bike2.jpg',
    },
    {
      id: 3,
      name: 'City Bike Classic',
      price: 320,
      image: 'bike3.jpg',
    },
    {
      id: 4,
      name: 'Electric Bike Fast',
      price: 1200,
      image: 'bike4.jpg',
    },
  ];

  const handleExploreClick = () => {
    navigate('/bikes');
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', color: '#333' }}>
      {/* Hero Banner Section */}
      <section
        style={{
          backgroundColor: '#2c3e50',
          color: 'white',
          padding: '60px 20px',
          textAlign: 'center',
          marginBottom: '40px',
        }}
      >
        <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}>Buy and Sell Bikes Easily</h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>
          Find quality second-hand bicycles at great prices
        </p>
        <button
          onClick={handleExploreClick}
          style={{
            padding: '12px 30px',
            fontSize: '1rem',
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Explore Bikes
        </button>
      </section>

      {/* Featured Bikes Section */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '30px', textAlign: 'center' }}>Featured Bikes</h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '40px',
          }}
        >
          {featuredBikes.map((bike) => (
            <div
              key={bike.id}
              style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '15px',
                backgroundColor: '#f9f9f9',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
            >
              <BikeCard bike={bike} />
            </div>
          ))}
        </div>
      </section>

      {/* Footer Section */}
      <section
        style={{
          backgroundColor: '#ecf0f1',
          padding: '30px 20px',
          textAlign: 'center',
          marginTop: '40px',
        }}
      >
        <p>Ready to find your perfect bike? Start shopping now!</p>
      </section>
    </div>
  );
}

export default HomePage;
