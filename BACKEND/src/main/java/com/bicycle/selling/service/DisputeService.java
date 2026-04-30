package com.bicycle.selling.service;

import com.bicycle.selling.dto.*;
import com.bicycle.selling.model.*;
import com.bicycle.selling.model.enums.DisputeStatus;
import com.bicycle.selling.repository.*;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DisputeService {

    private final DisputeRepository disputeRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    // ==============================
    // Buyer mở tranh chấp
    // ==============================
    @Transactional
    public DisputeResponse createDispute(CreateDisputeRequest request, Long userId) {
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // chỉ buyer mới được mở dispute
        if (!order.getBuyer().getId().equals(userId)) {
            throw new RuntimeException("Only buyer can open dispute");
        }

        // tránh mở nhiều dispute cho 1 order
        disputeRepository.findByOrderId(order.getId())
                .ifPresent(d -> {
                    throw new RuntimeException("Dispute already exists for this order");
                });

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Dispute dispute = Dispute.builder()
                .order(order)
                .openedBy(user)
                .reason(request.getReason())
                .description(request.getDescription())
                .evidenceUrls(request.getEvidenceUrls())
                .status(DisputeStatus.OPEN)
                .build();

        // Cập nhật trạng thái đơn hàng sang DISPUTED
        order.setStatus(com.bicycle.selling.model.enums.OrderStatus.DISPUTED);
        orderRepository.save(order);

        return mapToResponse(disputeRepository.save(dispute));
    }

    // ==============================
    // Admin nhận xử lý
    // ==============================
    @Transactional
    public DisputeResponse takeDispute(Long disputeId, Long adminId) {
        Dispute dispute = getEntity(disputeId);

        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        if (dispute.getStatus() != DisputeStatus.OPEN) {
            throw new RuntimeException("Dispute is not open");
        }

        dispute.setHandledBy(admin);
        dispute.setStatus(DisputeStatus.UNDER_REVIEW);

        return mapToResponse(disputeRepository.save(dispute));
    }

    // ==============================
    // Resolve dispute
    // ==============================
    @Transactional
    public DisputeResponse resolveDispute(
            Long disputeId,
            ResolveDisputeRequest request,
            Long adminId
    ) {
        Dispute dispute = getEntity(disputeId);

        if (dispute.getStatus() != DisputeStatus.UNDER_REVIEW) {
            throw new RuntimeException("Dispute is not under review");
        }

        dispute.setResolution(request.getResolution());
        dispute.setStatus(DisputeStatus.RESOLVED);
        dispute.setResolvedAt(LocalDateTime.now());

        return mapToResponse(disputeRepository.save(dispute));
    }

    // ==============================
    // Close dispute
    // ==============================
    @Transactional
    public DisputeResponse closeDispute(Long disputeId) {
        Dispute dispute = getEntity(disputeId);

        dispute.setStatus(DisputeStatus.CLOSED);

        return mapToResponse(disputeRepository.save(dispute));
    }

    // ==============================
    // Get by id
    // ==============================
    @Transactional(readOnly = true)
    public DisputeResponse getById(Long id) {
        return mapToResponse(getEntity(id));
    }

    // ==============================
    // Get all
    // ==============================
    @Transactional(readOnly = true)
    public List<DisputeResponse> getAll() {
        return disputeRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    /**
     * Lấy danh sách ID các đơn hàng mà người dùng hiện tại đã mở tranh chấp.
     */
    @Transactional(readOnly = true)
    public List<Long> getDisputedOrderIdsByBuyer(Long buyerId) {
        return disputeRepository.findByOpenedById(buyerId)
                .stream()
                .map(d -> d.getOrder().getId())
                .toList();
    }

    // ==============================
    // PRIVATE
    // ==============================
    private Dispute getEntity(Long id) {
        return disputeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dispute not found"));
    }

    private DisputeResponse mapToResponse(Dispute d) {
        return DisputeResponse.builder()
                .id(d.getId())
                .orderId(d.getOrder().getId())
                .openedBy(d.getOpenedBy().getId())
                .handledBy(d.getHandledBy() != null ? d.getHandledBy().getId() : null)
                .reason(d.getReason())
                .description(d.getDescription())
                .evidenceUrls(d.getEvidenceUrls())
                .status(d.getStatus().name())
                .resolution(d.getResolution())
                .createdAt(d.getCreatedAt())
                .resolvedAt(d.getResolvedAt())
                .build();
    }
}