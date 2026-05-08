package com.example.core.dto;

import com.example.core.entity.Expense;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class ExpenseResponse {

    private Long id;
    private String title;
    private BigDecimal amount;
    private LocalDate date;
    private String notes;
    private Long categoryId;
    private String categoryName;
    private String categoryIcon;
    private String categoryColor;
    private LocalDateTime createdAt;

    public static ExpenseResponse from(Expense expense) {
        ExpenseResponse res = new ExpenseResponse();
        res.id = expense.getId();
        res.title = expense.getTitle();
        res.amount = expense.getAmount();
        res.date = expense.getDate();
        res.notes = expense.getNotes();
        res.createdAt = expense.getCreatedAt();
        if (expense.getCategory() != null) {
            res.categoryId = expense.getCategory().getId();
            res.categoryName = expense.getCategory().getName();
            res.categoryIcon = expense.getCategory().getIcon();
            res.categoryColor = expense.getCategory().getColor();
        }
        return res;
    }
}
