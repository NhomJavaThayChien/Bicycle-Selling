package com.bicycle.selling.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bicycle.selling.dto.ConversationResponse;
import com.bicycle.selling.model.Conversation;
import com.bicycle.selling.security.UserDetailsImpl;
import com.bicycle.selling.service.ConversationService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/conservation")
@AllArgsConstructor
public class ConservationController {
    private final ConversationService conversationService;

    @PostMapping()
    public ResponseEntity<ConversationResponse> createOrGetConversation(
            @AuthenticationPrincipal UserDetailsImpl user,
            @RequestParam Long otherUserId,
            @RequestParam Long listingId) {
        Conversation convo = conversationService.getOrCreateConversation(
                user.getId(),
                otherUserId,
                listingId);

        Long buyerId = convo.getBuyer().getId();
        Long sellerId = convo.getSeller().getId();

        String buyerUsername = convo.getBuyer().getUsername();
        String buyerAvatar = convo.getBuyer().getAvatarUrl();

        ConversationResponse response = new ConversationResponse(
                convo.getId(),
                buyerId,
                sellerId,
                buyerUsername,
                buyerAvatar);

        return ResponseEntity.ok(response);
    }
}
