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
    public ResponseEntity<Map<String, String>> sendMessage(
            @AuthenticationPrincipal UserDetailsImpl user,
            @RequestBody SendMessageRequest request) {
        chatService.sendMessage(
                user.getId(),
                request.getConversationId(),
                request.getContent());

        return ResponseEntity.ok(Map.of("message", "Message sent successfully"));
    }

    // get messages by conversation
    @GetMapping("/conversations/{conversationId}/messages")
    public List<ChatResponse> getMessages(
            @PathVariable Long conversationId) {
        return chatService.getMessagesByConversation(conversationId);
    }

    // delete message by id
    @DeleteMapping("/messages/{messageId}")
    public ResponseEntity<Map<String, String>> deleteMessage(
            @PathVariable Long messageId) {
        chatService.deleteMessage(messageId);
        return ResponseEntity.ok(Map.of("message", "Message deleted successfully"));
    }

    // delete all messages by user id
    @DeleteMapping("/messages/user/{userId}")
    public ResponseEntity<Map<String, String>> deleteMessagesByUserId(
            @PathVariable Long userId) {
        chatService.deleteAllMessagesByUserId(userId);
        return ResponseEntity.ok(Map.of("message", "Messages deleted successfully"));
    }

    // mark messages as read
    @PostMapping("/conversations/{conversationId}/read")
    public ResponseEntity<Map<String, String>> markMessagesAsRead(
            @AuthenticationPrincipal UserDetailsImpl user,
            @PathVariable Long conversationId) {
        chatService.markMessagesAsRead(conversationId, user.getId());
        return ResponseEntity.ok(Map.of("message", "Messages marked as read"));
    }
}