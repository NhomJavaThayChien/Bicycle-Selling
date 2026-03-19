import React from "react";
import { Link } from "react-router-dom";
import Button from "../../components/common/Button"; // Import button dùng chung

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-9xl font-bold text-gray-800">404</h1>
      <h2 className="text-2xl font-semibold text-gray-600 mt-4">
        Ôi không! Trang bạn tìm kiếm không tồn tại.
      </h2>
      <p className="text-gray-500 mt-2 mb-6">
        Có thể đường dẫn bị sai hoặc trang đã bị gỡ bỏ.
      </p>

      {/* Sử dụng component Button dùng chung để giữ đồng bộ UI */}
      <Link to="/">
        <Button variant="primary" size="lg">
          Quay lại Trang chủ
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
