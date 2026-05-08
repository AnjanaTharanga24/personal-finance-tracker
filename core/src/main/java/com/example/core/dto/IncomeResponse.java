package com.example.core.dto;

import com.example.core.entity.Income;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class IncomeResponse {

    private Long id;
    private String source;
    private BigDecimal amount;
    private LocalDate date;
    private String notes;
    private LocalDateTime createdAt;

    public static IncomeResponse from(Income income) {
        IncomeResponse res = new IncomeResponse();
        res.id = income.getId();
        res.source = income.getSource();
        res.amount = income.getAmount();
        res.date = income.getDate();
        res.notes = income.getNotes();
        res.createdAt = income.getCreatedAt();
        return res;
    }
}
