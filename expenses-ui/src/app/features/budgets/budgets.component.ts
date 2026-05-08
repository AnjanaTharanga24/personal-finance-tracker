import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Budget, BudgetService } from '../../core/services/budget.service';
import { BudgetFormDialogComponent } from './budget-form-dialog/budget-form-dialog.component';

@Component({
  selector: 'app-budgets',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  templateUrl: './budgets.component.html',
  styleUrl: './budgets.component.scss'
})
export class BudgetsComponent implements OnInit {

  budgets: Budget[] = [];

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

  get totalBudget(): number {
    return this.budgets.reduce((s, b) => s + Number(b.amount), 0);
  }

  get totalSpent(): number {
    return this.budgets.reduce((s, b) => s + Number(b.spentAmount), 0);
  }

  constructor(
    private budgetService: BudgetService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    const currentYear = new Date().getFullYear();
    for (let y = currentYear + 1; y >= currentYear - 3; y--) this.years.push(y);
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.budgetService.getByMonthAndYear(
      this.monthControl.value!,
      this.yearControl.value!
    ).subscribe(data => this.budgets = data);
  }

  openForm(budget?: Budget): void {
    const ref = this.dialog.open(BudgetFormDialogComponent, {
      width: '440px',
      data: {
        budget: budget ?? null,
        month: this.monthControl.value,
        year: this.yearControl.value
      }
    });

    ref.afterClosed().subscribe(result => {
      if (!result) return;
      if (budget) {
        this.budgetService.update(budget.id, result).subscribe({
          next: () => {
            this.snackBar.open('Budget updated', 'Close', { duration: 3000 });
            this.load();
          },
          error: (err) => this.snackBar.open(err.error?.error ?? 'Error updating budget', 'Close', { duration: 3000 })
        });
      } else {
        this.budgetService.create(result).subscribe({
          next: () => {
            this.snackBar.open('Budget created', 'Close', { duration: 3000 });
            this.load();
          },
          error: (err) => this.snackBar.open(err.error?.error ?? 'Error creating budget', 'Close', { duration: 3000 })
        });
      }
    });
  }

  delete(budget: Budget): void {
    if (!confirm(`Delete budget for "${budget.categoryName}"?`)) return;
    this.budgetService.delete(budget.id).subscribe(() => {
      this.snackBar.open('Budget deleted', 'Close', { duration: 3000 });
      this.load();
    });
  }

  getProgressColor(percentage: number): string {
    if (percentage >= 100) return 'warn';
    if (percentage >= 80) return 'accent';
    return 'primary';
  }

  getStatusLabel(budget: Budget): string {
    if (budget.percentage >= 100) return 'Over budget';
    if (budget.percentage >= 80) return 'Near limit';
    return 'On track';
  }

  getStatusClass(budget: Budget): string {
    if (budget.percentage >= 100) return 'status-over';
    if (budget.percentage >= 80) return 'status-warn';
    return 'status-ok';
  }
}
