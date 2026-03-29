package com.bicycle.selling.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.bicycle.selling.dto.ChatResponse;
import com.bicycle.selling.dto.SendMessageRequest;
import com.bicycle.selling.security.UserDetailsImpl;
import com.bicycle.selling.service.ChatService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    // send message
    @PostMapping("/messages")
    public ResponseEntity<?> sendMessage(
            @AuthenticationPrincipal UserDetailsImpl user,
            @RequestBody SendMessageRequest request) {
        try {
            chatService.sendMessage(
                    user.getId(),
                    request.getConversationId(),
                    request.getContent());

            return ResponseEntity.ok(Map.of("message", "Message sent successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // get messages by conversation
    @GetMapping("/conversations/{conversationId}/messages")
    public ResponseEntity<?> getMessages(
            @PathVariable Long conversationId) {
        
        try {
            List<ChatResponse> messages = chatService.getMessagesByConversation(conversationId);
            return ResponseEntity.ok(messages);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // delete message by id
    @DeleteMapping("/messages/{messageId}")
    public ResponseEntity<?> deleteMessage(
            @PathVariable Long messageId) {
        try {
            chatService.deleteMessage(messageId);
            return ResponseEntity.ok(Map.of("message", "Message deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // delete all messages by user id
    @DeleteMapping("/messages/user/{userId}")
    public ResponseEntity<?> deleteMessagesByUserId(
            @PathVariable Long userId) {
        try {
            chatService.deleteAllMessagesByUserId(userId);
            return ResponseEntity.ok(Map.of("message", "Messages deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // mark messages as read
    @PostMapping("/conversations/{conversationId}/read")
    public ResponseEntity<?> markMessagesAsRead(
            @AuthenticationPrincipal UserDetailsImpl user,
            @PathVariable Long conversationId) {
        try {
            chatService.markMessagesAsRead(conversationId, user.getId());
            return ResponseEntity.ok(Map.of("message", "Messages marked as read"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}