package com.example.core.controller;

import com.example.core.entity.Expense;
import com.example.core.entity.Income;
import com.example.core.repository.ExpenseRepository;
import com.example.core.repository.IncomeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/export")
@RequiredArgsConstructor
public class ExportController {

    private final ExpenseRepository expenseRepository;
    private final IncomeRepository incomeRepository;

    @GetMapping("/expenses")
    public ResponseEntity<byte[]> exportExpenses(
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year) {

        int m = month != null ? month : LocalDate.now().getMonthValue();
        int y = year != null ? year : LocalDate.now().getYear();

        List<Expense> expenses = expenseRepository.findByMonthAndYear(m, y);

        StringBuilder csv = new StringBuilder();
        csv.append("Date,Title,Category,Amount,Notes\n");
        for (Expense e : expenses) {
            csv.append(escape(e.getDate().toString())).append(",");
            csv.append(escape(e.getTitle())).append(",");
            csv.append(escape(e.getCategory() != null ? e.getCategory().getName() : "")).append(",");
            csv.append(e.getAmount()).append(",");
            csv.append(escape(e.getNotes() != null ? e.getNotes() : "")).append("\n");
        }

        byte[] bytes = csv.toString().getBytes();
        String filename = "expenses_" + y + "_" + String.format("%02d", m) + ".csv";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .contentLength(bytes.length)
                .body(bytes);
    }

    @GetMapping("/incomes")
    public ResponseEntity<byte[]> exportIncomes(
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year) {

        int m = month != null ? month : LocalDate.now().getMonthValue();
        int y = year != null ? year : LocalDate.now().getYear();

        List<Income> incomes = incomeRepository.findByMonthAndYear(m, y);

        StringBuilder csv = new StringBuilder();
        csv.append("Date,Source,Amount,Notes\n");
        for (Income i : incomes) {
            csv.append(escape(i.getDate().toString())).append(",");
            csv.append(escape(i.getSource())).append(",");
            csv.append(i.getAmount()).append(",");
            csv.append(escape(i.getNotes() != null ? i.getNotes() : "")).append("\n");
        }

        byte[] bytes = csv.toString().getBytes();
        String filename = "incomes_" + y + "_" + String.format("%02d", m) + ".csv";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.parseMediaType("text/csv"))
                .contentLength(bytes.length)
                .body(bytes);
    }

    private String escape(String value) {
        if (value == null) return "";
        if (value.contains(",") || value.contains("\"") || value.contains("\n")) {
            return "\"" + value.replace("\"", "\"\"") + "\"";
        }
        return value;
    }
}
