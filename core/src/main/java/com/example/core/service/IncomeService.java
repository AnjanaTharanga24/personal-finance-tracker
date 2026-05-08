package com.example.core.service;

import com.example.core.dto.IncomeRequest;
import com.example.core.dto.IncomeResponse;
import com.example.core.entity.Income;
import com.example.core.exception.ResourceNotFoundException;
import com.example.core.repository.IncomeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class IncomeService {

    private final IncomeRepository incomeRepository;

    public List<IncomeResponse> getAll(Integer month, Integer year) {
        if (month != null && year != null) {
            return incomeRepository.findByMonthAndYear(month, year)
                    .stream().map(IncomeResponse::from).toList();
        }
        return incomeRepository.findAllByOrderByDateDesc()
                .stream().map(IncomeResponse::from).toList();
    }

    public IncomeResponse create(IncomeRequest request) {
        Income income = buildIncome(new Income(), request);
        return IncomeResponse.from(incomeRepository.save(income));
    }

    public IncomeResponse update(Long id, IncomeRequest request) {
        Income income = findById(id);
        buildIncome(income, request);
        return IncomeResponse.from(incomeRepository.save(income));
    }

    public void delete(Long id) {
        findById(id);
        incomeRepository.deleteById(id);
    }

    private Income buildIncome(Income income, IncomeRequest request) {
        income.setSource(request.getSource());
        income.setAmount(request.getAmount());
        income.setDate(request.getDate());
        income.setNotes(request.getNotes());
        return income;
    }

    private Income findById(Long id) {
        return incomeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Income not found with id: " + id));
    }
}
