package com.bicycle.selling.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.bicycle.selling.dto.ChatResponse;
import com.bicycle.selling.model.Conversation;
import com.bicycle.selling.model.Message;
import com.bicycle.selling.model.User;
import com.bicycle.selling.repository.ConversationRepository;
import com.bicycle.selling.repository.MessageRepository;
import com.bicycle.selling.repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final ConversationRepository conversationRepository;

    @Transactional
    public void sendMessage(Long senderId, Long conversationId, String content) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new RuntimeException("Conversation not found"));

        Message message = Message.builder()
                .sender(sender)
                .conversation(conversation)
                .content(content)
                .build();

        messageRepository.save(message);
    }

    @Transactional
    public void deleteMessage(Long messageId) {
        messageRepository.deleteById(messageId);
    }

    @Transactional
    public void deleteAllMessagesByUserId(Long userId) {
        messageRepository.deleteBySenderId(userId);
    }

    @Transactional
    public List<ChatResponse> getMessagesByConversation(Long conversationId) {
        List<Message> messages = messageRepository.findByConversationId(conversationId);

        return messages.stream().map(message -> new ChatResponse(
                message.getId(),
                message.getContent(),
                message.getSender().getUsername(),
                message.getSender().getId(),
                message.getSender().getAvatarUrl(),
                message.getSentAt(),
                message.isBotMessage(),
                message.isRead())).toList();
    }

    @Transactional
    public void markMessagesAsRead(Long conversationId, Long userId) {
        List<Message> messages = messageRepository.findByConversationId(conversationId);

        messages.stream()
                .filter(message -> !message.getSender().getId().equals(userId) && !message.isRead())
                .forEach(message -> {
                    message.setRead(true);
                    messageRepository.save(message);
                });
    }
}