package com.example.core.service;

import com.example.core.dto.ExpenseRequest;
import com.example.core.dto.ExpenseResponse;
import com.example.core.entity.Category;
import com.example.core.entity.Expense;
import com.example.core.exception.ResourceNotFoundException;
import com.example.core.repository.CategoryRepository;
import com.example.core.repository.ExpenseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final CategoryRepository categoryRepository;

    public List<ExpenseResponse> getAll(Integer month, Integer year, Long categoryId) {
        if (month != null && year != null && categoryId != null) {
            return expenseRepository.findByMonthYearAndCategory(month, year, categoryId)
                    .stream().map(ExpenseResponse::from).toList();
        }
        if (month != null && year != null) {
            return expenseRepository.findByMonthAndYear(month, year)
                    .stream().map(ExpenseResponse::from).toList();
        }
        if (categoryId != null) {
            return expenseRepository.findByCategoryIdOrderByDateDesc(categoryId)
                    .stream().map(ExpenseResponse::from).toList();
        }
        return expenseRepository.findAllByOrderByDateDesc()
                .stream().map(ExpenseResponse::from).toList();
    }

    public ExpenseResponse create(ExpenseRequest request) {
        Expense expense = buildExpense(new Expense(), request);
        return ExpenseResponse.from(expenseRepository.save(expense));
    }

    public ExpenseResponse update(Long id, ExpenseRequest request) {
        Expense expense = findById(id);
        buildExpense(expense, request);
        return ExpenseResponse.from(expenseRepository.save(expense));
    }

    public void delete(Long id) {
        findById(id);
        expenseRepository.deleteById(id);
    }

    private Expense buildExpense(Expense expense, ExpenseRequest request) {
        expense.setTitle(request.getTitle());
        expense.setAmount(request.getAmount());
        expense.setDate(request.getDate());
        expense.setNotes(request.getNotes());
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
            expense.setCategory(category);
        } else {
            expense.setCategory(null);
        }
        return expense;
    }

    private Expense findById(Long id) {
        return expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense not found with id: " + id));
    }
}
