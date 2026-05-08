import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { Expense, ExpenseService } from '../../core/services/expense.service';
import { Category, CategoryService } from '../../core/services/category.service';
import { ExpenseFormDialogComponent } from './expense-form-dialog/expense-form-dialog.component';

@Component({
  selector: 'app-expenses',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatCardModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatChipsModule
  ],
  templateUrl: './expenses.component.html',
  styleUrl: './expenses.component.scss'
})
export class ExpensesComponent implements OnInit {

  expenses: Expense[] = [];
  categories: Category[] = [];
  displayedColumns = ['date', 'title', 'category', 'amount', 'actions'];

  months = [
    { value: 1, label: 'January' }, { value: 2, label: 'February' },
    { value: 3, label: 'March' }, { value: 4, label: 'April' },
    { value: 5, label: 'May' }, { value: 6, label: 'June' },
    { value: 7, label: 'July' }, { value: 8, label: 'August' },
    { value: 9, label: 'September' }, { value: 10, label: 'October' },
    { value: 11, label: 'November' }, { value: 12, label: 'December' }
  ];

  years: number[] = [];

  monthControl = new FormControl<number | null>(new Date().getMonth() + 1);
  yearControl = new FormControl<number | null>(new Date().getFullYear());
  categoryControl = new FormControl<number | null>(null);

  get totalAmount(): number {
    return this.expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  }

  constructor(
    private expenseService: ExpenseService,
    private categoryService: CategoryService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    const currentYear = new Date().getFullYear();
    for (let y = currentYear; y >= currentYear - 5; y--) this.years.push(y);
  }

  ngOnInit(): void {
    this.categoryService.getAll().subscribe(cats => this.categories = cats);
    this.load();
  }

  load(): void {
    this.expenseService.getAll({
      month: this.monthControl.value ?? undefined,
      year: this.yearControl.value ?? undefined,
      categoryId: this.categoryControl.value ?? undefined
    }).subscribe(data => this.expenses = data);
  }

  clearFilters(): void {
    this.monthControl.setValue(null);
    this.yearControl.setValue(null);
    this.categoryControl.setValue(null);
    this.load();
  }

  openForm(expense?: Expense): void {
    const ref = this.dialog.open(ExpenseFormDialogComponent, {
      width: '500px',
      data: expense ?? null
    });

    ref.afterClosed().subscribe(result => {
      if (!result) return;
      if (expense) {
        this.expenseService.update(expense.id, result).subscribe(() => {
          this.snackBar.open('Expense updated', 'Close', { duration: 3000 });
          this.load();
        });
      } else {
        this.expenseService.create(result).subscribe(() => {
          this.snackBar.open('Expense added', 'Close', { duration: 3000 });
          this.load();
        });
      }
    });
  }

  delete(expense: Expense): void {
    if (!confirm(`Delete "${expense.title}"?`)) return;
    this.expenseService.delete(expense.id).subscribe(() => {
      this.snackBar.open('Expense deleted', 'Close', { duration: 3000 });
      this.load();
    });
  }

  getCategoryColor(expense: Expense): string {
    return expense.categoryColor ?? '#9e9e9e';
  }
}
