import { Table, Button, Modal, Input, message } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";

export default function DisputeManagement() {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState("");

  const load = () => {
    axios.get("/admin/disputes").then((res) => setData(res.data));
  };

  useEffect(() => {
    load();
  }, []);

  const resolve = () => {
    axios.post(`/admin/disputes/${selected}/resolve`, { result }).then(() => {
      message.success("Resolved!");
      setSelected(null);
      load();
    });
  };

  return (
    <>
      <Table
        dataSource={data}
        rowKey="id"
        columns={[
          { title: "User", dataIndex: "user" },
          { title: "Issue", dataIndex: "issue" },
          {
            title: "Action",
            render: (_, r) => (
              <Button onClick={() => setSelected(r.id)}>Resolve</Button>
            ),
          },
        ]}
      />

      <Modal
        open={!!selected}
        onOk={resolve}
        onCancel={() => setSelected(null)}
      >
        <Input.TextArea
          placeholder="Resolution..."
          onChange={(e) => setResult(e.target.value)}
        />
      </Modal>
    </>
  );
}
