package com.bicycle.selling.service;

import org.springframework.stereotype.Service;

import com.bicycle.selling.model.Conversation;
import com.bicycle.selling.repository.BicycleListingRepository;
import com.bicycle.selling.repository.ConversationRepository;
import com.bicycle.selling.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ConversationService {
    private final ConversationRepository conversationRepository;
    private final UserRepository userRepository;
    private final BicycleListingRepository bicycleListingRepository;

    // Get id conservation between 2 user its can be buyer and seller or smt else, if not exist then create new one
    public Conversation getOrCreateConversation(Long userId1, Long userId2, Long listingId) {
        return conversationRepository
                .findByBuyerIdAndSellerId(userId1, userId2)
                .orElseGet(() -> {
                    Conversation convo = new Conversation();
                    convo.setBuyer(userRepository.findById(userId1).orElseThrow());
                    convo.setSeller(userRepository.findById(userId2).orElseThrow());
                    convo.setListing(bicycleListingRepository.findById(listingId).orElseThrow());
                    return conversationRepository.save(convo);
                });
    }
}
