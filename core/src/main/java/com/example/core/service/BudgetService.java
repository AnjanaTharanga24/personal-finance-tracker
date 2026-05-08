package com.example.core.service;

import com.example.core.dto.BudgetRequest;
import com.example.core.dto.BudgetResponse;
import com.example.core.entity.Budget;
import com.example.core.entity.Category;
import com.example.core.exception.ResourceNotFoundException;
import com.example.core.repository.BudgetRepository;
import com.example.core.repository.CategoryRepository;
import com.example.core.repository.ExpenseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final CategoryRepository categoryRepository;
    private final ExpenseRepository expenseRepository;

    public List<BudgetResponse> getByMonthAndYear(int month, int year) {
        return budgetRepository.findByMonthAndYearOrderByIdAsc(month, year)
                .stream()
                .map(b -> {
                    BigDecimal spent = expenseRepository.sumByCategoryAndMonthYear(
                            b.getCategory().getId(), month, year);
                    return BudgetResponse.from(b, spent);
                })
                .toList();
    }

    public BudgetResponse create(BudgetRequest request) {
        if (budgetRepository.findByCategoryIdAndMonthAndYear(
                request.getCategoryId(), request.getMonth(), request.getYear()).isPresent()) {
            throw new IllegalArgumentException("Budget for this category already exists for the selected month/year");
        }
        Category category = findCategory(request.getCategoryId());
        Budget budget = new Budget(null, category, request.getAmount(), request.getMonth(), request.getYear());
        Budget saved = budgetRepository.save(budget);
        BigDecimal spent = expenseRepository.sumByCategoryAndMonthYear(
                category.getId(), request.getMonth(), request.getYear());
        return BudgetResponse.from(saved, spent);
    }

    public BudgetResponse update(Long id, BudgetRequest request) {
        Budget budget = findById(id);
        budgetRepository.findByCategoryIdAndMonthAndYear(
                request.getCategoryId(), request.getMonth(), request.getYear())
                .ifPresent(existing -> {
                    if (!existing.getId().equals(id)) {
                        throw new IllegalArgumentException("Budget for this category already exists for the selected month/year");
                    }
                });
        budget.setCategory(findCategory(request.getCategoryId()));
        budget.setAmount(request.getAmount());
        budget.setMonth(request.getMonth());
        budget.setYear(request.getYear());
        Budget saved = budgetRepository.save(budget);
        BigDecimal spent = expenseRepository.sumByCategoryAndMonthYear(
                saved.getCategory().getId(), saved.getMonth(), saved.getYear());
        return BudgetResponse.from(saved, spent);
    }

    public void delete(Long id) {
        findById(id);
        budgetRepository.deleteById(id);
    }

    private Budget findById(Long id) {
        return budgetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found with id: " + id));
    }

    private Category findCategory(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
    }
}
