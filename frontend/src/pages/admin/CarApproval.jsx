import { Table, Button, Modal, Input, message } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";

export default function CarApproval() {
  const [cars, setCars] = useState([]);
  const [reason, setReason] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const loadData = () => {
    axios.get("/admin/cars/pending").then((res) => setCars(res.data));
  };

  useEffect(() => {
    loadData();
  }, []);

  const approve = (id) => {
    axios.post(`/admin/cars/${id}/approve`).then(() => {
      message.success("Approved!");
      loadData();
    });
  };

  const reject = () => {
    axios.post(`/admin/cars/${selectedId}/reject`, { reason }).then(() => {
      message.success("Rejected!");
      setSelectedId(null);
      setReason("");
      loadData();
    });
  };

  const columns = [
    { title: "Name", dataIndex: "name" },
    { title: "Price", dataIndex: "price" },
    {
      title: "Action",
      render: (_, record) => (
        <>
          <Button type="primary" onClick={() => approve(record.id)}>
            Approve
          </Button>
          <Button
            danger
            onClick={() => setSelectedId(record.id)}
            style={{ marginLeft: 8 }}
          >
            Reject
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <Table dataSource={cars} columns={columns} rowKey="id" />

      <Modal
        title="Reject Reason"
        open={!!selectedId}
        onOk={reject}
        onCancel={() => setSelectedId(null)}
      >
        <Input
          placeholder="Enter reason..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </Modal>
    </>
  );
}
