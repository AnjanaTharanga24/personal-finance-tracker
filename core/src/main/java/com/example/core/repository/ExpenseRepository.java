package com.example.core.repository;

import com.example.core.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    @Query("SELECT e FROM Expense e WHERE MONTH(e.date) = :month AND YEAR(e.date) = :year ORDER BY e.date DESC")
    List<Expense> findByMonthAndYear(@Param("month") int month, @Param("year") int year);

    @Query("SELECT e FROM Expense e WHERE MONTH(e.date) = :month AND YEAR(e.date) = :year AND e.category.id = :categoryId ORDER BY e.date DESC")
    List<Expense> findByMonthYearAndCategory(@Param("month") int month, @Param("year") int year, @Param("categoryId") Long categoryId);

    List<Expense> findByCategoryIdOrderByDateDesc(Long categoryId);

    List<Expense> findAllByOrderByDateDesc();

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE e.category.id = :categoryId AND MONTH(e.date) = :month AND YEAR(e.date) = :year")
    BigDecimal sumByCategoryAndMonthYear(@Param("categoryId") Long categoryId, @Param("month") int month, @Param("year") int year);

    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e WHERE MONTH(e.date) = :month AND YEAR(e.date) = :year")
    BigDecimal sumByMonthAndYear(@Param("month") int month, @Param("year") int year);

    @Query("SELECT e.category.name, e.category.color, e.category.icon, SUM(e.amount) FROM Expense e WHERE MONTH(e.date) = :month AND YEAR(e.date) = :year GROUP BY e.category.id, e.category.name, e.category.color, e.category.icon ORDER BY SUM(e.amount) DESC")
    List<Object[]> sumGroupedByCategoryForMonth(@Param("month") int month, @Param("year") int year);

    @Query("SELECT MONTH(e.date), YEAR(e.date), SUM(e.amount) FROM Expense e WHERE e.date >= :startDate GROUP BY YEAR(e.date), MONTH(e.date) ORDER BY YEAR(e.date), MONTH(e.date)")
    List<Object[]> monthlyTotals(@Param("startDate") java.time.LocalDate startDate);
}
