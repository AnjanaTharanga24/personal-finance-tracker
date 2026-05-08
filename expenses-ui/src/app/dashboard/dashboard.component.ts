import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Chart } from 'chart.js/auto';
import { ReportService, DashboardSummary } from '../core/services/report.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressBarModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit, OnDestroy {

  @ViewChild('donutCanvas') donutCanvas!: ElementRef;
  @ViewChild('barCanvas') barCanvas!: ElementRef;

  summary: DashboardSummary | null = null;
  private donutChart?: Chart;
  private barChart?: Chart;

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

  constructor(private reportService: ReportService) {
    const currentYear = new Date().getFullYear();
    for (let y = currentYear; y >= currentYear - 4; y--) this.years.push(y);
  }

  ngOnInit(): void {
    this.load();
  }

  ngOnDestroy(): void {
    this.donutChart?.destroy();
    this.barChart?.destroy();
  }

  load(): void {
    this.donutChart?.destroy();
    this.barChart?.destroy();
    this.donutChart = undefined;
    this.barChart = undefined;

    this.reportService.getSummary(
      this.monthControl.value!,
      this.yearControl.value!
    ).subscribe(data => {
      this.summary = data;
      // setTimeout lets Angular process *ngIf and render canvas elements before Chart.js runs
      setTimeout(() => this.renderCharts(), 0);
    });
  }

  onFilterChange(): void {
    this.load();
  }

  private renderCharts(): void {
    if (!this.summary) return;
    this.renderDonut();
    this.renderBar();
  }

  private renderDonut(): void {
    const data = this.summary!.expensesByCategory;
    if (!data.length) return;

    this.donutChart = new Chart(this.donutCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: data.map(d => d.categoryName),
        datasets: [{
          data: data.map(d => d.total),
          backgroundColor: data.map(d => d.categoryColor),
          borderWidth: 2,
          borderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'right' },
          tooltip: {
            callbacks: {
              label: (ctx) => ` ${ctx.label}: Rs. ${Number(ctx.raw).toFixed(2)}`
            }
          }
        }
      }
    });
  }

  private renderBar(): void {
    const trend = this.summary!.monthlyTrend;
    const labels = trend.map(d => this.months[d.month - 1].label.substring(0, 3) + ' ' + d.year);

    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            label: 'Income',
            data: trend.map(d => d.totalIncome),
            backgroundColor: 'rgba(102, 187, 106, 0.8)',
            borderColor: '#388e3c',
            borderWidth: 1,
            borderRadius: 4
          },
          {
            label: 'Expenses',
            data: trend.map(d => d.totalExpenses),
            backgroundColor: 'rgba(239, 83, 80, 0.8)',
            borderColor: '#c62828',
            borderWidth: 1,
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (val) => Number(val).toFixed(0)
            }
          }
        }
      }
    });
  }

  getMonthName(month: number): string {
    return this.months[month - 1]?.label ?? '';
  }

  getSavingsClass(): string {
    if (!this.summary) return '';
    return this.summary.netSavings >= 0 ? 'positive' : 'negative';
  }
}
