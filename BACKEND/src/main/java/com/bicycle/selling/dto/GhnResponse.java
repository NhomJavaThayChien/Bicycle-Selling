package com.bicycle.selling.dto;

import lombok.Data;

@Data
public class GhnResponse<T> {
    private int code;
    private String message;
    private T data;
}
