package com.example.core.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
public class DashboardSummary {

    private BigDecimal totalExpenses;
    private BigDecimal totalIncome;
    private BigDecimal netSavings;
    private int totalBudgets;
    private int overBudgetCount;
    private List<CategoryExpense> expensesByCategory;
    private List<MonthlyData> monthlyTrend;
    private List<RecentExpense> recentExpenses;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class CategoryExpense {
        private String categoryName;
        private String categoryColor;
        private BigDecimal total;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class MonthlyData {
        private int month;
        private int year;
        private BigDecimal totalExpenses;
        private BigDecimal totalIncome;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class RecentExpense {
        private String title;
        private BigDecimal amount;
        private String date;
        private String categoryName;
        private String categoryColor;
    }
}
