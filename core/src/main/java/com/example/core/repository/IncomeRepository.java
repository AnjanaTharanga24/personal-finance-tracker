package com.example.core.repository;

import com.example.core.entity.Income;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface IncomeRepository extends JpaRepository<Income, Long> {

    @Query("SELECT i FROM Income i WHERE MONTH(i.date) = :month AND YEAR(i.date) = :year ORDER BY i.date DESC")
    List<Income> findByMonthAndYear(@Param("month") int month, @Param("year") int year);

    List<Income> findAllByOrderByDateDesc();
}
