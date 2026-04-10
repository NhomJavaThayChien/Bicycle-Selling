import { Table, Button, Tag } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";

export default function InspectorDashboard() {
  const [data, setData] = useState([]);

  const load = () => {
    axios.get("/inspector/requests").then((res) => setData(res.data));
  };

  useEffect(() => {
    load();
  }, []);

  const columns = [
    { title: "Car", dataIndex: "carName" },
    { title: "Owner", dataIndex: "ownerName" },
    {
      title: "Status",
      dataIndex: "status",
      render: (s) => <Tag color="orange">{s}</Tag>,
    },
    {
      title: "Action",
      render: (_, r) => (
        <Button type="primary" href={`/inspector/form/${r.id}`}>
          Inspect
        </Button>
      ),
    },
  ];

  return <Table dataSource={data} columns={columns} rowKey="id" />;
}
