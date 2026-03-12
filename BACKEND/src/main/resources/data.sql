-- 1. Thêm các thương hiệu (Brands)
INSERT INTO brands (name, country, is_active, created_at) 
VALUES ('Giant', 'Taiwan', true, CURRENT_TIMESTAMP)
ON CONFLICT (name) DO NOTHING;

INSERT INTO brands (name, country, is_active, created_at) 
VALUES ('Trek', 'USA', true, CURRENT_TIMESTAMP)
ON CONFLICT (name) DO NOTHING;

INSERT INTO brands (name, country, is_active, created_at) 
VALUES ('Specialized', 'USA', true, CURRENT_TIMESTAMP)
ON CONFLICT (name) DO NOTHING;

-- 2. Thêm các danh mục (Categories)
INSERT INTO categories (name, description, is_active, created_at) 
VALUES ('Road Bike', 'Xe đạp đua đường trường, trọng lượng nhẹ, lốp nhỏ.', true, CURRENT_TIMESTAMP)
ON CONFLICT (name) DO NOTHING;

INSERT INTO categories (name, description, is_active, created_at) 
VALUES ('Mountain Bike (MTB)', 'Xe đạp địa hình, giảm xóc tốt, lốp to.', true, CURRENT_TIMESTAMP)
ON CONFLICT (name) DO NOTHING;

-- 3. Thêm người dùng mẫu
INSERT INTO users (username, email, password, full_name, role, is_active, reputation_score, created_at) 
VALUES ('admin', 'admin@bicycle.com', '123456', 'Hệ Thống Quản Trị', 'ADMIN', true, 5.0, CURRENT_TIMESTAMP)
ON CONFLICT (username) DO NOTHING;

INSERT INTO users (username, email, password, full_name, role, is_active, reputation_score, created_at) 
VALUES ('seller_thanh', 'thanh@gmail.com', '123456', 'Nguyễn Văn Thanh', 'SELLER', true, 4.8, CURRENT_TIMESTAMP)
ON CONFLICT (username) DO NOTHING;

INSERT INTO users (username, email, password, full_name, role, is_active, reputation_score, created_at) 
VALUES ('buyer_minh', 'minh@gmail.com', '123456', 'Trần Quang Minh', 'BUYER', true, 5.0, CURRENT_TIMESTAMP)
ON CONFLICT (username) DO NOTHING;
