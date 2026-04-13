import { Table } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Transaction() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("/admin/transactions").then((res) => setData(res.data));
  }, []);

  return (
    <Table
      dataSource={data}
      rowKey="id"
      columns={[
        { title: "User", dataIndex: "user" },
        { title: "Amount", dataIndex: "amount" },
        { title: "Fee", dataIndex: "fee" },
        { title: "Date", dataIndex: "date" },
      ]}
    />
  );
}
