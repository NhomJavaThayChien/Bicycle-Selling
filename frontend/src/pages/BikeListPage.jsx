import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getListings } from "../services/bikeService";
import BikeCard from "../components/BikeCard";

function BikeListPage() {
  const navigate = useNavigate();
  const [allListings, setAllListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  // State for filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("ALL");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedCondition, setSelectedCondition] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 20000000 });
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const sortConfig = useMemo(() => {
    if (sortBy === "price-asc") return { sortBy: "price", sortDir: "asc" };
    if (sortBy === "price-desc") return { sortBy: "price", sortDir: "desc" };
    if (sortBy === "name") return { sortBy: "title", sortDir: "asc" };
    return { sortBy: "createdAt", sortDir: "desc" };
  }, [sortBy]);

  const brands = useMemo(
    () => [
      "ALL",
      ...new Set(allListings.map((item) => item.brandName).filter(Boolean)),
    ],
    [allListings],
  );
  const categories = useMemo(
    () => [
      "ALL",
      ...new Set(allListings.map((item) => item.categoryName).filter(Boolean)),
    ],
    [allListings],
  );
  const conditions = ["all", "NEW", "LIKE_NEW", "GOOD", "FAIR", "POOR"];

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await getListings({
          keyword: searchQuery || undefined,
          condition:
            selectedCondition !== "all" ? selectedCondition : undefined,
          priceMin: priceRange.min > 0 ? priceRange.min : undefined,
          priceMax: priceRange.max < 20000000 ? priceRange.max : undefined,
          sortBy: sortConfig.sortBy,
          sortDir: sortConfig.sortDir,
          page: 0,
          size: 200,
        });

        const pageData = response.data;
        const content = Array.isArray(pageData?.content)
          ? pageData.content
          : [];
        setAllListings(content);
      } catch {
        setError(
          "Khong ket noi duoc backend API. Hay chay backend o cong 8080 roi thu lai.",
        );
        setAllListings([]);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [
    searchQuery,
    selectedCondition,
    priceRange.min,
    priceRange.max,
    sortConfig,
    reloadKey,
  ]);

  useEffect(() => {
    let result = [...allListings];

    if (selectedBrand !== "ALL") {
      result = result.filter((item) => item.brandName === selectedBrand);
    }

    if (selectedCategory !== "ALL") {
      result = result.filter((item) => item.categoryName === selectedCategory);
    }

    setFilteredListings(result);
    setCurrentPage(1);
  }, [allListings, selectedBrand, selectedCategory]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredListings.length / itemsPerPage),
  );
  const paginatedListings = filteredListings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
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
    setSearchQuery("");
    setSelectedBrand("ALL");
    setSelectedCategory("ALL");
    setSelectedCondition("all");
    setPriceRange({ min: 0, max: 20000000 });
    setSortBy("newest");
    setCurrentPage(1);
  };

  const handleRetry = () => {
    setReloadKey((prev) => prev + 1);
  };

  // Render
  return (
    <div className="bike-list-container">
      {/* Sidebar Filter */}
      <aside className="filters-sidebar">
        <h3>Bộ lọc tìm kiếm</h3>

        {/* Search */}
        <div className="filter-group">
          <label>Tìm kiếm</label>
          <input
            type="text"
            placeholder="Tên xe, thương hiệu..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        {/* Brand Filter */}
        <div className="filter-group">
          <label>Thương hiệu</label>
          <select value={selectedBrand} onChange={handleBrandChange}>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand === "ALL" ? "Tất cả thương hiệu" : brand}
              </option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div className="filter-group">
          <label>Danh mục</label>
          <select value={selectedCategory} onChange={handleCategoryChange}>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category === "ALL" ? "Tất cả danh mục" : category}
              </option>
            ))}
          </select>
        </div>

        {/* Condition Filter */}
        <div className="filter-group">
          <label>Tình trạng</label>
          <select value={selectedCondition} onChange={handleConditionChange}>
            {conditions.map((condition) => (
              <option key={condition} value={condition}>
                {condition === "all" ? "Mọi tình trạng" : condition}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range Filter */}
        <div className="filter-group">
          <label>Khoảng giá (VND)</label>
          <div className="price-inputs">
            <input
              type="number"
              placeholder="Min"
              value={priceRange.min}
              onChange={(e) => handlePriceChange("min", e.target.value)}
            />
            <input
              type="number"
              placeholder="Max"
              value={priceRange.max}
              onChange={(e) => handlePriceChange("max", e.target.value)}
            />
          </div>
          <span className="price-display">
            {`${priceRange.min.toLocaleString()} - ${priceRange.max.toLocaleString()} VND`}
          </span>
        </div>

        {/* Clear Filters */}
        <button className="clear-filters-btn" onClick={handleClearFilters}>
          Xóa tất cả bộ lọc
        </button>
      </aside>

      {/* Main Content */}
      <main className="bike-list-main">
        <header>
          <h1>Khám phá xe đạp</h1>
          <div className="results-info">
            <p className="results-count">
              Tìm thấy <strong>{filteredListings.length}</strong> sản phẩm
              {totalPages > 1 && ` | Trang ${currentPage} / ${totalPages}`}
            </p>
            <select className="sort-select" value={sortBy} onChange={handleSortChange}>
              <option value="newest">Mới nhất</option>
              <option value="price-asc">Giá: Thấp đến Cao</option>
              <option value="price-desc">Giá: Cao đến Thấp</option>
              <option value="name">Tên: A đến Z</option>
            </select>
          </div>
        </header>

        {error && (
          <div className="alert alert-error">
            <p>{error}</p>
            <button className="ghost-button" onClick={handleRetry} style={{ marginTop: '10px' }}>
              Thử lại kết nối API
            </button>
          </div>
        )}

        {loading ? (
          <div className="bikes-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bike-item-card">
                <div className="skeleton" style={{ height: '200px', borderRadius: '24px', marginBottom: '16px' }}></div>
                <div className="skeleton" style={{ height: '24px', width: '70%', marginBottom: '12px' }}></div>
                <div className="skeleton" style={{ height: '20px', width: '40%', marginBottom: '24px' }}></div>
                <div className="bike-meta" style={{ padding: 0 }}>
                  <div className="bike-tags">
                    <div className="skeleton" style={{ width: '60px', height: '24px', borderRadius: '6px' }}></div>
                    <div className="skeleton" style={{ width: '60px', height: '24px', borderRadius: '6px' }}></div>
                  </div>
                  <div className="skeleton" style={{ width: '100%', height: '44px', borderRadius: '12px' }}></div>
                </div>
              </div>
            ))}
          </div>
        ) : paginatedListings.length > 0 ? (
          <>
            <div className="bikes-grid">
              {paginatedListings.map((bike) => (
                <div key={bike.id} className="bike-item-card">
                  <BikeCard bike={bike} />
                  <div className="bike-meta">
                    <div className="bike-tags">
                      <span className="tag tag-location">{bike.location || 'N/A'}</span>
                      <span className="tag tag-condition">{bike.condition}</span>
                    </div>
                    <button
                      className="view-detail-btn"
                      onClick={() => navigate(`/bikes/${bike.id}`)}
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination-container">
                <button
                  className="page-btn"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Trước
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    className={`page-btn ${page === currentPage ? "active" : ""}`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}

                <button
                  className="page-btn"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Sau
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <h2>Không tìm thấy xe phù hợp</h2>
            <p>Hãy thử thay đổi từ khóa tìm kiếm hoặc điều chỉnh bộ lọc.</p>
            <button className="primary-button" onClick={handleClearFilters}>
              Đặt lại bộ lọc
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default BikeListPage;
