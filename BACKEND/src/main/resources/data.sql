-- Ensure deterministic IDs for automated tests
INSERT INTO brands (id, name, country, is_active, created_at)
VALUES (1, 'TEST_BRAND_ID_1', 'N/A', true, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

INSERT INTO brands (id, name, country, is_active, created_at)
VALUES (2, 'TEST_BRAND_ID_2', 'N/A', true, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

INSERT INTO categories (id, name, description, is_active, created_at)
VALUES (1, 'TEST_CATEGORY_ID_1', 'Reserved test fixture category for API scripts.', true, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- Real brands (auto-generated IDs, no FK conflicts)
INSERT INTO brands (name, country, is_active, created_at) 
VALUES ('Giant', 'Taiwan', true, CURRENT_TIMESTAMP)
ON CONFLICT (name) DO NOTHING;

INSERT INTO brands (name, country, is_active, created_at) 
VALUES ('Trek', 'USA', true, CURRENT_TIMESTAMP)
ON CONFLICT (name) DO NOTHING;

INSERT INTO brands (name, country, is_active, created_at) 
VALUES ('Specialized', 'USA', true, CURRENT_TIMESTAMP)
ON CONFLICT (name) DO NOTHING;

-- Real categories (auto-generated IDs, no FK conflicts)
INSERT INTO categories (name, description, is_active, created_at) 
VALUES ('Road Bike', 'Xe đạp đua đường trường, trọng lượng nhẹ, lốp nhỏ.', true, CURRENT_TIMESTAMP)
ON CONFLICT (name) DO NOTHING;

INSERT INTO categories (name, description, is_active, created_at) 
VALUES ('Mountain Bike (MTB)', 'Xe đạp địa hình, giảm xóc tốt, lốp to.', true, CURRENT_TIMESTAMP)
ON CONFLICT (name) DO NOTHING;

-- Ensure bcrypt hashing support for seeded passwords
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Sample users
INSERT INTO users (username, email, password, full_name, role, is_active, reputation_score, created_at) 
VALUES ('admin', 'admin@bicycle.com', crypt('123456', gen_salt('bf', 10)), 'Hệ Thống Quản Trị', 'ADMIN', true, 5.0, CURRENT_TIMESTAMP)
ON CONFLICT (username) DO UPDATE SET
	password = EXCLUDED.password,
	email = EXCLUDED.email,
	full_name = EXCLUDED.full_name,
	role = EXCLUDED.role,
	is_active = EXCLUDED.is_active,
	reputation_score = EXCLUDED.reputation_score;

INSERT INTO users (username, email, password, full_name, role, is_active, reputation_score, created_at) 
VALUES ('seller_thanh', 'thanh@gmail.com', crypt('123456', gen_salt('bf', 10)), 'Nguyễn Văn Thanh', 'SELLER', true, 4.8, CURRENT_TIMESTAMP)
ON CONFLICT (username) DO UPDATE SET
	password = EXCLUDED.password,
	email = EXCLUDED.email,
	full_name = EXCLUDED.full_name,
	role = EXCLUDED.role,
	is_active = EXCLUDED.is_active,
	reputation_score = EXCLUDED.reputation_score;

INSERT INTO users (username, email, password, full_name, role, is_active, reputation_score, created_at) 
VALUES ('buyer_minh', 'minh@gmail.com', crypt('123456', gen_salt('bf', 10)), 'Trần Quang Minh', 'BUYER', true, 5.0, CURRENT_TIMESTAMP)
ON CONFLICT (username) DO UPDATE SET
	password = EXCLUDED.password,
	email = EXCLUDED.email,
	full_name = EXCLUDED.full_name,
	role = EXCLUDED.role,
    is_active = EXCLUDED.is_active,
	reputation_score = EXCLUDED.reputation_score;

	-- Sample Inspector
INSERT INTO users (username, email, password, full_name, role, is_active, reputation_score, created_at) 
VALUES ('inspector', 'inspector@bicycle.com', crypt('123456', gen_salt('bf', 10)), 'Nhân Viên Kiểm Định', 'INSPECTOR', true, 5.0, CURRENT_TIMESTAMP)
ON CONFLICT (username) DO UPDATE SET
    password = EXCLUDED.password,
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    is_active = EXCLUDED.is_active,
    reputation_score = EXCLUDED.reputation_score;