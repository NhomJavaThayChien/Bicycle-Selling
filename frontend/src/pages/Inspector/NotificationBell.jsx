import { BellOutlined } from "@ant-design/icons";
import { Badge, Dropdown, List } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";

export default function NotificationBell() {
  const [data, setData] = useState([]);

  const load = () => {
    axios.get("/notifications").then((res) => setData(res.data));
  };

  useEffect(() => {
    load();
  }, []);

  const markRead = (id) => {
    axios.post(`/notifications/${id}/read`).then(load);
  };

  const menu = (
    <List
      dataSource={data}
      renderItem={(item) => (
        <List.Item onClick={() => markRead(item.id)}>{item.message}</List.Item>
      )}
      style={{ width: 300 }}
    />
  );

  return (
    <Dropdown overlay={menu} trigger={["click"]}>
      <Badge count={data.filter((n) => !n.read).length}>
        <BellOutlined style={{ fontSize: 20 }} />
      </Badge>
    </Dropdown>
  );
}
