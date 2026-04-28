import React, { useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Card,
  Row,
  Col,
  Upload,
  message,
  Divider,
  Typography,
} from "antd";
import { useParams, useNavigate } from "react-router-dom";
import {
  SaveOutlined,
  ArrowLeftOutlined,
  InboxOutlined,
  FilePdfOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { inspectionService } from "../../services/inspectionService";

const { TextArea } = Input;
const { Dragger } = Upload;
const { Title, Text } = Typography;

const InspectionForm = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Logic xử lý: Nếu có file PDF, bạn cần upload lên server/cloud trước để lấy URL
      // Ở đây mình giả định bạn gửi kèm thông tin file trong object values
      await inspectionService.submit(reportId, values);
      message.success("Đã hoàn tất báo cáo kiểm định Phase 3!");
      navigate("/inspector/dashboard");
    } catch (err) {
      message.error("Lỗi khi gửi báo cáo!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "30px", maxWidth: "900px", margin: "0 auto" }}>
      <Button
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate(-1)}
        style={{ marginBottom: 16 }}
      >
        Quay lại Dashboard
      </Button>

      <Card
        bordered={false}
        style={{
          borderRadius: "12px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        }}
      >
        <Title level={3} style={{ textAlign: "center", marginBottom: 30 }}>
          <CheckCircleOutlined style={{ color: "#52c41a", marginRight: 10 }} />
          CHI TIẾT KIỂM ĐỊNH # {reportId}
        </Title>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            status: "PASSED",
            scoreFrame: 10,
            scoreBrakes: 10,
            scoreDrivetrain: 10,
            scoreWheels: 10,
            scoreHandlebar: 10,
          }}
        >
          <Divider orientation="left">
            1. Đánh giá từng hạng mục (1 - 10 điểm)
          </Divider>
          <Row gutter={[24, 16]}>
            <Col span={8}>
              <Form.Item
                label="Khung sườn"
                name="scoreFrame"
                rules={[{ required: true }]}
              >
                <InputNumber
                  min={1}
                  max={10}
                  style={{ width: "100%" }}
                  placeholder="Điểm khung"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Hệ thống phanh"
                name="scoreBrakes"
                rules={[{ required: true }]}
              >
                <InputNumber
                  min={1}
                  max={10}
                  style={{ width: "100%" }}
                  placeholder="Điểm phanh"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Bộ truyền động"
                name="scoreDrivetrain"
                rules={[{ required: true }]}
              >
                <InputNumber
                  min={1}
                  max={10}
                  style={{ width: "100%" }}
                  placeholder="Điểm xích/líp"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Bánh xe/Lốp"
                name="scoreWheels"
                rules={[{ required: true }]}
              >
                <InputNumber
                  min={1}
                  max={10}
                  style={{ width: "100%" }}
                  placeholder="Điểm bánh"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Yên / Tay lái"
                name="scoreHandlebar"
                rules={[{ required: true }]}
              >
                <InputNumber
                  min={1}
                  max={10}
                  style={{ width: "100%" }}
                  placeholder="Điểm yên/tay"
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="Kết luận chung"
                name="status"
                rules={[{ required: true }]}
              >
                <Select
                  size="large"
                  style={{ border: "1px solid #d9d9d9", borderRadius: "4px" }}
                >
                  <Select.Option value="PASSED">ĐẠT (PASSED)</Select.Option>
                  <Select.Option value="FAILED">
                    KHÔNG ĐẠT (FAILED)
                  </Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Divider orientation="left">2. Hồ sơ đính kèm (PDF)</Divider>
          <Form.Item name="reportPdf">
            <Dragger
              accept=".pdf"
              maxCount={1}
              beforeUpload={() => false} // Chặn tự động upload để xử lý tay
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Nhấp hoặc kéo tệp PDF vào đây để tải lên
              </p>
              <p className="ant-upload-hint">
                Yêu cầu tệp PDF chính thức có chữ ký kiểm định.
              </p>
            </Dragger>
          </Form.Item>

          <Divider orientation="left">3. Ghi chú bổ sung</Divider>
          <Form.Item name="notes">
            <TextArea
              rows={4}
              placeholder="Nhập chi tiết tình trạng xe nếu có hư hỏng..."
            />
          </Form.Item>

          <Form.Item style={{ marginTop: 40 }}>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={loading}
              block
              size="large"
              style={{ height: "50px", borderRadius: "8px", fontSize: "16px" }}
            >
              XÁC NHẬN VÀ XUẤT BÁO CÁO
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default InspectionForm;
