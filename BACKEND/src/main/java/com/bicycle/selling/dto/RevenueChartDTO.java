package com.bicycle.selling.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class RevenueChartDTO {
    private LocalDate date;
    private double revenue;
}