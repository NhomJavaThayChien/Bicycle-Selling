package com.bicycle.selling.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bicycle.selling.model.Conversation;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    Optional<Conversation> findByBuyerIdAndSellerId(Long buyerId, Long sellerId);
}