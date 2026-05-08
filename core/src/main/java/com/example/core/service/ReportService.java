package com.example.core.service;

import com.example.core.dto.DashboardSummary;
import com.example.core.dto.MonthlyReport;
import com.example.core.entity.Budget;
import com.example.core.repository.BudgetRepository;
import com.example.core.repository.ExpenseRepository;
import com.example.core.repository.IncomeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.Month;
import java.time.format.TextStyle;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final ExpenseRepository expenseRepository;
    private final IncomeRepository incomeRepository;
    private final BudgetRepository budgetRepository;

    public DashboardSummary getSummary(int month, int year) {
        DashboardSummary summary = new DashboardSummary();

        BigDecimal totalExpenses = expenseRepository.sumByMonthAndYear(month, year);
        BigDecimal totalIncome = incomeRepository.sumByMonthAndYear(month, year);

        summary.setTotalExpenses(totalExpenses);
        summary.setTotalIncome(totalIncome);
        summary.setNetSavings(totalIncome.subtract(totalExpenses));

        // Budget status
        var budgets = budgetRepository.findByMonthAndYearOrderByIdAsc(month, year);
        summary.setTotalBudgets(budgets.size());
        long overCount = budgets.stream().filter(b -> {
            BigDecimal spent = expenseRepository.sumByCategoryAndMonthYear(
                    b.getCategory().getId(), month, year);
            return spent.compareTo(b.getAmount()) > 0;
        }).count();
        summary.setOverBudgetCount((int) overCount);

        // Expenses by category
        List<DashboardSummary.CategoryExpense> byCategory = expenseRepository
                .sumGroupedByCategoryForMonth(month, year)
                .stream()
                .map(row -> new DashboardSummary.CategoryExpense(
                        row[0] != null ? (String) row[0] : "Uncategorized",
                        row[1] != null ? (String) row[1] : "#9e9e9e",
                        (BigDecimal) row[3]))
                .toList();
        summary.setExpensesByCategory(byCategory);

        // Monthly trend — last 6 months
        LocalDate sixMonthsAgo = LocalDate.of(year, month, 1).minusMonths(5);
        Map<String, BigDecimal> expenseTrend = new LinkedHashMap<>();
        Map<String, BigDecimal> incomeTrend = new LinkedHashMap<>();

        expenseRepository.monthlyTotals(sixMonthsAgo)
                .forEach(row -> expenseTrend.put(row[1] + "-" + row[0], (BigDecimal) row[2]));
        incomeRepository.monthlyTotals(sixMonthsAgo)
                .forEach(row -> incomeTrend.put(row[1] + "-" + row[0], (BigDecimal) row[2]));

        List<DashboardSummary.MonthlyData> trend = new ArrayList<>();
        LocalDate cursor = sixMonthsAgo;
        for (int i = 0; i < 6; i++) {
            String key = cursor.getYear() + "-" + cursor.getMonthValue();
            trend.add(new DashboardSummary.MonthlyData(
                    cursor.getMonthValue(),
                    cursor.getYear(),
                    expenseTrend.getOrDefault(key, BigDecimal.ZERO),
                    incomeTrend.getOrDefault(key, BigDecimal.ZERO)
            ));
            cursor = cursor.plusMonths(1);
        }
        summary.setMonthlyTrend(trend);

        // Recent 5 expenses
        List<DashboardSummary.RecentExpense> recent = expenseRepository
                .findByMonthAndYear(month, year)
                .stream()
                .limit(5)
                .map(e -> new DashboardSummary.RecentExpense(
                        e.getTitle(),
                        e.getAmount(),
                        e.getDate().toString(),
                        e.getCategory() != null ? e.getCategory().getName() : null,
                        e.getCategory() != null ? e.getCategory().getColor() : null
                ))
                .toList();
        summary.setRecentExpenses(recent);

        return summary;
    }

    public MonthlyReport getMonthlyReport(int month, int year) {
        MonthlyReport report = new MonthlyReport();
        report.setMonth(month);
        report.setYear(year);

        BigDecimal totalExpenses = expenseRepository.sumByMonthAndYear(month, year);
        BigDecimal totalIncome = incomeRepository.sumByMonthAndYear(month, year);
        report.setTotalExpenses(totalExpenses);
        report.setTotalIncome(totalIncome);
        report.setNetSavings(totalIncome.subtract(totalExpenses));

        // Category breakdown with budget comparison
        Map<Long, Budget> budgetMap = new HashMap<>();
        budgetRepository.findByMonthAndYearOrderByIdAsc(month, year)
                .forEach(b -> budgetMap.put(b.getCategory().getId(), b));

        List<MonthlyReport.CategoryRow> rows = expenseRepository
                .sumGroupedByCategoryForMonth(month, year)
                .stream()
                .map(row -> {
                    String catName = row[0] != null ? (String) row[0] : "Uncategorized";
                    String color = row[1] != null ? (String) row[1] : "#9e9e9e";
                    String icon = row[2] != null ? (String) row[2] : "category";
                    BigDecimal amount = (BigDecimal) row[3];
                    double pct = totalExpenses.compareTo(BigDecimal.ZERO) > 0
                            ? amount.multiply(BigDecimal.valueOf(100))
                            .divide(totalExpenses, 1, RoundingMode.HALF_UP).doubleValue()
                            : 0;
                    return new MonthlyReport.CategoryRow(catName, color, icon, amount, pct, null, null, "—");
                })
                .toList();
        report.setCategoryBreakdown(rows);

        // Monthly trend — last 6 months
        LocalDate start = LocalDate.of(year, month, 1).minusMonths(5);
        Map<String, BigDecimal> expMap = new LinkedHashMap<>();
        Map<String, BigDecimal> incMap = new LinkedHashMap<>();
        expenseRepository.monthlyTotals(start).forEach(r -> expMap.put(r[1] + "-" + r[0], (BigDecimal) r[2]));
        incomeRepository.monthlyTotals(start).forEach(r -> incMap.put(r[1] + "-" + r[0], (BigDecimal) r[2]));

        List<MonthlyReport.TrendRow> trend = new ArrayList<>();
        LocalDate cursor = start;
        for (int i = 0; i < 6; i++) {
            String key = cursor.getYear() + "-" + cursor.getMonthValue();
            BigDecimal exp = expMap.getOrDefault(key, BigDecimal.ZERO);
            BigDecimal inc = incMap.getOrDefault(key, BigDecimal.ZERO);
            String label = Month.of(cursor.getMonthValue())
                    .getDisplayName(TextStyle.SHORT, Locale.ENGLISH) + " " + cursor.getYear();
            trend.add(new MonthlyReport.TrendRow(cursor.getMonthValue(), cursor.getYear(), label, exp, inc, inc.subtract(exp)));
            cursor = cursor.plusMonths(1);
        }
        report.setTrend(trend);

        return report;
    }
}
