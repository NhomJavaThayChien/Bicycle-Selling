package com.bicycle.selling.repository;

import java.util.Optional;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.bicycle.selling.model.Conversation;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    Optional<Conversation> findByBuyerIdAndSellerId(Long buyerId, Long sellerId);
    
    default Optional<Conversation> findConversationBetweenUsers(Long userId1, Long userId2) {
        Optional<Conversation> convo = findByBuyerIdAndSellerId(userId1, userId2);
        if (convo.isEmpty()) {
            convo = findByBuyerIdAndSellerId(userId2, userId1);
        }
        return convo;
    }

    List<Conversation> findByBuyerIdOrSellerId(Long buyerId, Long sellerId);
}