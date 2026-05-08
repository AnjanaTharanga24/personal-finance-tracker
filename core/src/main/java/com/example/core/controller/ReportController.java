package com.example.core.controller;

import com.example.core.dto.DashboardSummary;
import com.example.core.dto.MonthlyReport;
import com.example.core.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/summary")
    public DashboardSummary getSummary(
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year) {
        int m = month != null ? month : LocalDate.now().getMonthValue();
        int y = year != null ? year : LocalDate.now().getYear();
        return reportService.getSummary(m, y);
    }

    @GetMapping("/monthly")
    public MonthlyReport getMonthlyReport(
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year) {
        int m = month != null ? month : LocalDate.now().getMonthValue();
        int y = year != null ? year : LocalDate.now().getYear();
        return reportService.getMonthlyReport(m, y);
    }
}
