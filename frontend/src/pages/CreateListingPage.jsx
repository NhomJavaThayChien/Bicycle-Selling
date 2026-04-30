import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Card,
  Typography,
  Row,
  Col,
  message,
  Divider,
} from "antd";
import {
  PlusCircle,
  Image as ImageIcon,
  Info,
  Settings,
  DollarSign,
  MapPin,
  X,
  Upload as UploadIcon,
} from "lucide-react";
import {
  createListing,
  getListingDetail,
  uploadListingImages,
  updateListing,
} from "../services/sellerListingService";
import { getBrands, getCategories } from "../services/bikeService";
import "./CreateListingPage.css";

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const CONDITION_OPTIONS = [
  { label: "New (Mới 100%)", value: "NEW" },
  { label: "Like New (Như mới)", value: "LIKE_NEW" },
  { label: "Good (Tốt)", value: "GOOD" },
  { label: "Fair (Khá)", value: "FAIR" },
  { label: "Poor (Cũ)", value: "POOR" },
];

function CreateListingPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form] = Form.useForm();
  const isEditMode = useMemo(() => Boolean(id), [id]);

  const [loading, setLoading] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        const [brandsRes, catsRes] = await Promise.all([getBrands(), getCategories()]);
        setBrands(brandsRes.data || []);
        setCategories(catsRes.data || []);
      } catch (err) {
        console.error("Lỗi khi tải thương hiệu/danh mục:", err);
      }
    };
    fetchMetadata();
  }, []);

  useEffect(() => {
    if (!isEditMode) return;

    const loadListingDetail = async () => {
      setLoadingDetail(true);
      try {
        const response = await getListingDetail(id);
        const listing = response.data || {};
        form.setFieldsValue({
          ...listing,
          price: listing.price,
          brandId: listing.brandId,
          categoryId: listing.categoryId,
          yearOfManufacture: listing.yearOfManufacture,
          weight: listing.weight,
        });
      } catch (err) {
        message.error("Không thể tải thông tin bài đăng.");
      } finally {
        setLoadingDetail(false);
      }
    };

    loadListingDetail();
  }, [id, isEditMode, form]);

  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (files) => {
    const selected = Array.from(files);
    if (selected.length + images.length > 10) {
      message.warning("Chỉ được chọn tối đa 10 ảnh.");
      return;
    }

    const newImages = [...images, ...selected];
    setImages(newImages);

    // Create preview URLs
    const newUrls = selected.map((file) => URL.createObjectURL(file));
    setPreviewUrls([...previewUrls, ...newUrls]);
  };

  const handleImagesChange = (event) => {
    handleFiles(event.target.files || []);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files || []);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    const newUrls = [...previewUrls];
    URL.revokeObjectURL(newUrls[index]);
    newUrls.splice(index, 1);
    setPreviewUrls(newUrls);
  };

  const onFinish = async (values) => {
    if (!images.length && !isEditMode) {
      message.error("Vui lòng chọn ít nhất 1 ảnh.");
      return;
    }

    setLoading(true);
    try {
      let listingId = id;
      if (isEditMode) {
        await updateListing(id, values);
        message.success("Đã cập nhật bài đăng thành công!");
      } else {
        const res = await createListing(values);
        listingId = res.data?.id;
        message.success("Đã tạo bài đăng mới thành công!");
      }

      if (images.length && listingId) {
        await uploadListingImages(listingId, images);
      }

      navigate("/seller/dashboard");
    } catch (err) {
      const serverMessage = err?.response?.data?.message;
      message.error(serverMessage || "Không thể lưu bài đăng. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  if (loadingDetail) {
    return (
      <div className="create-listing-container" style={{ textAlign: "center", paddingTop: "100px" }}>
        <Title level={4}>Đang tải dữ liệu bài đăng...</Title>
      </div>
    );
  }

  return (
    <div className="create-listing-container">
      <div style={{ marginBottom: "32px" }}>
        <Title level={2} style={{ margin: 0, color: "#0f172a" }}>
          {isEditMode ? "Chỉnh sửa bài đăng" : "Tạo bài đăng mới"}
        </Title>
        <Paragraph type="secondary" style={{ fontSize: "1.05rem" }}>
          Chia sẻ thông tin chi tiết về chiếc xe của bạn để tiếp cận hàng ngàn người mua tiềm năng.
        </Paragraph>
      </div>

      <Card className="create-listing-card">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="create-listing-form"
          initialValues={{ condition: "GOOD" }}
        >
          {/* SECTION 1: BASIC INFO */}
          <div className="form-section">
            <div className="form-section-title">
              <Info size={20} color="#0c6cf2" />
              <span>Thông tin cơ bản</span>
            </div>
            <Row gutter={24}>
              <Col xs={24} lg={16}>
                <Form.Item
                  name="title"
                  label="Tiêu đề bài đăng"
                  rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
                >
                  <Input placeholder="Ví dụ: Xe đạp địa hình Trek Marlin 7 đời 2023" size="large" />
                </Form.Item>
              </Col>
              <Col xs={24} lg={8}>
                <Form.Item
                  name="condition"
                  label="Tình trạng xe"
                  rules={[{ required: true }]}
                >
                  <Select size="large">
                    {CONDITION_OPTIONS.map((opt) => (
                      <Option key={opt.value} value={opt.value}>
                        {opt.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={24}>
              <Col xs={24} md={12} lg={8}>
                <Form.Item
                  name="brandId"
                  label="Thương hiệu"
                  rules={[{ required: true, message: "Vui lòng chọn hãng" }]}
                >
                  <Select size="large" placeholder="Chọn thương hiệu" showSearch filterOption={(input, option) => (option?.children ?? "").toLowerCase().includes(input.toLowerCase())}>
                    {brands.map((brand) => (
                      <Option key={brand.id} value={brand.id}>
                        {brand.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={12} lg={8}>
                <Form.Item
                  name="categoryId"
                  label="Danh mục xe"
                  rules={[{ required: true, message: "Vui lòng chọn loại xe" }]}
                >
                  <Select size="large" placeholder="Chọn danh mục" showSearch filterOption={(input, option) => (option?.children ?? "").toLowerCase().includes(input.toLowerCase())}>
                    {categories.map((cat) => (
                      <Option key={cat.id} value={cat.id}>
                        {cat.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={8}>
                <Form.Item
                  name="location"
                  label="Khu vực bán"
                  rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
                >
                  <Input prefix={<MapPin size={16} />} size="large" placeholder="Ví dụ: Quận 1, TP.HCM" />
                </Form.Item>
              </Col>
            </Row>
          </div>

          <Divider style={{ margin: "32px 0" }} />

          {/* SECTION 2: TECHNICAL SPECS */}
          <div className="form-section">
            <div className="form-section-title">
              <Settings size={20} color="#0c6cf2" />
              <span>Thông số kỹ thuật</span>
            </div>
            <Row gutter={16}>
              <Col xs={12} md={8}>
                <Form.Item name="frameSize" label="Size khung">
                  <Input placeholder="VD: M, 52cm" />
                </Form.Item>
              </Col>
              <Col xs={12} md={8}>
                <Form.Item name="frameMaterial" label="Chất liệu khung">
                  <Input placeholder="VD: Nhôm, Carbon" />
                </Form.Item>
              </Col>
              <Col xs={12} md={8}>
                <Form.Item name="wheelSize" label="Kích thước bánh">
                  <Input placeholder="VD: 700c, 29 inch" />
                </Form.Item>
              </Col>
              <Col xs={12} md={8}>
                <Form.Item name="gearSystem" label="Hệ thống truyền động">
                  <Input placeholder="VD: Shimano 105" />
                </Form.Item>
              </Col>
              <Col xs={12} md={8}>
                <Form.Item name="brakeType" label="Loại phanh">
                  <Input placeholder="VD: Phanh đĩa cơ" />
                </Form.Item>
              </Col>
              <Col xs={12} md={8}>
                <Form.Item name="yearOfManufacture" label="Năm sản xuất">
                  <InputNumber style={{ width: "100%" }} min={1900} max={new Date().getFullYear()} />
                </Form.Item>
              </Col>
              <Col xs={12} md={8}>
                <Form.Item name="color" label="Màu sắc">
                  <Input placeholder="VD: Đen nhám" />
                </Form.Item>
              </Col>
              <Col xs={12} md={8}>
                <Form.Item name="weight" label="Trọng lượng (kg)">
                  <InputNumber style={{ width: "100%" }} step={0.1} min={0} />
                </Form.Item>
              </Col>
            </Row>
          </div>

          <Divider style={{ margin: "32px 0" }} />

          {/* SECTION 3: PRICING & DESCRIPTION */}
          <div className="form-section">
            <div className="form-section-title">
              <DollarSign size={20} color="#0c6cf2" />
              <span>Giá cả & Mô tả</span>
            </div>
            <Row gutter={24}>
              <Col xs={24} md={12}>
                <Form.Item
                  name="price"
                  label="Giá bán (VNĐ)"
                  rules={[{ required: true, message: "Vui lòng nhập giá" }]}
                >
                  <InputNumber
                    size="large"
                    style={{ width: "100%" }}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                    placeholder="Nhập giá bán mong muốn"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} md={12}>
                <Form.Item name="reasonForSelling" label="Lý do bán">
                  <Input placeholder="Ví dụ: Lên đời xe mới" size="large" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="additionalAccessories" label="Phụ kiện đi kèm">
              <Input placeholder="Ví dụ: Đèn hậu, túi sườn, gọng nước" size="large" />
            </Form.Item>
            <Form.Item
              name="description"
              label="Mô tả chi tiết"
              rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
            >
              <TextArea
                rows={6}
                placeholder="Mô tả chi tiết tình trạng xe, các nâng cấp (nếu có) hoặc các vết trầy xước..."
                style={{ borderRadius: "12px" }}
              />
            </Form.Item>
          </div>

          <Divider style={{ margin: "32px 0" }} />

          {/* SECTION 4: IMAGES */}
          <div className="form-section">
            <div className="form-section-title">
              <ImageIcon size={20} color="#0c6cf2" />
              <span>Hình ảnh sản phẩm</span>
            </div>
            <label 
              className={`upload-area ${isDragging ? "dragging" : ""}`}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
            >
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImagesChange}
                style={{ display: "none" }}
              />
              <UploadIcon size={40} color={isDragging ? "#0c6cf2" : "#64748b"} />
              <div style={{ textAlign: "center" }}>
                <Text strong style={{ fontSize: "1.1rem", display: "block" }}>
                  {isDragging ? "Thả ảnh vào đây ngay!" : "Nhấn để tải lên hoặc kéo thả ảnh vào đây"}
                </Text>
                <Text type="secondary" style={{ display: "block", marginTop: "4px" }}>
                  Tải lên tối đa 10 ảnh (PNG, JPG). Hình ảnh rõ nét giúp bán nhanh hơn.
                </Text>
              </div>
            </label>

            {previewUrls.length > 0 && (
              <div className="image-preview-grid">
                {previewUrls.map((url, index) => (
                  <div key={index} className="image-preview-item">
                    <img src={url} alt={`preview-${index}`} />
                    <button type="button" className="remove-btn" onClick={() => removeImage(index)}>
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div
            style={{
              marginTop: "48px",
              display: "flex",
              justifyContent: "flex-end",
              gap: "16px",
            }}
          >
            <Button size="large" onClick={() => navigate("/seller/dashboard")} style={{ borderRadius: "12px" }}>
              Hủy bỏ
            </Button>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              loading={loading}
              icon={<PlusCircle size={18} />}
              style={{ minWidth: "180px" }}
            >
              {isEditMode ? "Lưu thay đổi" : "Đăng tin ngay"}
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  );
}

export default CreateListingPage;
