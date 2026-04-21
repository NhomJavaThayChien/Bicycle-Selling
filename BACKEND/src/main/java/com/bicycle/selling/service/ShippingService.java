package com.bicycle.selling.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bicycle.selling.dto.CreateShippingOrderRequest;
import com.bicycle.selling.dto.GhnDistrict;
import com.bicycle.selling.dto.GhnProvince;
import com.bicycle.selling.dto.GhnWard;
import com.bicycle.selling.dto.ShippingFee;
import com.bicycle.selling.dto.ShippingOrderResponse;
import com.bicycle.selling.infrastructure.GhnService;
import com.bicycle.selling.infrastructure.ShippingDimension;
import com.bicycle.selling.model.BicycleListing;
import com.bicycle.selling.model.Order;
import com.bicycle.selling.model.Payment;
import com.bicycle.selling.model.ShippingOrder;
import com.bicycle.selling.model.enums.OrderStatus;
import com.bicycle.selling.model.enums.PaymentMethod;
import com.bicycle.selling.model.enums.ShippingStatus;
import com.bicycle.selling.repository.BicycleListingRepository;
import com.bicycle.selling.repository.OrderRepository;
import com.bicycle.selling.repository.ShippingRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class ShippingService {
    private final GhnService ghnService;
    private final BicycleListingRepository listingRepository;
    private final ShippingRepository shippingRepository;
    private final OrderRepository orderRepository;

    public List<GhnProvince> getProvinces() {
        return ghnService.getProvinces();
    }

    public List<GhnDistrict> getDistricts(int provinceId) {
        return ghnService.getDistricts(provinceId);
    }

    public List<GhnWard> getWards(int districtId) {
        return ghnService.getWards(districtId);
    }

    public ShippingFee calculateShippingFee(Long listingId, int fromDistrictId, String fromWardCode, int toDistrictId,
            String toWardCode) {
        BicycleListing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new RuntimeException("Listing not found"));
        BigDecimal fee = ghnService.calculateShippingFee(listing, fromDistrictId, fromWardCode, toDistrictId,
                toWardCode);
        ShippingFee shippingFee = new ShippingFee();
        shippingFee.setFee(fee);
        return shippingFee;
    }

    @Transactional
    public ShippingOrderResponse createShippingOrder(CreateShippingOrderRequest request) {
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (order.getShippingOrder() != null) {
            throw new RuntimeException("Shipping order already exists for this order");
        }

        if (order.getStatus() != OrderStatus.CONFIRMED) {
            throw new RuntimeException("Order must be confirmed before creating shipping");
        }

        Payment payment = order.getPayment();
        if (payment == null) {
            throw new RuntimeException("Payment not found for this order");
        }

        BicycleListing listing = order.getListing();

        String toName = order.getBuyer().getFullName();
        String toPhone = order.getBuyer().getPhone();
        String toAddress = order.getShippingAddress();

        // Request body
        int toDistrictId = request.getToDistrictId();
        int fromDistrictId = request.getFromDistrictId();
        String fromWardCode = request.getFromWardCode();
        String toWardCode = request.getToWardCode();
        String toProvinceName = request.getToProvinceName();
        String toDistrictName = request.getToDistrictName();
        String toWardName = request.getToWardName();

        // caculator cod amount
        BigDecimal agreePrice = order.getAgreedPrice();
        BigDecimal depositAmount = order.getDepositAmount() != null
                ? order.getDepositAmount()
                : BigDecimal.ZERO;

        BigDecimal codAmount = BigDecimal.ZERO;

        if (payment.getMethod() == PaymentMethod.STRIPE) {
            if (Boolean.TRUE.equals(payment.isDeposit())) {
                codAmount = agreePrice.subtract(depositAmount);
            }
        } else if (payment.getMethod() == PaymentMethod.CASH) {
            codAmount = agreePrice;
        }

        int intCodAmount = codAmount.intValue();

        Map<String, Object> ghnResult = ghnService.createOrder(
                listing,
                fromDistrictId,
                fromWardCode,
                toDistrictId,
                toWardCode,
                toName,
                toPhone,
                toAddress,
                intCodAmount);

        String ghnOrderCode = (String) ghnResult.get("order_code");
        Integer totalFee = (Integer) ghnResult.get("total_fee");

        ShippingDimension d = ghnService.resolveDimension(listing);

        String trackingUrl = "https://tracking.ghn.dev/?order_code=" + ghnOrderCode;

        BigDecimal finalAmount = codAmount.add(BigDecimal.valueOf(totalFee));

        ShippingOrder shippingOrder = ShippingOrder.builder()
                .ghnOrderCode(ghnOrderCode)
                .shippingFee(BigDecimal.valueOf(totalFee))
                .codAmount(finalAmount)
                // recipient
                .recipientName(toName)
                .recipientPhone(toPhone)
                .recipientAddress(toAddress)

                .recipientProvinceName(toProvinceName)
                .recipientDistrictId(toDistrictId)
                .recipientDistrictName(toDistrictName)
                .recipientWardCode(toWardCode)
                .recipientWardName(toWardName)

                // dimension
                .weightGram(d.getWeight())
                .lengthCm(d.getLength())
                .widthCm(d.getWidth())
                .heightCm(d.getHeight())

                // status
                .status(ShippingStatus.WAITING_PICKUP)

                // tracking
                .trackingUrl(trackingUrl)

                // relation
                .order(order)

                .build();

        order.setShippingOrder(shippingOrder);

        ShippingOrder saved = shippingRepository.save(shippingOrder);
        
        return ShippingOrderResponse.from(saved);
    }

    public void updateGhnCod(Order order, BigDecimal codAmount) {

        if (order.getShippingOrder() == null) {
            throw new RuntimeException("Shipping order not found");
        }

        ShippingOrder shipping = order.getShippingOrder();

        String ghnOrderCode = shipping.getGhnOrderCode();

        if (ghnOrderCode == null || ghnOrderCode.isEmpty()) {
            throw new RuntimeException("GHN order code not found");
        }

        if (shipping.getStatus() == ShippingStatus.DELIVERED) {
            throw new RuntimeException("Cannot update COD for delivered order");
        }

        if (codAmount == null || codAmount.compareTo(BigDecimal.ZERO) < 0) {
            throw new RuntimeException("COD amount must be >= 0");
        }

        try {
            int codAmountInt = order.getAgreedPrice().intValue() - codAmount.intValue();
            if (codAmountInt < 0) {
                throw new RuntimeException("COD amount use to update must be >= 0");
            }
            ghnService.updateCOD(ghnOrderCode, codAmountInt);

            shipping.setCodAmount(BigDecimal.valueOf(codAmountInt));

            shippingRepository.save(shipping);

            System.out.println("COD updated successfully for orderId=" + order.getId());

        } catch (Exception e) {
            System.err.println("Failed to update COD GHN for orderId=" + order.getId());
            e.printStackTrace();

            throw new RuntimeException("Update COD failed: " + e.getMessage());
        }
    }
}
