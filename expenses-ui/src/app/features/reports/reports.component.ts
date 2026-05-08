import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { ReportService, MonthlyReport } from '../../core/services/report.service';
import { ExportService } from '../../core/services/export.service';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatTableModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatDividerModule
  ],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent implements OnInit {

  report: MonthlyReport | null = null;

  months = [
    { value: 1, label: 'January' }, { value: 2, label: 'February' },
    { value: 3, label: 'March' }, { value: 4, label: 'April' },
    { value: 5, label: 'May' }, { value: 6, label: 'June' },
    { value: 7, label: 'July' }, { value: 8, label: 'August' },
    { value: 9, label: 'September' }, { value: 10, label: 'October' },
    { value: 11, label: 'November' }, { value: 12, label: 'December' }
  ];

  years: number[] = [];
  monthControl = new FormControl<number>(new Date().getMonth() + 1);
  yearControl = new FormControl<number>(new Date().getFullYear());

  categoryColumns = ['category', 'amount', 'percentage'];
  trendColumns = ['month', 'income', 'expenses', 'savings'];

  constructor(
    private reportService: ReportService,
    private exportService: ExportService
  ) {
    const currentYear = new Date().getFullYear();
    for (let y = currentYear; y >= currentYear - 4; y--) this.years.push(y);
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.reportService.getMonthlyReport(
      this.monthControl.value!,
      this.yearControl.value!
    ).subscribe(data => this.report = data);
  }

  exportExpenses(): void {
    this.exportService.downloadCsv('expenses', this.monthControl.value!, this.yearControl.value!);
  }

  exportIncomes(): void {
    this.exportService.downloadCsv('incomes', this.monthControl.value!, this.yearControl.value!);
  }

  getMonthLabel(): string {
    return this.months.find(m => m.value === this.monthControl.value)?.label ?? '';
  }

  getSavingsClass(val: number): string {
    return val >= 0 ? 'positive' : 'negative';
  }

  getBarWidth(pct: number): string {
    return Math.min(pct, 100) + '%';
  }
}
