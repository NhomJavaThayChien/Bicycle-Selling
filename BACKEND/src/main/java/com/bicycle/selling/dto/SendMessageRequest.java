package com.bicycle.selling.dto;

import lombok.Data;

@Data
public class SendMessageRequest {
    private Long conversationId;
    private String content;
}