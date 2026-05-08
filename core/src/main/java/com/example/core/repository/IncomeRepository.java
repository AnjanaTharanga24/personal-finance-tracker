package com.example.core.repository;

import com.example.core.entity.Income;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface IncomeRepository extends JpaRepository<Income, Long> {

    @Query("SELECT i FROM Income i WHERE MONTH(i.date) = :month AND YEAR(i.date) = :year ORDER BY i.date DESC")
    List<Income> findByMonthAndYear(@Param("month") int month, @Param("year") int year);

    List<Income> findAllByOrderByDateDesc();

    @Query("SELECT COALESCE(SUM(i.amount), 0) FROM Income i WHERE MONTH(i.date) = :month AND YEAR(i.date) = :year")
    BigDecimal sumByMonthAndYear(@Param("month") int month, @Param("year") int year);

    @Query("SELECT MONTH(i.date), YEAR(i.date), SUM(i.amount) FROM Income i WHERE i.date >= :startDate GROUP BY YEAR(i.date), MONTH(i.date) ORDER BY YEAR(i.date), MONTH(i.date)")
    List<Object[]> monthlyTotals(@Param("startDate") java.time.LocalDate startDate);
}
