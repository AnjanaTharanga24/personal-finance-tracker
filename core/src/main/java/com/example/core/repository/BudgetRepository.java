package com.example.core.repository;

import com.example.core.entity.Budget;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BudgetRepository extends JpaRepository<Budget, Long> {

    List<Budget> findByMonthAndYearOrderByIdAsc(int month, int year);

    Optional<Budget> findByCategoryIdAndMonthAndYear(Long categoryId, int month, int year);
}
