package com.bicycle.selling.dto;

import lombok.AllArgsConstructor;
import lombok.Value;

@Value
@AllArgsConstructor
public class ConversationResponse {
    private Long conversationId;
    private Long buyerId;
    private Long sellerId;
    private Long otherUserId;
    private String otherUsername;
    private String otherAvatarUrl;
}
