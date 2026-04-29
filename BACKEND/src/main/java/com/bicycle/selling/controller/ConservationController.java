package com.bicycle.selling.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.bicycle.selling.dto.ConversationResponse;
import com.bicycle.selling.security.UserDetailsImpl;
import com.bicycle.selling.service.ConversationService;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/conservation")
@AllArgsConstructor
public class ConservationController {
    private final ConversationService conversationService;

    /** POST /api/conservation?otherUserId=X&listingId=Y */
    @PostMapping
    public ResponseEntity<ConversationResponse> createOrGetConversation(
            @AuthenticationPrincipal UserDetailsImpl user,
            @RequestParam Long otherUserId,
            @RequestParam Long listingId) {

        ConversationResponse response = conversationService
                .getOrCreateConversation(user.getId(), otherUserId, listingId);

        return ResponseEntity.ok(response);
    }

    /** GET /api/conservation — Lấy tất cả cuộc hội thoại của user hiện tại */
    @GetMapping
    public ResponseEntity<List<ConversationResponse>> getUserConversations(
            @AuthenticationPrincipal UserDetailsImpl user) {
        return ResponseEntity.ok(conversationService.getConversationsForUser(user.getId()));
    }
}
