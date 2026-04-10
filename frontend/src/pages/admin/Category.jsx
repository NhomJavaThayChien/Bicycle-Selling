import { Table, Button, Modal, Input, message } from "antd";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Category() {
  const [data, setData] = useState([]);
  const [name, setName] = useState("");
  const [editing, setEditing] = useState(null);

  const load = () => {
    axios.get("/admin/categories").then((res) => setData(res.data));
  };

  useEffect(() => {
    load();
  }, []);

  const save = () => {
    if (editing) {
      axios.put(`/admin/categories/${editing}`, { name });
    } else {
      axios.post("/admin/categories", { name });
    }

    message.success("Saved!");
    setName("");
    setEditing(null);
    load();
  };

  const remove = (id) => {
    axios.delete(`/admin/categories/${id}`).then(load);
  };

  return (
    <>
      <Button onClick={() => setEditing(0)}>Add</Button>

      <Table
        dataSource={data}
        rowKey="id"
        columns={[
          { title: "Name", dataIndex: "name" },
          {
            title: "Action",
            render: (_, r) => (
              <>
                <Button
                  onClick={() => {
                    setEditing(r.id);
                    setName(r.name);
                  }}
                >
                  Edit
                </Button>
                <Button danger onClick={() => remove(r.id)}>
                  Delete
                </Button>
              </>
            ),
          },
        ]}
      />

      <Modal
        open={editing !== null}
        onOk={save}
        onCancel={() => setEditing(null)}
      >
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </Modal>
    </>
  );
}
