package com.example.core.dto;

import com.example.core.entity.Budget;
import lombok.Data;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Data
public class BudgetResponse {

    private Long id;
    private Long categoryId;
    private String categoryName;
    private String categoryIcon;
    private String categoryColor;
    private BigDecimal amount;
    private BigDecimal spentAmount;
    private BigDecimal remainingAmount;
    private int percentage;
    private int month;
    private int year;

    public static BudgetResponse from(Budget budget, BigDecimal spentAmount) {
        BudgetResponse res = new BudgetResponse();
        res.id = budget.getId();
        res.categoryId = budget.getCategory().getId();
        res.categoryName = budget.getCategory().getName();
        res.categoryIcon = budget.getCategory().getIcon();
        res.categoryColor = budget.getCategory().getColor();
        res.amount = budget.getAmount();
        res.spentAmount = spentAmount;
        res.remainingAmount = budget.getAmount().subtract(spentAmount);
        res.month = budget.getMonth();
        res.year = budget.getYear();

        if (budget.getAmount().compareTo(BigDecimal.ZERO) > 0) {
            res.percentage = spentAmount
                    .multiply(BigDecimal.valueOf(100))
                    .divide(budget.getAmount(), 0, RoundingMode.HALF_UP)
                    .intValue();
        }
        return res;
    }
}
