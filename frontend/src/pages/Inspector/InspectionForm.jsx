import React, { useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Button,
  Card,
  Row,
  Col,
  message,
  Divider,
  Typography,
  Alert,
  Statistic,
} from "antd";
import { useParams, useNavigate } from "react-router-dom";
import {
  SaveOutlined,
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import { inspectionService } from "../../services/inspectionService";

const { TextArea } = Input;
const { Title } = Typography;

const SCORE_FIELDS = [
  { name: "frameScore", label: "Khung sườn" },
  { name: "brakeScore", label: "Hệ thống phanh" },
  { name: "drivetrainScore", label: "Bộ truyền động" },
  { name: "wheelsScore", label: "Bánh xe / Lốp" },
  { name: "handlebarSaddleScore", label: "Yên / Tay lái" },
];

const InspectionForm = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [scores, setScores] = useState({});

  // Tính điểm trung bình theo các field đã điền
  const filledScores = Object.values(scores).filter(
    (v) => v !== null && v !== undefined && v !== ""
  );
  const avg =
    filledScores.length > 0
      ? filledScores.reduce((a, b) => a + b, 0) / filledScores.length
      : null;
  const isPassed = avg !== null && avg >= 7;

  const handleScoreChange = (fieldName, value) => {
    setScores((prev) => ({ ...prev, [fieldName]: value }));
  };

  const onFinish = async (values) => {
    // Kiểm tra ít nhất 1 field có giá trị
    const hasAtLeastOne = SCORE_FIELDS.some(
      (f) => values[f.name] !== null && values[f.name] !== undefined
    );
    if (!hasAtLeastOne) {
      message.error("Vui lòng nhập ít nhất một hạng mục điểm!");
      return;
    }

    setLoading(true);
    try {
      const submitData = {
        frameScore: values.frameScore ?? null,
        brakeScore: values.brakeScore ?? null,
        drivetrainScore: values.drivetrainScore ?? null,
        wheelsScore: values.wheelsScore ?? null,
        handlebarSaddleScore: values.handlebarSaddleScore ?? null,
        summary: values.summary ?? null,
        recommendations: values.recommendations ?? null,
      };

      await inspectionService.submit(reportId, submitData);
      message.success("Đã hoàn tất báo cáo kiểm định!");
      navigate("/inspector/dashboard");
    } catch (err) {
      console.error("Submission error:", err);
      const errMsg =
        err?.response?.data?.message || "Lỗi khi gửi báo cáo! Vui lòng thử lại.";
      message.error(errMsg);
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
          CHI TIẾT KIỂM ĐỊNH #{reportId}
        </Title>

        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Divider orientation="left">
            1. Đánh giá từng hạng mục (1–10 điểm, bỏ trống nếu không kiểm)
          </Divider>

          <Row gutter={[24, 16]}>
            {SCORE_FIELDS.map((field) => (
              <Col span={8} key={field.name}>
                <Form.Item
                  label={field.label}
                  name={field.name}
                  // optional — không required
                >
                  <InputNumber
                    min={1}
                    max={10}
                    style={{ width: "100%" }}
                    placeholder="Bỏ trống nếu không kiểm"
                    onChange={(val) => handleScoreChange(field.name, val)}
                  />
                </Form.Item>
              </Col>
            ))}
          </Row>

          {/* Preview điểm trung bình */}
          {avg !== null && (
            <Card
              style={{
                marginBottom: 24,
                borderRadius: 8,
                border: `1px solid ${isPassed ? "#b7eb8f" : "#ffadd2"}`,
                backgroundColor: isPassed ? "#f6ffed" : "#fff0f6",
              }}
            >
              <Row align="middle" gutter={24}>
                <Col>
                  <Statistic
                    title="Điểm trung bình"
                    value={avg.toFixed(2)}
                    suffix="/ 10"
                    valueStyle={{ color: isPassed ? "#389e0d" : "#c41d7f" }}
                  />
                </Col>
                <Col>
                  {isPassed ? (
                    <Alert
                      message="Dự kiến: ĐẠT (PASSED)"
                      description={`Điểm ${avg.toFixed(2)} ≥ 7 → Sẽ tự động APPROVED`}
                      type="success"
                      icon={<CheckCircleOutlined />}
                      showIcon
                    />
                  ) : (
                    <Alert
                      message="Dự kiến: KHÔNG ĐẠT (FAILED)"
                      description={`Điểm ${avg.toFixed(2)} < 7 → Sẽ tự động REJECTED`}
                      type="error"
                      icon={<CloseCircleOutlined />}
                      showIcon
                    />
                  )}
                </Col>
              </Row>
            </Card>
          )}

          <Divider orientation="left">2. Ghi chú bổ sung</Divider>
          <Form.Item name="summary" label="Nhận xét tổng quan">
            <TextArea
              rows={3}
              placeholder="Nhập nhận xét tổng quan về tình trạng xe..."
            />
          </Form.Item>
          <Form.Item name="recommendations" label="Khuyến nghị sửa chữa">
            <TextArea
              rows={2}
              placeholder="Ghi các hạng mục nên sửa chữa (nếu có)..."
            />
          </Form.Item>

          <Form.Item style={{ marginTop: 24 }}>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={loading}
              block
              size="large"
              style={{
                height: "50px",
                borderRadius: "8px",
                fontSize: "16px",
                backgroundColor: avg !== null && !isPassed ? "#ff4d4f" : undefined,
                borderColor: avg !== null && !isPassed ? "#ff4d4f" : undefined,
              }}
            >
              {avg !== null
                ? isPassed
                  ? "XÁC NHẬN — ĐẠT KIỂM ĐỊNH"
                  : "XÁC NHẬN — TỪ CHỐI LISTING"
                : "XÁC NHẬN VÀ XUẤT BÁO CÁO"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default InspectionForm;
