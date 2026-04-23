package com.bicycle.selling.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class OrderChartDTO {
    private LocalDate date;
    private long count;
}