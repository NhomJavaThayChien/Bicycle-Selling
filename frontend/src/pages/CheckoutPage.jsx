import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  Layout, 
  Row, 
  Col, 
  Card, 
  Form, 
  Input, 
  Select, 
  Button, 
  Typography, 
  Space, 
  Divider, 
  Radio, 
  message,
  Spin,
  Alert
} from "antd";
import { 
  Truck, 
  CreditCard, 
  MapPin, 
  Info, 
  ChevronRight, 
  ShieldCheck,
  CreditCard as CardIcon,
  Wallet
} from "lucide-react";
import { motion } from "framer-motion";
import { getListingById } from "../services/bikeService";
import { createOrder } from "../services/orderService";
import { createCashPayment, createDepositPayment } from "../services/paymentService";
import {
  calculateShippingFee,
  getDistricts,
  getProvinces,
  getWards,
} from "../services/shippingService";
import { formatPrice } from "../utils/formatPrice";

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
// TODO: Backend chưa lưu GHN districtId/wardCode của seller trong BicycleListing.
// Field `location` chỉ là text tự do (VD: "Hà Nội"), không phải GHN code.
// Cần thêm field `fromDistrictId` và `fromWardCode` vào BicycleListing khi seller đăng tin.
// Hiện tại dùng kho mặc định (Q.Nam Từ Liêm, Hà Nội) như địa chỉ gửi hàng để tính phí ship.
const DEFAULT_FROM_DISTRICT_ID = 1450; // Quận Nam Từ Liêm, Hà Nội (kho mặc định)
const DEFAULT_FROM_WARD_CODE = "21211"; // Phường Cầu Diễn

export default function CheckoutPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);
  const [shippingFee, setShippingFee] = useState(null);
  const [calculatingFee, setCalculatingFee] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [listingRes, provinceRes] = await Promise.all([
          getListingById(id),
          getProvinces(),
        ]);
        setListing(listingRes.data);
        const provinceItems = Array.isArray(provinceRes.data)
          ? provinceRes.data
              .map((item) => ({
                provinceId: item?.provinceId ?? item?.ProvinceID,
                provinceName: item?.provinceName ?? item?.ProvinceName,
              }))
              .filter((item) => item?.provinceId != null)
          : [];
        setProvinces(provinceItems);
      } catch (err) {
        message.error("Không thể tải thông tin thanh toán.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleProvinceChange = async (value) => {
    form.setFieldsValue({ districtId: undefined, wardCode: undefined });
    setDistricts([]);
    setWards([]);
    setShippingFee(null);
    
    if (!value) return;
    
    setLoadingDistricts(true);
    try {
      const res = await getDistricts(value);
      const districtItems = Array.isArray(res.data)
        ? res.data
            .map((item) => ({
              districtId: item?.districtId ?? item?.DistrictID,
              districtName: item?.districtName ?? item?.DistrictName,
              provinceId: item?.provinceId ?? item?.ProvinceID,
            }))
            .filter((item) => item?.districtId != null)
        : [];
      setDistricts(districtItems);
    } catch (err) {
      message.error("Lỗi khi tải danh sách quận/huyện.");
    } finally {
      setLoadingDistricts(false);
    }
  };

  const handleDistrictChange = async (value) => {
    form.setFieldsValue({ wardCode: undefined });
    setWards([]);
    setShippingFee(null);
    
    if (!value) return;
    
    setLoadingWards(true);
    try {
      const res = await getWards(value);
      const wardItems = Array.isArray(res.data)
        ? res.data
            .map((item) => ({
              wardCode: item?.wardCode ?? item?.WardCode,
              wardName: item?.wardName ?? item?.WardName,
              districtId: item?.districtId ?? item?.DistrictID,
            }))
            .filter((item) => item?.wardCode != null)
        : [];
      setWards(wardItems);
    } catch (err) {
      message.error("Lỗi khi tải danh sách phường/xã.");
    } finally {
      setLoadingWards(false);
    }
  };

  const onCalculateFee = async () => {
    const values = form.getFieldsValue();
    if (!values.districtId || !values.wardCode) {
      message.warning("Vui lòng chọn đầy đủ Quận/Huyện và Phường/Xã.");
      return;
    }

    setCalculatingFee(true);
    try {
      const res = await calculateShippingFee({
        listingId: listing.id,
        fromDistrictId: DEFAULT_FROM_DISTRICT_ID,
        fromWardCode: DEFAULT_FROM_WARD_CODE,
        toDistrictId: values.districtId,
        toWardCode: values.wardCode,
      });
      setShippingFee(res.data?.fee || 0);
      message.success("Đã cập nhật phí vận chuyển.");
    } catch (err) {
      message.error("Không thể tính phí vận chuyển GHN.");
    } finally {
      setCalculatingFee(false);
    }
  };

  const onFinish = async (values) => {
    setSubmitting(true);
    try {
      const selectedProvince = provinces.find(p => p.provinceId === values.provinceId)?.provinceName;
      const selectedDistrict = districts.find(d => d.districtId === values.districtId)?.districtName;
      const selectedWard = wards.find(w => w.wardCode === values.wardCode)?.wardName;
      
      const shippingAddress = `${values.address}, ${selectedWard}, ${selectedDistrict}, ${selectedProvince}`;

      const orderRes = await createOrder({
        listingId: listing.id,
        agreedPrice: listing.price,    // Giá xe gốc (backend dùng để tính deposit 20%)
        shippingFee: shippingFee || 0, // Phí ship được tính từ GHN
        shippingAddress,
        note: values.note,
      });

      const orderId = orderRes.data?.id;
      if (!orderId) throw new Error("Không nhận được ID đơn hàng từ server.");

      if (values.paymentMethod === "STRIPE") {
        const payRes = await createDepositPayment(orderId);
        const stripeUrl = payRes.data?.checkoutSession;
        if (!stripeUrl) throw new Error("Không nhận được URL thanh toán từ Stripe.");
        window.location.href = stripeUrl;
        return;
      } else {
        await createCashPayment(orderId);
      }
      
      message.success("Đặt hàng thành công!");
      navigate("/orders");
    } catch (err) {
      message.error(err.response?.data?.message || "Đặt hàng thất bại. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '100px' }}>
      <Spin size="large" tip="Đang tải dữ liệu thanh toán..." />
    </div>
  );

  // Deposit = 20% giá xe (backend tính theo agreedPrice, KHÔNG bao gồm ship)
  const depositAmount = Math.round((listing?.price || 0) * 0.2);
  const totalAmount = (listing?.price || 0) + (shippingFee || 0);

  return (
    <div style={{ background: "#f8fafc", minHeight: "100vh", padding: "40px 20px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Space direction="vertical" size={2} style={{ marginBottom: 32 }}>
            <Text type="secondary" style={{ textTransform: "uppercase", letterSpacing: 1, fontSize: 12, fontWeight: 700 }}>
              Thanh toán an toàn
            </Text>
            <Title level={2}>Xác nhận đặt hàng</Title>
          </Space>

          <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ paymentMethod: "COD" }}>
            <Row gutter={32}>
              <Col xs={24} lg={15}>
                <Card 
                  title={<Space><MapPin size={18} /><span>Thông tin giao hàng</span></Space>}
                  variant="borderless"
                  style={{ borderRadius: 16, boxShadow: "0 4px 12px rgba(0,0,0,0.05)", marginBottom: 24 }}
                >
                  <Row gutter={16}>
                    <Col span={24}>
                      <Form.Item name="address" label="Địa chỉ cụ thể (Số nhà, tên đường)" rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}>
                        <Input placeholder="VD: 123 Nguyễn Trãi" style={{ height: 42 }} />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item name="provinceId" label="Tỉnh / Thành phố" rules={[{ required: true, message: 'Chọn tỉnh thành' }]}>
                        <Select 
                          placeholder="Chọn tỉnh/thành" 
                          onChange={handleProvinceChange}
                          showSearch
                          optionFilterProp="children"
                          style={{ height: 42 }}
                        >
                          {provinces.map(p => <Option key={p.provinceId} value={p.provinceId}>{p.provinceName}</Option>)}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item name="districtId" label="Quận / Huyện" rules={[{ required: true, message: 'Chọn quận huyện' }]}>
                        <Select 
                          placeholder="Chọn quận/huyện" 
                          onChange={handleDistrictChange}
                          loading={loadingDistricts}
                          disabled={!districts.length}
                          showSearch
                          optionFilterProp="children"
                          style={{ height: 42 }}
                        >
                          {districts.map(d => <Option key={d.districtId} value={d.districtId}>{d.districtName}</Option>)}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item name="wardCode" label="Phường / Xã" rules={[{ required: true, message: 'Chọn phường xã' }]}>
                        <Select 
                          placeholder="Chọn phường/xã" 
                          loading={loadingWards}
                          disabled={!wards.length}
                          showSearch
                          optionFilterProp="children"
                          style={{ height: 42 }}
                          onSelect={onCalculateFee}
                        >
                          {wards.map(w => <Option key={w.wardCode} value={w.wardCode}>{w.wardName}</Option>)}
                        </Select>
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item name="note" label="Ghi chú cho người bán">
                        <Input.TextArea rows={3} placeholder="VD: Giao vào giờ hành chính..." />
                      </Form.Item>
                    </Col>
                  </Row>
                </Card>

                <Card 
                  title={<Space><CreditCard size={18} /><span>Phương thức thanh toán</span></Space>}
                  variant="borderless"
                  style={{ borderRadius: 16, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                >
                  <Form.Item name="paymentMethod" noStyle>
                    <Radio.Group style={{ width: "100%" }}>
                      <Row gutter={16}>
                        <Col span={12}>
                          <Radio.Button value="COD" style={{ width: "100%", height: "auto", padding: "16px", borderRadius: 12 }}>
                            <Space align="start">
                              <Wallet size={20} style={{ color: "#52c41a" }} />
                              <div>
                                <div style={{ fontWeight: 600 }}>Tiền mặt (COD)</div>
                                <div style={{ fontSize: 12, color: "#8c8c8c" }}>Thanh toán khi nhận hàng</div>
                              </div>
                            </Space>
                          </Radio.Button>
                        </Col>
                        <Col span={12}>
                          <Radio.Button value="STRIPE" style={{ width: "100%", height: "auto", padding: "16px", borderRadius: 12 }}>
                            <Space align="start">
                              <CardIcon size={20} style={{ color: "#1890ff" }} />
                              <div>
                                <div style={{ fontWeight: 600 }}>Đặt cọc qua Stripe</div>
                                <div style={{ fontSize: 12, color: "#8c8c8c" }}>Thanh toán đặt cọc 20% qua Stripe (an toàn)</div>
                              </div>
                            </Space>
                          </Radio.Button>
                        </Col>
                      </Row>
                    </Radio.Group>
                  </Form.Item>
                  
                  <div style={{ marginTop: 24, padding: "16px", background: "#f0f5ff", borderRadius: 12, display: "flex", gap: 12 }}>
                    <ShieldCheck size={24} style={{ color: "#1890ff", flexShrink: 0 }} />
                    <Text type="secondary" style={{ fontSize: 13 }}>
                      Mọi giao dịch trên BikeMarket đều được bảo vệ. Tiền của bạn sẽ chỉ được chuyển cho người bán sau khi bạn xác nhận đã nhận hàng thành công.
                    </Text>
                  </div>
                </Card>
              </Col>

              <Col xs={24} lg={9}>
                <Card 
                  variant="borderless" 
                  style={{ borderRadius: 20, boxShadow: "0 8px 24px rgba(0,0,0,0.08)", position: "sticky", top: 24 }}
                >
                  <Title level={4}>Tóm tắt đơn hàng</Title>
                  <Divider style={{ margin: "16px 0" }} />
                  
                  <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
                    <img
                      src={listing.primaryImageUrl || `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' rx='12' fill='%23f0f5ff'/%3E%3Ctext x='40' y='48' text-anchor='middle' font-size='32' fill='%231890ff'%3E🚲%3C/text%3E%3C/svg%3E`}
                      alt="bike"
                      style={{ width: 80, height: 80, borderRadius: 12, objectFit: "cover" }}
                      onError={(e) => { e.target.onerror = null; e.target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' rx='12' fill='%23f0f5ff'/%3E%3Ctext x='40' y='48' text-anchor='middle' font-size='32' fill='%231890ff'%3E🚲%3C/text%3E%3C/svg%3E`; }}
                    />
                    <div>
                      <Text strong style={{ display: "block", fontSize: 16 }}>{listing.title}</Text>
                      <Text type="secondary" style={{ fontSize: 12 }}>Mã sản phẩm: #{listing.id}</Text>
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                    <Text type="secondary">Giá xe</Text>
                    <Text strong>{formatPrice(listing.price)}</Text>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <Text type="secondary">Phí vận chuyển (GHN)</Text>
                    <Text strong>
                      {calculatingFee ? <Spin size="small" /> : (shippingFee !== null ? formatPrice(shippingFee) : "Chưa tính")}
                    </Text>
                  </div>
                  {shippingFee !== null && (
                    <div style={{ marginBottom: 12 }}>
                      <Text type="secondary" style={{ fontSize: 11, color: "#faad14" }}>
                        ⚠️ Phí ước tính từ kho Hà Nội. Có thể chênh lệch nếu seller ở tỉnh khác.
                      </Text>
                    </div>
                  )}
                  
                  <Divider />
                  
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <Title level={4} style={{ margin: 0 }}>Tổng cộng</Title>
                    <Title level={4} style={{ margin: 0, color: "#1890ff" }}>{formatPrice(totalAmount)}</Title>
                  </div>
                  <Form.Item noStyle shouldUpdate={(prev, cur) => prev.paymentMethod !== cur.paymentMethod}>
                    {({ getFieldValue }) =>
                      getFieldValue("paymentMethod") === "STRIPE" ? (
                        <div style={{ background: "#fff7e6", border: "1px solid #ffd591", borderRadius: 8, padding: "10px 14px", marginBottom: 16 }}>
                          <Text style={{ fontSize: 13, color: "#d48806" }}>
                            ⚠️ Stripe sẽ thu <strong>{formatPrice(depositAmount)}</strong> (20% giá xe đặt cọc). Phí ship <strong>{shippingFee !== null ? formatPrice(shippingFee) : "chưa tính"}</strong> thanh toán khi nhận hàng.
                          </Text>
                        </div>
                      ) : null
                    }
                  </Form.Item>

                  <Button 
                    type="primary" 
                    block 
                    size="large" 
                    htmlType="submit"
                    loading={submitting}
                    style={{ height: 52, borderRadius: 12, fontSize: 16, fontWeight: 700 }}
                  >
                    Xác nhận đặt hàng
                  </Button>
                  
                  <div style={{ textAlign: "center", marginTop: 16 }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      Bằng cách đặt hàng, bạn đồng ý với Điều khoản dịch vụ của BikeMarket.
                    </Text>
                  </div>
                </Card>
              </Col>
            </Row>
          </Form>
        </motion.div>
      </div>
    </div>
  );
}
