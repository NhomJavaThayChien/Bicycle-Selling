import { useNavigate } from "react-router-dom";
import BikeCard from "../components/BikeCard";
import Footer from "../components/Footer";

function HomePage() {
  const navigate = useNavigate();

  // Mock featured bikes data
  const featuredBikes = [
    {
      id: 1,
      name: "Specialized Stumpjumper Pro",
      price: 45000000,
      image: "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?q=80&w=800&auto=format&fit=crop",
    },
    {
      id: 2,
      name: "Trek Domane SL 6 Deluxe",
      price: 65000000,
      image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 3,
      name: "Giant Escape 2 City Classic",
      price: 12500000,
      image: "https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: 4,
      name: "VanMoof S3 Electric Fast",
      price: 85000000,
      image: "https://images.unsplash.com/photo-1501147830916-ce44a6359892?auto=format&fit=crop&w=800&q=80",
    },
  ];

  const handleExploreClick = () => {
    navigate("/bikes");
  };

  const highlightItems = [
    {
      title: "Ưu đãi độc quyền",
      description: "Nhận thông báo về các chương trình giảm giá và mẫu xe mới nhất hàng tuần.",
    },
    {
      title: "Cộng đồng đam mê",
      description: "Tham gia cùng hơn 10.000 người yêu xe đạp trên khắp cả nước.",
    },
    {
      title: "Dịch vụ tận tâm",
      description: "Hỗ trợ kỹ thuật và tư vấn chọn xe phù hợp với nhu cầu của bạn 24/7.",
    },
  ];

  const newsItems = [
    {
      category: "Cẩm nang",
      title: "5 cung đường đạp xe đẹp nhất Việt Nam năm 2024",
      description:
        "Từ đèo Hải Vân đến vùng cao Tây Bắc, những địa điểm không thể bỏ qua cho các 'phượt thủ' hai bánh.",
    },
    {
      category: "Kỹ thuật",
      title: "Bảo dưỡng xích xe tại nhà: Đơn giản mà hiệu quả",
      description:
        "Chỉ với 15 phút mỗi tuần, bạn có thể kéo dài tuổi thọ của bộ truyền động lên gấp đôi.",
    },
    {
      category: "Xu hướng",
      title: "Xe đạp điện trợ lực: Tương lai của giao thông đô thị",
      description:
        "Tại sao ngày càng nhiều người chọn E-bike để đi làm thay vì xe máy hay ô tô?",
    },
  ];

  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="home-hero__content">
          <p className="home-hero__eyebrow">Chất lượng - Đam mê - Kết nối</p>
          <h1>Nâng tầm trải nghiệm đạp xe của bạn cùng Bicycle Market.</h1>
          <p className="home-hero__subtitle">
            Khám phá bộ sưu tập xe đạp đa dạng từ các thương hiệu hàng đầu thế giới. 
            Dù bạn là tay đua chuyên nghiệp hay người mới bắt đầu, chúng tôi luôn có 
            chiếc xe hoàn hảo dành riêng cho bạn.
          </p>

          <div className="home-hero__actions">
            <button
              onClick={handleExploreClick}
              className="primary-button home-hero__cta"
            >
              Bắt đầu hành trình ngay
            </button>
            <a href="#featured-bikes" className="home-hero__secondary-link">
              Khám phá bộ sưu tập
            </a>
          </div>

          <div className="home-hero__stats">
            <div>
              <strong>500+</strong>
              <span>Xe đạp có sẵn</span>
            </div>
            <div>
              <strong>5k+</strong>
              <span>Giao dịch thành công</span>
            </div>
            <div>
              <strong>4.9/5</strong>
              <span>Đánh giá từ khách hàng</span>
            </div>
          </div>
        </div>

        <div className="home-hero__panel">
          <div className="home-hero__panel-badge">Mới nhất</div>
          <h2>Tại sao nên chọn chúng tôi?</h2>
          <p>
            Chúng tôi mang đến sự minh bạch, tin cậy và giá trị thực chất trong từng giao dịch.
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
          <p className="eyebrow">Sản phẩm tiêu biểu</p>
          <h2>Những mẫu xe khách hàng yêu thích nhất</h2>
          <p>
            Được tuyển chọn kỹ lưỡng dựa trên tiêu chí chất lượng, độ bền và thiết kế vượt trội.
          </p>
        </div>

        <div className="featured-bike-grid">
          {featuredBikes.map((bike) => (
            <article key={bike.id} className="featured-bike-card">
              <BikeCard bike={bike} linkTo="/bikes" />
            </article>
          ))}
        </div>
      </section>

      <section className="home-section home-insights">
        <div className="section-heading section-heading--center">
          <p className="eyebrow">Kiến thức & Tin tức</p>
          <h2>Chia sẻ đam mê, lan tỏa lối sống xanh</h2>
          <p>
            Cập nhật những xu hướng mới nhất và mẹo vặt hữu ích cho cộng đồng yêu xe đạp.
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
            <p className="social-strip__title">Gia nhập cộng đồng Bicycle Market</p>
            <p>
              Theo dõi chúng tôi trên các nền tảng mạng xã hội để không bỏ lỡ bất kỳ ưu đãi nào.
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
              href="mailto:contact@bicyclemarket.vn"
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
