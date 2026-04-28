-- ============================================================
-- SEED DATA - Bicycle Selling Platform
-- Passwords are BCrypt hashed from "123456"
-- hash: $2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.
-- ============================================================

-- Ensure deterministic IDs for automated tests
INSERT INTO brands (id, name, country, is_active, created_at)
VALUES (1, 'TEST_BRAND_ID_1', 'N/A', true, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

INSERT INTO brands (id, name, country, is_active, created_at)
VALUES (2, 'TEST_BRAND_ID_2', 'N/A', true, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

-- ============ REAL BRANDS ============
INSERT INTO brands (name, country, is_active, created_at)
VALUES ('Giant', 'Taiwan', true, CURRENT_TIMESTAMP)
ON CONFLICT (name) DO NOTHING;

INSERT INTO brands (name, country, is_active, created_at)
VALUES ('Trek', 'USA', true, CURRENT_TIMESTAMP)
ON CONFLICT (name) DO NOTHING;

INSERT INTO brands (name, country, is_active, created_at)
VALUES ('Specialized', 'USA', true, CURRENT_TIMESTAMP)
ON CONFLICT (name) DO NOTHING;

INSERT INTO brands (name, country, is_active, created_at)
VALUES ('Cannondale', 'USA', true, CURRENT_TIMESTAMP)
ON CONFLICT (name) DO NOTHING;

INSERT INTO brands (name, country, is_active, created_at)
VALUES ('Merida', 'Taiwan', true, CURRENT_TIMESTAMP)
ON CONFLICT (name) DO NOTHING;

INSERT INTO brands (name, country, is_active, created_at)
VALUES ('Scott', 'Switzerland', true, CURRENT_TIMESTAMP)
ON CONFLICT (name) DO NOTHING;

INSERT INTO brands (name, country, is_active, created_at)
VALUES ('Bianchi', 'Italy', true, CURRENT_TIMESTAMP)
ON CONFLICT (name) DO NOTHING;

-- ============ CATEGORIES ============
INSERT INTO categories (id, name, description, is_active, created_at)
VALUES (1, 'TEST_CATEGORY_ID_1', 'Reserved test fixture category for API scripts.', true, CURRENT_TIMESTAMP)
ON CONFLICT (id) DO NOTHING;

INSERT INTO categories (name, description, is_active, created_at)
VALUES ('Road Bike', 'Xe đạp đua đường trường, trọng lượng nhẹ, lốp nhỏ.', true, CURRENT_TIMESTAMP)
ON CONFLICT (name) DO NOTHING;

INSERT INTO categories (name, description, is_active, created_at)
VALUES ('Mountain Bike (MTB)', 'Xe đạp địa hình, giảm xóc tốt, lốp to.', true, CURRENT_TIMESTAMP)
ON CONFLICT (name) DO NOTHING;

INSERT INTO categories (name, description, is_active, created_at)
VALUES ('City / Hybrid Bike', 'Xe đạp đi phố, thiết kế linh hoạt cho đường đô thị.', true, CURRENT_TIMESTAMP)
ON CONFLICT (name) DO NOTHING;

INSERT INTO categories (name, description, is_active, created_at)
VALUES ('Gravel Bike', 'Xe đạp đa địa hình - vừa đường nhựa vừa đường đất.', true, CURRENT_TIMESTAMP)
ON CONFLICT (name) DO NOTHING;

INSERT INTO categories (name, description, is_active, created_at)
VALUES ('Track / Fixed Gear', 'Xe đạp đua vòng, không có hộp số.', true, CURRENT_TIMESTAMP)
ON CONFLICT (name) DO NOTHING;

INSERT INTO categories (name, description, is_active, created_at)
VALUES ('Folding Bike', 'Xe đạp gấp gọn, tiện di chuyển và mang theo.', true, CURRENT_TIMESTAMP)
ON CONFLICT (name) DO NOTHING;

-- ============ USERS ============
INSERT INTO users (username, email, password, full_name, phone, address, role, is_active, reputation_score, total_sales, total_reviews, created_at)
VALUES (
    'admin',
    'admin@bicycleshop.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.',
    'Hệ Thống Quản Trị',
    '0900000000',
    'TP. Hồ Chí Minh',
    'ADMIN',
    true, 5.0, 0, 0, CURRENT_TIMESTAMP
) ON CONFLICT (username) DO NOTHING;

INSERT INTO users (username, email, password, full_name, phone, address, role, is_active, reputation_score, total_sales, total_reviews, created_at)
VALUES (
    'seller_thanh',
    'thanh@gmail.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.',
    'Nguyễn Văn Thanh',
    '0912345678',
    'Quận 1, TP. Hồ Chí Minh',
    'SELLER',
    true, 4.8, 12, 10, CURRENT_TIMESTAMP
) ON CONFLICT (username) DO NOTHING;

INSERT INTO users (username, email, password, full_name, phone, address, role, is_active, reputation_score, total_sales, total_reviews, created_at)
VALUES (
    'seller_lan',
    'lan@gmail.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.',
    'Trần Thị Lan',
    '0987654321',
    'Quận Bình Thạnh, TP. Hồ Chí Minh',
    'SELLER',
    true, 4.5, 5, 6, CURRENT_TIMESTAMP
) ON CONFLICT (username) DO NOTHING;

INSERT INTO users (username, email, password, full_name, phone, address, role, is_active, reputation_score, total_sales, total_reviews, created_at)
VALUES (
    'buyer_minh',
    'minh@gmail.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.',
    'Trần Quang Minh',
    '0911111111',
    'Quận 7, TP. Hồ Chí Minh',
    'BUYER',
    true, 5.0, 0, 0, CURRENT_TIMESTAMP
) ON CONFLICT (username) DO NOTHING;

INSERT INTO users (username, email, password, full_name, phone, address, role, is_active, reputation_score, total_sales, total_reviews, created_at)
VALUES (
    'buyer_hoa',
    'hoa@gmail.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.',
    'Lê Thị Hoa',
    '0922222222',
    'Quận Gò Vấp, TP. Hồ Chí Minh',
    'BUYER',
    true, 4.9, 0, 0, CURRENT_TIMESTAMP
) ON CONFLICT (username) DO NOTHING;

INSERT INTO users (username, email, password, full_name, phone, address, role, is_active, reputation_score, total_sales, total_reviews, created_at)
VALUES (
    'inspector_nam',
    'nam@bicycle-inspect.com',
    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2uheWG/igi.',
    'Phạm Văn Nam (Kiểm định viên)',
    '0933333333',
    'Quận 3, TP. Hồ Chí Minh',
    'INSPECTOR',
    true, 5.0, 0, 0, CURRENT_TIMESTAMP
) ON CONFLICT (username) DO NOTHING;

-- ============ BICYCLE LISTINGS ============
-- Dùng INSERT ... SELECT để gộp FK seller_id / brand_id / category_id trong cùng 1 câu

-- Listing 1: Giant Contend AR 2 (Road Bike) - seller_thanh
INSERT INTO bicycle_listings (
    title, description, manufacture_year, frame_size, frame_material,
    speed_count, drivetrain, brake_type, wheel_size, weight_kg, color,
    condition, usage_history, accessories, reason_for_selling,
    price, is_negotiable, location, status, is_inspected, view_count,
    seller_id, brand_id, category_id, created_at
)
SELECT
    'Giant Contend AR 2 2022 - Xe đua đường trường như mới',
    'Xe đạp road Giant Contend AR 2 năm 2022, đi được khoảng 800km. Xe còn rất mới, được bảo dưỡng định kỳ tại cửa hàng Giant. Khung nhôm ALUXX, groupset Shimano Claris 16 tốc độ, phanh đĩa cơ học. Phù hợp người mới tập road bike hoặc đi làm hàng ngày.',
    2022, 'M', 'Aluminum',
    16, 'Shimano Claris R2000', 'Disc Mechanical', '700c', 9.50, 'Đen / Đỏ',
    'LIKE_NEW',
    'Đi được khoảng 800km, chủ yếu đi cuối tuần. Bảo dưỡng tại Giant shop tháng 11/2023.',
    'Đèn trước sau, khóa bánh, bơm mini, túi yên.',
    'Lên xe carbon nên cần bán lại.',
    6500000, true, 'Quận 1, TP. Hồ Chí Minh', 'APPROVED', false, 0,
    (SELECT id FROM users WHERE username = 'seller_thanh'),
    (SELECT id FROM brands WHERE name = 'Giant'),
    (SELECT id FROM categories WHERE name = 'Road Bike'),
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM bicycle_listings WHERE title = 'Giant Contend AR 2 2022 - Xe đua đường trường như mới'
);

-- Listing 2: Trek Marlin 5 (MTB) - seller_thanh
INSERT INTO bicycle_listings (
    title, description, manufacture_year, frame_size, frame_material,
    speed_count, drivetrain, brake_type, wheel_size, weight_kg, color,
    condition, usage_history, accessories, reason_for_selling,
    price, is_negotiable, location, status, is_inspected, view_count,
    seller_id, brand_id, category_id, created_at
)
SELECT
    'Trek Marlin 5 2021 - MTB 29 inch giá tốt',
    'Xe đạp địa hình Trek Marlin 5 2021, bánh 29 inch, fork nhôm SR Suntour XCT 100mm travel. Groupset Shimano Altus 8 tốc độ, phanh đĩa cơ học Tektro. Xe đi được khoảng 1500km trên đường phố và vài tour trail nhẹ. Khung Alpha Platinum Aluminum cứng chắc.',
    2021, 'L', 'Aluminum',
    8, 'Shimano Altus M2000', 'Disc Mechanical', '29"', 14.20, 'Xanh Dương Nhạt',
    'GOOD',
    'Đi khoảng 1500km, gồm đường phố và một số đoạn trail nhẹ. Bơm và vệ sinh thường xuyên.',
    'Bình nước, túi khung, đèn sau.',
    'Muốn nâng cấp lên full-suspension.',
    8200000, true, 'Quận Bình Thạnh, TP. Hồ Chí Minh', 'APPROVED', false, 0,
    (SELECT id FROM users WHERE username = 'seller_thanh'),
    (SELECT id FROM brands WHERE name = 'Trek'),
    (SELECT id FROM categories WHERE name = 'Mountain Bike (MTB)'),
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM bicycle_listings WHERE title = 'Trek Marlin 5 2021 - MTB 29 inch giá tốt'
);

-- Listing 3: Specialized Sirrus X 2.0 (Hybrid) - seller_lan
INSERT INTO bicycle_listings (
    title, description, manufacture_year, frame_size, frame_material,
    speed_count, drivetrain, brake_type, wheel_size, weight_kg, color,
    condition, usage_history, accessories, reason_for_selling,
    price, is_negotiable, location, status, is_inspected, view_count,
    seller_id, brand_id, category_id, created_at
)
SELECT
    'Specialized Sirrus X 2.0 2023 - Hybrid đi phố chất',
    'Specialized Sirrus X 2.0 năm 2023, còn bảo hành. Xe đi phố cực kỳ nhẹ nhàng, thoải mái, khung hydroformed aluminum, fork nhôm. Groupset Shimano Acera 16 tốc độ, phanh đĩa dầu Tektro HD. Yên Body Geometry thoải mái cho hành trình dài.',
    2023, 'S', 'Aluminum',
    16, 'Shimano Acera M3000', 'Disc Hydraulic', '700c', 11.80, 'Trắng Ngọc Trai',
    'LIKE_NEW',
    'Đi chưa đến 300km, chủ yếu đi làm trong trung tâm thành phố. Xe gần như mới.',
    'Baga sau, đèn pin gắn ghi đông, chuông, đề pa.',
    'Chuyển công tác ra Hà Nội nên cần thanh lý.',
    12500000, false, 'Quận 7, TP. Hồ Chí Minh', 'APPROVED', false, 0,
    (SELECT id FROM users WHERE username = 'seller_lan'),
    (SELECT id FROM brands WHERE name = 'Specialized'),
    (SELECT id FROM categories WHERE name = 'City / Hybrid Bike'),
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM bicycle_listings WHERE title = 'Specialized Sirrus X 2.0 2023 - Hybrid đi phố chất'
);

-- Listing 4: Cannondale Synapse Carbon (Road) - seller_lan
INSERT INTO bicycle_listings (
    title, description, manufacture_year, frame_size, frame_material,
    speed_count, drivetrain, brake_type, wheel_size, weight_kg, color,
    condition, usage_history, accessories, reason_for_selling,
    price, is_negotiable, location, status, is_inspected, view_count,
    seller_id, brand_id, category_id, created_at
)
SELECT
    'Cannondale Synapse Carbon 105 2020 - Full carbon giá hợp lý',
    'Cannondale Synapse Carbon với groupset Shimano 105 R7000 22 tốc độ. Khung carbon SmartForm C2 nhẹ chỉ 8.2kg. Phanh đĩa dầu Shimano, bánh 700c. Xe đi được khoảng 3000km nhưng được bảo dưỡng kỹ lưỡng, hoạt động trơn tru 100%. Phù hợp tay đua nghiêm túc.',
    2020, 'M', 'Carbon',
    22, 'Shimano 105 R7000', 'Disc Hydraulic', '700c', 8.20, 'Xám Bạc / Đen',
    'GOOD',
    'Đi khoảng 3000km trong 3 năm. Bảo dưỡng định kỳ 6 tháng/lần tại Cannondale Center.',
    'Máy đo tốc độ Garmin Edge 530, bình nước Carbon, túi yên, đề pa clip.',
    'Lên full triathlon setup, cần đổi sang TT bike.',
    28000000, true, 'Quận 3, TP. Hồ Chí Minh', 'APPROVED', true, 0,
    (SELECT id FROM users WHERE username = 'seller_lan'),
    (SELECT id FROM brands WHERE name = 'Cannondale'),
    (SELECT id FROM categories WHERE name = 'Road Bike'),
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM bicycle_listings WHERE title = 'Cannondale Synapse Carbon 105 2020 - Full carbon giá hợp lý'
);

-- Listing 5: Merida Big Seven 100 (MTB) - seller_thanh
INSERT INTO bicycle_listings (
    title, description, manufacture_year, frame_size, frame_material,
    speed_count, drivetrain, brake_type, wheel_size, weight_kg, color,
    condition, usage_history, accessories, reason_for_selling,
    price, is_negotiable, location, status, is_inspected, view_count,
    seller_id, brand_id, category_id, created_at
)
SELECT
    'Merida Big Seven 100 2022 - MTB 27.5 inch mới 95%',
    'Xe đạp địa hình Merida Big Seven 100, bánh 27.5 inch, fork SR Suntour XCT 100mm. Shimano Tourney 21 tốc độ, phanh đĩa cơ học. Khung nhôm Merida Triple Butted 6061 nhẹ và cứng. Xe mới 95%, đi khoảng 500km.',
    2022, 'M', 'Aluminum',
    21, 'Shimano Tourney TY300', 'Disc Mechanical', '27.5"', 13.50, 'Đỏ / Đen',
    'LIKE_NEW',
    'Đi khoảng 500km đường phố và vài buổi sáng sớm công viên.',
    'Đèn bánh xe, chuông, bơm mini.',
    'Mua nhầm size, cần đổi sang size L.',
    4800000, true, 'Quận Thủ Đức, TP. Hồ Chí Minh', 'APPROVED', false, 0,
    (SELECT id FROM users WHERE username = 'seller_thanh'),
    (SELECT id FROM brands WHERE name = 'Merida'),
    (SELECT id FROM categories WHERE name = 'Mountain Bike (MTB)'),
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM bicycle_listings WHERE title = 'Merida Big Seven 100 2022 - MTB 27.5 inch mới 95%'
);

-- Listing 6: Giant Escape 3 (City) - seller_lan
INSERT INTO bicycle_listings (
    title, description, manufacture_year, frame_size, frame_material,
    speed_count, drivetrain, brake_type, wheel_size, weight_kg, color,
    condition, usage_history, accessories, reason_for_selling,
    price, is_negotiable, location, status, is_inspected, view_count,
    seller_id, brand_id, category_id, created_at
)
SELECT
    'Giant Escape 3 2023 - Xe đạp đô thị nhẹ nhàng',
    'Giant Escape 3 năm 2023, thiết kế hybrid nhẹ nhàng thoải mái cho việc đi lại hàng ngày. Khung nhôm ALUXX grade, phanh V-Brake, Shimano 21 tốc độ. Xe đang bày bán mới 100% chưa qua sử dụng, mua về không có nhu cầu.',
    2023, 'S', 'Aluminum',
    21, 'Shimano Tourney', 'V-Brake', '700c', 11.20, 'Vàng Chanh',
    'LIKE_NEW',
    'Xe chưa đi, mới 100%, còn nguyên hộp.',
    'Vỏ hộp, phụ kiện lắp ráp, sách hướng dẫn.',
    'Mua nhầm size, vợ không đi được.',
    5900000, false, 'Quận Phú Nhuận, TP. Hồ Chí Minh', 'APPROVED', false, 0,
    (SELECT id FROM users WHERE username = 'seller_lan'),
    (SELECT id FROM brands WHERE name = 'Giant'),
    (SELECT id FROM categories WHERE name = 'City / Hybrid Bike'),
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM bicycle_listings WHERE title = 'Giant Escape 3 2023 - Xe đạp đô thị nhẹ nhàng'
);

-- Listing 7: Scott Speedster 30 (Road) - seller_thanh  
INSERT INTO bicycle_listings (
    title, description, manufacture_year, frame_size, frame_material,
    speed_count, drivetrain, brake_type, wheel_size, weight_kg, color,
    condition, usage_history, accessories, reason_for_selling,
    price, is_negotiable, location, status, is_inspected, view_count,
    seller_id, brand_id, category_id, created_at
)
SELECT
    'Scott Speedster 30 2021 - Road bike entry level tuyệt vời',
    'Scott Speedster 30 khung nhôm 6061 double-butted, fork carbon. Groupset Shimano Sora 18 tốc độ, bánh 700c. Xe nhẹ, cứng, phù hợp người mới bắt đầu chơi road bike hoặc đi làm xa.',
    2021, 'M', 'Aluminum',
    18, 'Shimano Sora R3000', 'Rim Brake', '700c', 10.10, 'Xanh Lá / Đen',
    'GOOD',
    'Đi khoảng 2000km, đa phần đường nhựa bằng phẳng.',
    'Đèn trước Cateye, bảng đồng hồ Sigma.',
    'Muốn nâng cấp lên khung carbon.',
    7500000, true, 'Quận 2, TP. Hồ Chí Minh', 'APPROVED', false, 0,
    (SELECT id FROM users WHERE username = 'seller_thanh'),
    (SELECT id FROM brands WHERE name = 'Scott'),
    (SELECT id FROM categories WHERE name = 'Road Bike'),
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM bicycle_listings WHERE title = 'Scott Speedster 30 2021 - Road bike entry level tuyệt vời'
);

-- Listing 8: Giant ATX 2026 - seller_thanh
INSERT INTO bicycle_listings (
    title, description, manufacture_year, frame_size, frame_material,
    speed_count, drivetrain, brake_type, wheel_size, weight_kg, color,
    condition, usage_history, accessories, reason_for_selling,
    price, is_negotiable, location, status, is_inspected, view_count,
    seller_id, brand_id, category_id, created_at
)
SELECT
    'Giant ATX 2026 - Mẫu xe đa năng thế hệ mới',
    'Phiên bản Giant ATX mới nhất 2026, thiết kế tối ưu cho cả đường phố và đường mòn nhẹ. Trang bị phanh đĩa dầu thủy lực, phuộc nhún êm ái. Xe mới 100% dành cho người yêu thích sự bền bỉ của Giant.',
    2026, 'M', 'Aluminum',
    24, 'Shimano Tourney/Acera', 'Disc Hydraulic', '27.5"', 13.80, 'Xanh Camo',
    'LIKE_NEW',
    'Xe mới chưa qua sử dụng, bảo hành chính hãng 5 năm.',
    'Chân chống, chuông, phản quang.',
    'Hàng trưng bày thanh lý.',
    12000000, true, 'Hanoi', 'APPROVED', true, 150,
    (SELECT id FROM users WHERE username = 'seller_thanh'),
    (SELECT id FROM brands WHERE name = 'Giant'),
    (SELECT id FROM categories WHERE name = 'Mountain Bike (MTB)'),
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM bicycle_listings WHERE title = 'Giant ATX 2026 - Mẫu xe đa năng thế hệ mới'
);

-- Listing 9: Test Phase 3 Bike - seller_lan
INSERT INTO bicycle_listings (
    title, description, manufacture_year, frame_size, frame_material,
    speed_count, drivetrain, brake_type, wheel_size, weight_kg, color,
    condition, usage_history, accessories, reason_for_selling,
    price, is_negotiable, location, status, is_inspected, view_count,
    seller_id, brand_id, category_id, created_at
)
SELECT
    'Test Phase 3 Bike - Xe đạp dự án thử nghiệm',
    'Đây là xe đạp mẫu phục vụ cho giai đoạn thử nghiệm Phase 3. Xe có cấu hình cao cấp, khung Carbon siêu nhẹ, phù hợp cho việc test các tính năng kiểm định và thanh toán trên hệ thống.',
    2024, 'L', 'Carbon',
    22, 'Shimano Ultegra', 'Disc Hydraulic', '700c', 7.80, 'Đen Nhám',
    'LIKE_NEW',
    'Chỉ sử dụng để test tính năng hệ thống.',
    'Full phụ kiện cao cấp.',
    'Hết giai đoạn thử nghiệm.',
    5000000, false, 'Hanoi', 'APPROVED', true, 99,
    (SELECT id FROM users WHERE username = 'seller_lan'),
    (SELECT id FROM brands WHERE name = 'Trek'),
    (SELECT id FROM categories WHERE name = 'Road Bike'),
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM bicycle_listings WHERE title = 'Test Phase 3 Bike - Xe đạp dự án thử nghiệm'
);

-- ============ LISTING IMAGES ============
-- Ảnh placeholder từ Unsplash (public domain, không cần đăng nhập)
-- Listing 1: Giant Contend AR 2 (Road Bike)
INSERT INTO listing_images (image_url, display_order, is_primary, listing_id, uploaded_at)
SELECT
    'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800',
    0, true,
    (SELECT id FROM bicycle_listings WHERE title = 'Giant Contend AR 2 2022 - Xe đua đường trường như mới'),
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM listing_images WHERE listing_id = (
        SELECT id FROM bicycle_listings WHERE title = 'Giant Contend AR 2 2022 - Xe đua đường trường như mới'
    )
);

-- Listing 2: Trek Marlin 5 (MTB)
INSERT INTO listing_images (image_url, display_order, is_primary, listing_id, uploaded_at)
SELECT
    'https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=800',
    0, true,
    (SELECT id FROM bicycle_listings WHERE title = 'Trek Marlin 5 2021 - MTB 29 inch giá tốt'),
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM listing_images WHERE listing_id = (
        SELECT id FROM bicycle_listings WHERE title = 'Trek Marlin 5 2021 - MTB 29 inch giá tốt'
    )
);

-- Listing 3: Specialized Sirrus X 2.0 (Hybrid)
INSERT INTO listing_images (image_url, display_order, is_primary, listing_id, uploaded_at)
SELECT
    'https://images.unsplash.com/photo-1576435728678-68d0fbf94e91?w=800',
    0, true,
    (SELECT id FROM bicycle_listings WHERE title = 'Specialized Sirrus X 2.0 2023 - Hybrid đi phố chất'),
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM listing_images WHERE listing_id = (
        SELECT id FROM bicycle_listings WHERE title = 'Specialized Sirrus X 2.0 2023 - Hybrid đi phố chất'
    )
);

-- Listing 4: Cannondale Synapse Carbon (Road)
INSERT INTO listing_images (image_url, display_order, is_primary, listing_id, uploaded_at)
SELECT
    'https://images.unsplash.com/photo-1507035895480-2b3156c31fc8?w=800',
    0, true,
    (SELECT id FROM bicycle_listings WHERE title = 'Cannondale Synapse Carbon 105 2020 - Full carbon giá hợp lý'),
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM listing_images WHERE listing_id = (
        SELECT id FROM bicycle_listings WHERE title = 'Cannondale Synapse Carbon 105 2020 - Full carbon giá hợp lý'
    )
);

-- Listing 5: Merida Big Seven (MTB)
INSERT INTO listing_images (image_url, display_order, is_primary, listing_id, uploaded_at)
SELECT
    'https://images.unsplash.com/photo-1511994298241-608e28f14fde?w=800',
    0, true,
    (SELECT id FROM bicycle_listings WHERE title = 'Merida Big Seven 100 2022 - MTB 27.5 inch mới 95%'),
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM listing_images WHERE listing_id = (
        SELECT id FROM bicycle_listings WHERE title = 'Merida Big Seven 100 2022 - MTB 27.5 inch mới 95%'
    )
);

-- Listing 6: Giant Escape 3 (City)
INSERT INTO listing_images (image_url, display_order, is_primary, listing_id, uploaded_at)
SELECT
    'https://images.unsplash.com/photo-1505705694340-019e1e335916?w=800',
    0, true,
    (SELECT id FROM bicycle_listings WHERE title = 'Giant Escape 3 2023 - Xe đạp đô thị nhẹ nhàng'),
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM listing_images WHERE listing_id = (
        SELECT id FROM bicycle_listings WHERE title = 'Giant Escape 3 2023 - Xe đạp đô thị nhẹ nhàng'
    )
);

-- Listing 7: Scott Speedster 30 (Road)
INSERT INTO listing_images (image_url, display_order, is_primary, listing_id, uploaded_at)
SELECT
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
    0, true,
    (SELECT id FROM bicycle_listings WHERE title = 'Scott Speedster 30 2021 - Road bike entry level tuyệt vời'),
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM listing_images WHERE listing_id = (
        SELECT id FROM bicycle_listings WHERE title = 'Scott Speedster 30 2021 - Road bike entry level tuyệt vời'
    )
);

-- Listing 8: Giant ATX 2026
INSERT INTO listing_images (image_url, display_order, is_primary, listing_id, uploaded_at)
SELECT
    'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800',
    0, true,
    (SELECT id FROM bicycle_listings WHERE title = 'Giant ATX 2026 - Mẫu xe đa năng thế hệ mới'),
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM listing_images WHERE listing_id = (
        SELECT id FROM bicycle_listings WHERE title = 'Giant ATX 2026 - Mẫu xe đa năng thế hệ mới'
    )
);

-- Listing 9: Test Phase 3 Bike
INSERT INTO listing_images (image_url, display_order, is_primary, listing_id, uploaded_at)
SELECT
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    0, true,
    (SELECT id FROM bicycle_listings WHERE title = 'Test Phase 3 Bike - Xe đạp dự án thử nghiệm'),
    CURRENT_TIMESTAMP
WHERE NOT EXISTS (
    SELECT 1 FROM listing_images WHERE listing_id = (
        SELECT id FROM bicycle_listings WHERE title = 'Test Phase 3 Bike - Xe đạp dự án thử nghiệm'
    )
);

-- ============ BULK IMAGE ASSIGNMENT ============
-- Đảm bảo TẤT CẢ các xe trong hệ thống đều có ít nhất 1 ảnh (kể cả xe thêm tay hoặc xe cũ)
INSERT INTO listing_images (image_url, display_order, is_primary, listing_id, uploaded_at)
SELECT 
    'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800', 
    0, true, id, CURRENT_TIMESTAMP
FROM bicycle_listings bl
WHERE NOT EXISTS (SELECT 1 FROM listing_images li WHERE li.listing_id = bl.id);


-- ============ REVIEWS ============
-- buyer_minh review seller_thanh (order_id = NULL vì không có order seed)
INSERT INTO reviews (rating, comment, accuracy_rating, communication_rating, reviewer_id, seller_id, order_id, created_at)
SELECT
    5,
    'Anh Thanh bán hàng rất uy tín, xe đúng như mô tả, đóng gói cẩn thận. Thanh toán xong là ship ngay. Rất hài lòng!',
    5, 5,
    (SELECT id FROM users WHERE username = 'buyer_minh'),
    (SELECT id FROM users WHERE username = 'seller_thanh'),
    NULL,
    CURRENT_TIMESTAMP - INTERVAL '10 days'
WHERE NOT EXISTS (
    SELECT 1 FROM reviews
    WHERE reviewer_id = (SELECT id FROM users WHERE username = 'buyer_minh')
      AND seller_id   = (SELECT id FROM users WHERE username = 'seller_thanh')
      AND comment = 'Anh Thanh bán hàng rất uy tín, xe đúng như mô tả, đóng gói cẩn thận. Thanh toán xong là ship ngay. Rất hài lòng!'
);

INSERT INTO reviews (rating, comment, accuracy_rating, communication_rating, reviewer_id, seller_id, order_id, created_at)
SELECT
    5,
    'Xe ngon, giá tốt, người bán nhiệt tình tư vấn. Sẽ mua lại lần sau.',
    4, 5,
    (SELECT id FROM users WHERE username = 'buyer_hoa'),
    (SELECT id FROM users WHERE username = 'seller_thanh'),
    NULL,
    CURRENT_TIMESTAMP - INTERVAL '5 days'
WHERE NOT EXISTS (
    SELECT 1 FROM reviews
    WHERE reviewer_id = (SELECT id FROM users WHERE username = 'buyer_hoa')
      AND seller_id   = (SELECT id FROM users WHERE username = 'seller_thanh')
      AND comment = 'Xe ngon, giá tốt, người bán nhiệt tình tư vấn. Sẽ mua lại lần sau.'
);

INSERT INTO reviews (rating, comment, accuracy_rating, communication_rating, reviewer_id, seller_id, order_id, created_at)
SELECT
    4,
    'Chị Lan giao hàng đúng hẹn, xe sạch sẽ. Chỉ có giao tiếp hơi chậm trả lời nhắn tin nhưng nhìn chung ổn.',
    5, 4,
    (SELECT id FROM users WHERE username = 'buyer_minh'),
    (SELECT id FROM users WHERE username = 'seller_lan'),
    NULL,
    CURRENT_TIMESTAMP - INTERVAL '3 days'
WHERE NOT EXISTS (
    SELECT 1 FROM reviews
    WHERE reviewer_id = (SELECT id FROM users WHERE username = 'buyer_minh')
      AND seller_id   = (SELECT id FROM users WHERE username = 'seller_lan')
      AND comment = 'Chị Lan giao hàng đúng hẹn, xe sạch sẽ. Chỉ có giao tiếp hơi chậm trả lời nhắn tin nhưng nhìn chung ổn.'
);

INSERT INTO reviews (rating, comment, accuracy_rating, communication_rating, reviewer_id, seller_id, order_id, created_at)
SELECT
    5,
    'Mua xe specialized của chị Lan, xe còn rất mới y như ảnh. Chị còn cho thêm bình nước miễn phí. Highly recommended!',
    5, 5,
    (SELECT id FROM users WHERE username = 'buyer_hoa'),
    (SELECT id FROM users WHERE username = 'seller_lan'),
    NULL,
    CURRENT_TIMESTAMP - INTERVAL '1 days'
WHERE NOT EXISTS (
    SELECT 1 FROM reviews
    WHERE reviewer_id = (SELECT id FROM users WHERE username = 'buyer_hoa')
      AND seller_id   = (SELECT id FROM users WHERE username = 'seller_lan')
      AND comment = 'Mua xe specialized của chị Lan, xe còn rất mới y như ảnh. Chị còn cho thêm bình nước miễn phí. Highly recommended!'
);