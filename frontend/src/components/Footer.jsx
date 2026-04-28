function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__brand">
        <p className="site-footer__eyebrow">Bicycle Selling</p>
        <h2>Thông tin hữu ích và liên kết nhanh</h2>
        <p>
          Cập nhật tin tức, mẹo mua xe và các kênh liên hệ giúp trang chủ trông
          đầy đủ hơn ở phần cuối.
        </p>
      </div>

      <div className="site-footer__columns">
        <div>
          <h3>Liên kết nhanh</h3>
          <a href="/bikes">Danh sách xe</a>
          <a href="/register">Đăng ký tài khoản</a>
          <a href="/login">Đăng nhập</a>
        </div>
        <div>
          <h3>Kết nối xã hội</h3>
          <a href="https://www.facebook.com/" target="_blank" rel="noreferrer">
            Facebook
          </a>
          <a href="https://zalo.me/" target="_blank" rel="noreferrer">
            Zalo
          </a>
          <a href="mailto:hello@bicycle-selling.local">Email hỗ trợ</a>
        </div>
      </div>

      <div className="site-footer__bottom">
        <span>Giao diện tối ưu cho trải nghiệm mua bán xe đạp.</span>
        <span>Luồng dữ liệu và chức năng gốc không thay đổi.</span>
      </div>
    </footer>
  );
}

export default Footer;
