package com.bicycle.selling.model.enums;

public enum InspectionStatus {
    REQUESTED,          // Đang yêu cầu kiểm định
    IN_PROGRESS,        // Đang kiểm định
    PASSED,             // Đạt tiêu chuẩn
    FAILED,             // Không đạt
    CANCELLED           // Đã huỷ yêu cầu
}
