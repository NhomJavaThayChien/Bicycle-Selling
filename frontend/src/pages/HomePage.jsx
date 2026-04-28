import { useNavigate } from "react-router-dom";
import BikeCard from "../components/BikeCard";
import Footer from "../components/Footer";

function HomePage() {
  const navigate = useNavigate();

  // Mock featured bikes data
  const featuredBikes = [
    {
      id: 1,
      name: "Mountain Bike Pro",
      price: 450,
      image: "bike1.jpg",
    },
    {
      id: 2,
      name: "Road Bike Deluxe",
      price: 650,
      image: "bike2.jpg",
    },
    {
      id: 3,
      name: "City Bike Classic",
      price: 320,
      image: "bike3.jpg",
    },
    {
      id: 4,
      name: "Electric Bike Fast",
      price: 1200,
      image: "bike4.jpg",
    },
  ];

  const handleExploreClick = () => {
    navigate("/bikes");
  };

  const highlightItems = [
    {
      title: "Xe nổi bật mỗi ngày",
      description: "Bộ sưu tập được chọn lọc theo nhu cầu mua nhanh, xem gọn.",
    },
    {
      title: "Thông tin rõ ràng",
      description: "Giá, tình trạng và danh mục được trình bày trực quan hơn.",
    },
    {
      title: "Kết nối nhanh",
      description: "Theo dõi kênh mạng xã hội và cập nhật tin tức mới ngay cuối trang.",
    },
  ];

  const newsItems = [
    {
      category: "Tin mới",
      title: "Xu hướng xe đạp đô thị đang quay lại mạnh mẽ",
      description:
        "Người dùng ưu tiên khung nhẹ, thiết kế đẹp và dễ bảo trì cho di chuyển hàng ngày.",
    },
    {
      category: "Mẹo mua hàng",
      title: "Cách xem nhanh một chiếc xe đã qua sử dụng",
      description:
        "Kiểm tra phanh, bánh, xích và khung trước khi đặt cọc để giảm rủi ro.",
    },
    {
      category: "Gợi ý chuyên nghiệp",
      title: "Chụp ảnh sản phẩm rõ nền giúp tăng khả năng bán",
      description:
        "Ảnh sáng, đủ góc chụp và mô tả ngắn gọn luôn tạo cảm giác tin cậy hơn.",
    },
  ];

  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="home-hero__content">
          <p className="home-hero__eyebrow">Chợ xe đạp thông minh</p>
          <h1>Khám phá, mua và bán xe đạp với trải nghiệm bắt mắt hơn.</h1>
          <p className="home-hero__subtitle">
            Trang chủ mới tập trung vào những mẫu xe nổi bật, cách trình bày
            rõ ràng hơn và phần thông tin cuối trang giúp giao diện chuyên
            nghiệp, sinh động hơn ngay từ lần đầu mở.
          </p>

          <div className="home-hero__actions">
            <button
              onClick={handleExploreClick}
              className="primary-button home-hero__cta"
            >
              Khám phá xe đạp
            </button>
            <a href="#featured-bikes" className="home-hero__secondary-link">
              Xem xe nổi bật
            </a>
          </div>

          <div className="home-hero__stats">
            <div>
              <strong>100+</strong>
              <span>Mẫu xe đa dạng</span>
            </div>
            <div>
              <strong>24h</strong>
              <span>Cập nhật liên tục</span>
            </div>
            <div>
              <strong>3 kênh</strong>
              <span>Facebook, Zalo, liên hệ nhanh</span>
            </div>
          </div>
        </div>

        <div className="home-hero__panel">
          <div className="home-hero__panel-badge">Gợi ý nhanh</div>
          <h2>Một giao diện có chiều sâu hơn cho trang mở đầu</h2>
          <p>
            Bố cục này nhấn mạnh điểm nổi bật, giúp khách truy cập dễ quét thông
            tin và có cảm giác như đang ở một marketplace thực thụ.
          </p>
          <div className="home-hero__panel-list">
            {highlightItems.map((item) => (
              <article key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section" id="featured-bikes">
        <div className="section-heading section-heading--center">
          <p className="eyebrow">Xe đạp nổi bật</p>
          <h2>Chọn nhanh những mẫu đang được quan tâm</h2>
          <p>
            Dữ liệu hiện có vẫn giữ nguyên, chỉ thay đổi cách hiển thị để nhìn
            sáng hơn và chuyên nghiệp hơn.
          </p>
        </div>

        <div className="featured-bike-grid">
          {featuredBikes.map((bike) => (
            <article key={bike.id} className="featured-bike-card">
              <BikeCard bike={bike} />
            </article>
          ))}
        </div>
      </section>

      <section className="home-section home-insights">
        <div className="section-heading section-heading--center">
          <p className="eyebrow">Tin tức & mẹo hay</p>
          <h2>Phần cuối trang có thêm nội dung đọc nhanh</h2>
          <p>
            Khu vực này giúp trang chủ trông đầy đặn hơn, đồng thời tạo cảm giác
            chuyên nghiệp trước khi người dùng bấm sang danh mục xe.
          </p>
        </div>

        <div className="news-grid">
          {newsItems.map((item) => (
            <article key={item.title} className="news-card">
              <span className="news-card__tag">{item.category}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>

        <div className="social-strip">
          <div>
            <p className="social-strip__title">Kết nối nhanh</p>
            <p>
              Thêm liên kết mạng xã hội ở cuối trang để người xem cảm thấy ứng
              dụng hoàn chỉnh hơn.
            </p>
          </div>
          <div className="social-links">
            <a
              href="https://www.facebook.com/"
              target="_blank"
              rel="noreferrer"
              className="social-link"
              aria-label="Facebook"
            >
              <span>f</span>
              Facebook
            </a>
            <a
              href="https://zalo.me/"
              target="_blank"
              rel="noreferrer"
              className="social-link"
              aria-label="Zalo"
            >
              <span>Z</span>
              Zalo
            </a>
            <a
              href="mailto:hello@bicycle-selling.local"
              className="social-link"
              aria-label="Email"
            >
              <span>@</span>
              Email
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default HomePage;
