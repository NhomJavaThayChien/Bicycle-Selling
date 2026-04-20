import { Form, InputNumber, Button, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function InspectionForm() {
  const { id } = useParams();
  const [form] = Form.useForm();

  const onFinish = (values) => {
    const formData = new FormData();

    formData.append("data", JSON.stringify(values));
    formData.append("file", values.file.file.originFileObj);

    axios
      .post(`/inspector/${id}/submit`, formData)
      .then(() => message.success("Submitted!"));
  };

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Form.Item name="frame" label="Frame Score">
        <InputNumber min={1} max={10} />
      </Form.Item>

      <Form.Item name="brake" label="Brake Score">
        <InputNumber min={1} max={10} />
      </Form.Item>

      <Form.Item name="transmission" label="Transmission Score">
        <InputNumber min={1} max={10} />
      </Form.Item>

      <Form.Item name="wheel" label="Wheel Score">
        <InputNumber min={1} max={10} />
      </Form.Item>

      <Form.Item name="seatHandle" label="Seat/Handle Score">
        <InputNumber min={1} max={10} />
      </Form.Item>

      <Form.Item name="file" label="Upload PDF">
        <Upload beforeUpload={() => false}>
          <Button icon={<UploadOutlined />}>Upload</Button>
        </Upload>
      </Form.Item>

      <Button type="primary" htmlType="submit">
        Submit
      </Button>
    </Form>
  );
}
