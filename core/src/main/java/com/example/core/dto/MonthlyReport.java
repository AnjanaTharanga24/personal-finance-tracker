package com.example.core.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
public class MonthlyReport {

    private int month;
    private int year;
    private BigDecimal totalExpenses;
    private BigDecimal totalIncome;
    private BigDecimal netSavings;
    private List<CategoryRow> categoryBreakdown;
    private List<TrendRow> trend;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CategoryRow {
        private String categoryName;
        private String categoryColor;
        private String categoryIcon;
        private BigDecimal amount;
        private double percentage;
        private BigDecimal budgetAmount;
        private BigDecimal spentVsBudget;
        private String status;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class TrendRow {
        private int month;
        private int year;
        private String monthLabel;
        private BigDecimal totalExpenses;
        private BigDecimal totalIncome;
        private BigDecimal savings;
    }
}
