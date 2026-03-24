-- Insert sample brands
INSERT INTO brands (name, description, logo_url) VALUES
('Giant', 'Thương hiệu xe đạp hàng đầu thế giới', null),
('Trek', 'Thương hiệu xe đạp Mỹ nổi tiếng', null),
('Specialized', 'Thương hiệu xe đạp cao cấp', null),
('Cannondale', 'Xe đạp chất lượng cao', null),
('Merida', 'Thương hiệu xe đạp Đài Loan', null)
ON CONFLICT DO NOTHING;

-- Insert sample categories
INSERT INTO categories (name, description) VALUES
('Road Bike', 'Xe đạp đường trường'),
('Mountain Bike', 'Xe đạp địa hình'),
('Hybrid Bike', 'Xe đạp lai'),
('Touring Bike', 'Xe đạp du lịch'),
('Gravel Bike', 'Xe đạp đa địa hình')
ON CONFLICT DO NOTHING;
