import React, { useState } from "react";

const Brand = () => {
  // 1. Dữ liệu mẫu (Sau này sẽ thay bằng gọi API axios.get)
  const [brands, setBrands] = useState([
    {
      id: 1,
      name: "Giant",
      description: "Thương hiệu xe đạp số 1 thế giới",
      country: "Đài Loan",
    },
    {
      id: 2,
      name: "Trek",
      description: "Dòng xe thể thao cao cấp",
      country: "Mỹ",
    },
    {
      id: 3,
      name: "Asama",
      description: "Xe đạp phổ thông bền bỉ",
      country: "Việt Nam",
    },
    {
      id: 4,
      name: "Specialized",
      description: "Xe đạp đua chuyên nghiệp",
      country: "Mỹ",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBrand, setCurrentBrand] = useState({
    name: "",
    description: "",
    country: "",
  });
  const [isEdit, setIsEdit] = useState(false);

  // Mở modal để thêm mới
  const handleAdd = () => {
    setCurrentBrand({ name: "", description: "", country: "" });
    setIsEdit(false);
    setIsModalOpen(true);
  };

  // Mở modal để sửa
  const handleEdit = (brand) => {
    setCurrentBrand(brand);
    setIsEdit(true);
    setIsModalOpen(true);
  };

  // Xóa thương hiệu
  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa thương hiệu này?")) {
      setBrands(brands.filter((b) => b.id !== id));
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Quản lý Thương hiệu</h2>
        <button style={styles.addButton} onClick={handleAdd}>
          + Thêm thương hiệu
        </button>
      </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Tên hãng</th>
            <th style={styles.th}>Xuất xứ</th>
            <th style={styles.th}>Mô tả</th>
            <th style={styles.th}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {brands.map((brand) => (
            <tr key={brand.id} style={styles.tr}>
              <td style={styles.td}>{brand.id}</td>
              <td style={styles.td}>
                <strong>{brand.name}</strong>
              </td>
              <td style={styles.td}>{brand.country}</td>
              <td style={styles.td}>{brand.description}</td>
              <td style={styles.td}>
                <button
                  style={styles.editBtn}
                  onClick={() => handleEdit(brand)}
                >
                  Sửa
                </button>
                <button
                  style={styles.deleteBtn}
                  onClick={() => handleDelete(brand.id)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL THÊM/SỬA (Làm đơn giản bằng CSS) */}
      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <h3>{isEdit ? "Chỉnh sửa thương hiệu" : "Thêm thương hiệu mới"}</h3>
            <div style={styles.formGroup}>
              <label>Tên thương hiệu:</label>
              <input
                style={styles.input}
                value={currentBrand.name}
                onChange={(e) =>
                  setCurrentBrand({ ...currentBrand, name: e.target.value })
                }
              />
            </div>
            <div style={styles.formGroup}>
              <label>Xuất xứ:</label>
              <input
                style={styles.input}
                value={currentBrand.country}
                onChange={(e) =>
                  setCurrentBrand({ ...currentBrand, country: e.target.value })
                }
              />
            </div>
            <div style={styles.formGroup}>
              <label>Mô tả:</label>
              <textarea
                style={styles.input}
                rows="3"
                value={currentBrand.description}
                onChange={(e) =>
                  setCurrentBrand({
                    ...currentBrand,
                    description: e.target.value,
                  })
                }
              />
            </div>
            <div style={styles.modalActions}>
              <button
                style={styles.cancelBtn}
                onClick={() => setIsModalOpen(false)}
              >
                Hủy
              </button>
              <button
                style={styles.saveBtn}
                onClick={() => setIsModalOpen(false)}
              >
                Lưu lại
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// CSS nội bộ cho đẹp
const styles = {
  container: { padding: "30px", background: "#f8fafc", minHeight: "90vh" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  title: { margin: 0, color: "#1e293b" },
  addButton: {
    padding: "10px 20px",
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
  },
  table: {
    width: "100%",
    background: "#fff",
    borderCollapse: "collapse",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
  },
  th: {
    background: "#f1f5f9",
    padding: "15px",
    textAlign: "left",
    color: "#64748b",
    fontSize: "14px",
  },
  td: {
    padding: "15px",
    borderBottom: "1px solid #f1f5f9",
    fontSize: "14px",
    color: "#334155",
  },
  editBtn: {
    marginRight: "10px",
    padding: "5px 12px",
    background: "#f59e0b",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  deleteBtn: {
    padding: "5px 12px",
    background: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },

  // Modal styles
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    width: "400px",
    boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
  },
  formGroup: { marginBottom: "15px", textAlign: "left" },
  input: {
    width: "100%",
    padding: "10px",
    marginTop: "5px",
    borderRadius: "6px",
    border: "1px solid #e2e8f0",
    boxSizing: "border-box",
  },
  modalActions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "20px",
  },
  cancelBtn: {
    padding: "8px 16px",
    background: "#94a3b8",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  saveBtn: {
    padding: "8px 16px",
    background: "#10b981",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default Brand;
