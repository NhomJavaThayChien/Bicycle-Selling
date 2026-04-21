package com.bicycle.selling.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ChatResponse {
    private Long id;
    private String content;
    private String senderUsername;
    private Long senderId;
    private String senderAvatarUrl;
    private LocalDateTime sentAt;
    private boolean isBotMessage;
    private boolean isRead;
}
