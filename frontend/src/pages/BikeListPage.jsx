import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getListings } from '../services/bikeService';
import BikeCard from '../components/BikeCard';

function BikeListPage() {
  const navigate = useNavigate();
  const [allListings, setAllListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  // State for filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedCondition, setSelectedCondition] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 20000000 });
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const sortConfig = useMemo(() => {
    if (sortBy === 'price-asc') return { sortBy: 'price', sortDir: 'asc' };
    if (sortBy === 'price-desc') return { sortBy: 'price', sortDir: 'desc' };
    if (sortBy === 'name') return { sortBy: 'title', sortDir: 'asc' };
    return { sortBy: 'createdAt', sortDir: 'desc' };
  }, [sortBy]);

  const brands = useMemo(
    () => ['ALL', ...new Set(allListings.map((item) => item.brandName).filter(Boolean))],
    [allListings]
  );
  const categories = useMemo(
    () => ['ALL', ...new Set(allListings.map((item) => item.categoryName).filter(Boolean))],
    [allListings]
  );
  const conditions = ['all', 'NEW', 'LIKE_NEW', 'GOOD', 'FAIR', 'POOR'];

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getListings({
          keyword: searchQuery || undefined,
          condition: selectedCondition !== 'all' ? selectedCondition : undefined,
          priceMin: priceRange.min > 0 ? priceRange.min : undefined,
          priceMax: priceRange.max < 20000000 ? priceRange.max : undefined,
          sortBy: sortConfig.sortBy,
          sortDir: sortConfig.sortDir,
          page: 0,
          size: 200,
        });

        const pageData = response.data;
        const content = Array.isArray(pageData?.content) ? pageData.content : [];
        setAllListings(content);
      } catch {
        setError('Khong ket noi duoc backend API. Hay chay backend o cong 8080 roi thu lai.');
        setAllListings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [searchQuery, selectedCondition, priceRange.min, priceRange.max, sortConfig, reloadKey]);

  useEffect(() => {
    let result = [...allListings];

    if (selectedBrand !== 'ALL') {
      result = result.filter((item) => item.brandName === selectedBrand);
    }

    if (selectedCategory !== 'ALL') {
      result = result.filter((item) => item.categoryName === selectedCategory);
    }

    setFilteredListings(result);
    setCurrentPage(1);
  }, [allListings, selectedBrand, selectedCategory]);

  const totalPages = Math.max(1, Math.ceil(filteredListings.length / itemsPerPage));
  const paginatedListings = filteredListings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Handlers
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleBrandChange = (e) => {
    setSelectedBrand(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleConditionChange = (e) => {
    setSelectedCondition(e.target.value);
  };

  const handlePriceChange = (type, value) => {
    setPriceRange((prev) => ({
      ...prev,
      [type]: parseInt(value) || 0,
    }));
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedBrand('ALL');
    setSelectedCategory('ALL');
    setSelectedCondition('all');
    setPriceRange({ min: 0, max: 20000000 });
    setSortBy('newest');
    setCurrentPage(1);
  };

  const handleRetry = () => {
    setReloadKey((prev) => prev + 1);
  };

  // Render
  if (loading) {
    return (
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px' }}>
        <p>Loading bikes...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px', display: 'flex', gap: '20px' }}>
      {/* Sidebar Filter */}
      <aside
        style={{
          width: '280px',
          backgroundColor: '#f9f9f9',
          padding: '20px',
          borderRadius: '8px',
          border: '1px solid #ddd',
          height: 'fit-content',
        }}
      >
        <h3>Filters</h3>

        {/* Search */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Search</label>
          <input
            type="text"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={handleSearchChange}
            style={{
              width: '100%',
              padding: '8px',
              fontSize: '0.9rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Brand Filter */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Brand</label>
          <select
            value={selectedBrand}
            onChange={handleBrandChange}
            style={{
              width: '100%',
              padding: '8px',
              fontSize: '0.9rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
            }}
          >
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Category</label>
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            style={{
              width: '100%',
              padding: '8px',
              fontSize: '0.9rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
            }}
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Condition Filter */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Condition</label>
          <select
            value={selectedCondition}
            onChange={handleConditionChange}
            style={{
              width: '100%',
              padding: '8px',
              fontSize: '0.9rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
            }}
          >
            {conditions.map((condition) => (
              <option key={condition} value={condition}>
                {condition}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range Filter */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Price Range</label>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input
              type="number"
              placeholder="Min"
              value={priceRange.min}
              onChange={(e) => handlePriceChange('min', e.target.value)}
              style={{
                flex: 1,
                padding: '8px',
                fontSize: '0.9rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
              }}
            />
            <input
              type="number"
              placeholder="Max"
              value={priceRange.max}
              onChange={(e) => handlePriceChange('max', e.target.value)}
              style={{
                flex: 1,
                padding: '8px',
                fontSize: '0.9rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
              }}
            />
          </div>
          <small>{`${priceRange.min.toLocaleString()} - ${priceRange.max.toLocaleString()} VND`}</small>
        </div>

        {/* Clear Filters */}
        <button
          onClick={handleClearFilters}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#95a5a6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Clear All Filters
        </button>
      </aside>

      {/* Main Content */}
      <section style={{ flex: 1 }}>
        {/* Header */}
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ marginBottom: '20px' }}>Browse Bikes</h1>

          {/* Sorting and Results Info */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              flexWrap: 'wrap',
              gap: '10px',
            }}
          >
            <p style={{ color: '#666' }}>
              Found {filteredListings.length} bike(s)
              {totalPages > 1 && ` | Page ${currentPage} of ${totalPages}`}
            </p>
            <select
              value={sortBy}
              onChange={handleSortChange}
              style={{
                padding: '8px 12px',
                fontSize: '0.9rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              <option value="newest">Newest</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* Bikes Grid */}
        {error && (
          <div
            style={{
              marginBottom: '12px',
              border: '1px solid #f5c2c7',
              backgroundColor: '#fff3f5',
              color: '#b42318',
              padding: '12px',
              borderRadius: '6px',
            }}
          >
            <p style={{ margin: 0 }}>{error}</p>
            <button
              type="button"
              onClick={handleRetry}
              style={{
                marginTop: '10px',
                padding: '8px 12px',
                backgroundColor: '#344054',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Thu lai ket noi API
            </button>
          </div>
        )}

        {paginatedListings.length > 0 ? (
          <>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '20px',
                marginBottom: '30px',
              }}
            >
              {paginatedListings.map((bike) => (
                <div
                  key={bike.id}
                  style={{
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '15px',
                    backgroundColor: '#f9f9f9',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    transition: 'transform 0.2s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <BikeCard bike={bike} />
                  <p style={{ marginTop: '10px', fontSize: '0.85rem', color: '#999' }}>
                    {bike.location} | {bike.condition}
                  </p>
                  <button type="button" onClick={() => navigate(`/bikes/${bike.id}`)}>
                    View detail
                  </button>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '10px',
                  alignItems: 'center',
                  marginTop: '30px',
                }}
              >
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: currentPage === 1 ? '#ccc' : '#3498db',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  }}
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    style={{
                      padding: '8px 12px',
                      backgroundColor: page === currentPage ? '#2c3e50' : '#ecf0f1',
                      color: page === currentPage ? 'white' : '#333',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontWeight: page === currentPage ? 'bold' : 'normal',
                    }}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: currentPage === totalPages ? '#ccc' : '#3498db',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  }}
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              backgroundColor: '#f5f5f5',
              borderRadius: '8px',
            }}
          >
            <h2>No bikes found</h2>
            <p>Try adjusting your search or filters</p>
            <button
              onClick={handleClearFilters}
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                fontSize: '1rem',
                backgroundColor: '#e74c3c',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              Clear All Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export default BikeListPage;
