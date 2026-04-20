package com.bicycle.selling.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bicycle.selling.model.Message;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    public List<Message> findBySenderId(Long senderId);
    public List<Message> findByConversationId(Long conversationId);
    public void deleteBySenderId(Long senderId);
}