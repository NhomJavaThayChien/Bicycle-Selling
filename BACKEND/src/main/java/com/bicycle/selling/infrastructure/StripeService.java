package com.bicycle.selling.infrastructure;

import java.math.BigDecimal;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.model.checkout.Session;
import com.stripe.param.PaymentIntentCreateParams;
import com.stripe.param.checkout.SessionCreateParams;

import jakarta.annotation.PostConstruct;

@Component
public class StripeService {

        @Value("${stripe.api.key}")
        private String stripeApiKey;

        @Value("${success.url}")
        private String successUrl;

        @Value("${cancel.url}")
        private String cancelUrl;

        @PostConstruct
        public void init() {
                Stripe.apiKey = stripeApiKey;
        }

        public PaymentIntent createPaymentIntent(BigDecimal amount, String currency, String description)
                        throws StripeException {
                long unitAmount = convertAmount(amount, currency);
                PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                                .setAmount(unitAmount)
                                .setCurrency(currency)
                                .setDescription(description)
                                .build();
                return PaymentIntent.create(params);
        }

        public String createCheckoutSession(BigDecimal amount, String currency) throws StripeException {
                long unitAmount = convertAmount(amount, currency);

                SessionCreateParams params = SessionCreateParams.builder()
                                .setMode(SessionCreateParams.Mode.PAYMENT)
                                .setSuccessUrl(successUrl)
                                .setCancelUrl(cancelUrl)
                                .addLineItem(buildLineItem(unitAmount))
                                .build();

                return Session.create(params).getUrl();
        }
        
        private SessionCreateParams.LineItem buildLineItem(long unitAmount) {
                return SessionCreateParams.LineItem.builder().setQuantity(1L)
                .setPriceData(SessionCreateParams.LineItem.PriceData.builder()
                .setCurrency("vnd")
                .setUnitAmount(unitAmount)
                .setProductData( SessionCreateParams.LineItem.PriceData.ProductData
                        .builder()
                        .setName("Bicycle Deposit")
                        .build()).build())
                        .build();
        }
        
        private Long convertAmount(BigDecimal amount, String currency) {
                if ("vnd".equalsIgnoreCase(currency)) {
                        return amount.longValue();
                }
                return amount.multiply(new BigDecimal(100)).longValue();
        }
}
