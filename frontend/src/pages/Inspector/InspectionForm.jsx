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
  CheckCircleOutlined,
} from "@ant-design/icons";
import { inspectionService } from "../../services/inspectionService";

const { TextArea } = Input;
const { Title } = Typography;

const InspectionForm = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      // Chỉ gửi các trường dữ liệu JSON mà Backend hỗ trợ
      const submitData = {
        frameScore: values.frameScore,
        brakeScore: values.brakeScore,
        drivetrainScore: values.drivetrainScore,
        wheelsScore: values.wheelsScore,
        handlebarSaddleScore: values.handlebarSaddleScore,
        summary: values.summary
      };
      
      await inspectionService.submit(reportId, submitData);
      message.success("Đã hoàn tất báo cáo kiểm định!");
      navigate("/inspector/dashboard");
    } catch (err) {
      console.error("Submission error:", err);
      message.error("Lỗi khi gửi báo cáo! Vui lòng thử lại.");
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
            frameScore: 10,
            brakeScore: 10,
            drivetrainScore: 10,
            wheelsScore: 10,
            handlebarSaddleScore: 10,
          }}
        >
          <Divider orientation="left">
            1. Đánh giá từng hạng mục (1 - 10 điểm)
          </Divider>
          <Row gutter={[24, 16]}>
            <Col span={8}>
              <Form.Item
                label="Khung sườn"
                name="frameScore"
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
                name="brakeScore"
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
                name="drivetrainScore"
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
                name="wheelsScore"
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
                name="handlebarSaddleScore"
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

          <Divider orientation="left">2. Ghi chú bổ sung</Divider>
          <Form.Item name="summary">
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
