package com.bicycle.selling.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.bicycle.selling.dto.ConversationResponse;
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

    /**
     * Tìm hoặc tạo cuộc hội thoại giữa 2 người dùng.
     * Trả về ConversationResponse với thông tin "người kia" từ góc nhìn của currentUserId.
     */
    @Transactional
    public ConversationResponse getOrCreateConversation(Long currentUserId, Long otherUserId, Long listingId) {
        Conversation convo = conversationRepository
                .findConversationBetweenUsers(currentUserId, otherUserId)
                .orElseGet(() -> {
                    Conversation newConvo = new Conversation();
                    newConvo.setBuyer(userRepository.findById(currentUserId)
                            .orElseThrow(() -> new RuntimeException("User not found: " + currentUserId)));
                    newConvo.setSeller(userRepository.findById(otherUserId)
                            .orElseThrow(() -> new RuntimeException("User not found: " + otherUserId)));
                    newConvo.setListing(bicycleListingRepository.findById(listingId)
                            .orElseThrow(() -> new RuntimeException("Listing not found: " + listingId)));
                    return conversationRepository.save(newConvo);
                });

        // Xác định "người kia" từ góc nhìn của người đang gọi
        boolean isCurrentUserBuyer = convo.getBuyer().getId().equals(currentUserId);
        Long resolvedOtherUserId  = isCurrentUserBuyer ? convo.getSeller().getId() : convo.getBuyer().getId();
        String otherUsername = isCurrentUserBuyer ? convo.getSeller().getUsername() : convo.getBuyer().getUsername();
        String otherAvatar   = isCurrentUserBuyer ? convo.getSeller().getAvatarUrl() : convo.getBuyer().getAvatarUrl();

        return new ConversationResponse(
                convo.getId(),
                convo.getBuyer().getId(),
                convo.getSeller().getId(),
                resolvedOtherUserId,
                otherUsername,
                otherAvatar);
    }

    @Transactional(readOnly = true)
    public List<ConversationResponse> getConversationsForUser(Long userId) {
        return conversationRepository.findByBuyerIdOrSellerId(userId, userId)
                .stream()
                .map(convo -> {
                    boolean isCurrentUserBuyer = convo.getBuyer().getId().equals(userId);
                    Long otherUserId     = isCurrentUserBuyer ? convo.getSeller().getId() : convo.getBuyer().getId();
                    String otherUsername = isCurrentUserBuyer ? convo.getSeller().getUsername() : convo.getBuyer().getUsername();
                    String otherAvatar   = isCurrentUserBuyer ? convo.getSeller().getAvatarUrl() : convo.getBuyer().getAvatarUrl();
                    return new ConversationResponse(
                            convo.getId(),
                            convo.getBuyer().getId(),
                            convo.getSeller().getId(),
                            otherUserId,
                            otherUsername,
                            otherAvatar);
                })
                .collect(Collectors.toList());
    }
}
