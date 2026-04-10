import { Table, Button, Select, message } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";

export default function UserManagement() {
  const [users, setUsers] = useState([]);

  const loadUsers = (role = "") => {
    axios
      .get("/admin/users", { params: { role } })
      .then((res) => setUsers(res.data));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const toggle = (id) => {
    axios.post(`/admin/users/${id}/toggle`).then(() => {
      message.success("Updated!");
      loadUsers();
    });
  };

  return (
    <>
      <Select
        placeholder="Filter role"
        onChange={loadUsers}
        style={{ width: 200, marginBottom: 10 }}
      >
        <Select.Option value="">All</Select.Option>
        <Select.Option value="ADMIN">Admin</Select.Option>
        <Select.Option value="USER">User</Select.Option>
      </Select>

      <Table
        dataSource={users}
        rowKey="id"
        columns={[
          { title: "Name", dataIndex: "name" },
          { title: "Email", dataIndex: "email" },
          { title: "Role", dataIndex: "role" },
          {
            title: "Status",
            dataIndex: "active",
            render: (a) => (a ? "Active" : "Disabled"),
          },
          {
            title: "Action",
            render: (_, r) => (
              <Button onClick={() => toggle(r.id)}>Toggle</Button>
            ),
          },
        ]}
      />
    </>
  );
}
