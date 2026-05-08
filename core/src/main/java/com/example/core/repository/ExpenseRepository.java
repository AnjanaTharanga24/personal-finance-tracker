package com.example.core.repository;

import com.example.core.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    @Query("SELECT e FROM Expense e WHERE MONTH(e.date) = :month AND YEAR(e.date) = :year ORDER BY e.date DESC")
    List<Expense> findByMonthAndYear(@Param("month") int month, @Param("year") int year);

    @Query("SELECT e FROM Expense e WHERE MONTH(e.date) = :month AND YEAR(e.date) = :year AND e.category.id = :categoryId ORDER BY e.date DESC")
    List<Expense> findByMonthYearAndCategory(@Param("month") int month, @Param("year") int year, @Param("categoryId") Long categoryId);

    List<Expense> findByCategoryIdOrderByDateDesc(Long categoryId);

    List<Expense> findAllByOrderByDateDesc();
}
