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
import { Income, IncomeService } from '../../core/services/income.service';
import { IncomeFormDialogComponent } from './income-form-dialog/income-form-dialog.component';

@Component({
  selector: 'app-incomes',
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
    MatTooltipModule
  ],
  templateUrl: './incomes.component.html',
  styleUrl: './incomes.component.scss'
})
export class IncomesComponent implements OnInit {

  incomes: Income[] = [];
  displayedColumns = ['date', 'source', 'notes', 'amount', 'actions'];

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

  get totalAmount(): number {
    return this.incomes.reduce((sum, i) => sum + Number(i.amount), 0);
  }

  constructor(
    private incomeService: IncomeService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    const currentYear = new Date().getFullYear();
    for (let y = currentYear; y >= currentYear - 5; y--) this.years.push(y);
  }

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.incomeService.getAll(
      this.monthControl.value ?? undefined,
      this.yearControl.value ?? undefined
    ).subscribe(data => this.incomes = data);
  }

  clearFilters(): void {
    this.monthControl.setValue(null);
    this.yearControl.setValue(null);
    this.load();
  }

  openForm(income?: Income): void {
    const ref = this.dialog.open(IncomeFormDialogComponent, {
      width: '480px',
      data: income ?? null
    });

    ref.afterClosed().subscribe(result => {
      if (!result) return;
      if (income) {
        this.incomeService.update(income.id, result).subscribe(() => {
          this.snackBar.open('Income updated', 'Close', { duration: 3000 });
          this.load();
        });
      } else {
        this.incomeService.create(result).subscribe(() => {
          this.snackBar.open('Income added', 'Close', { duration: 3000 });
          this.load();
        });
      }
    });
  }

  delete(income: Income): void {
    if (!confirm(`Delete income from "${income.source}"?`)) return;
    this.incomeService.delete(income.id).subscribe(() => {
      this.snackBar.open('Income deleted', 'Close', { duration: 3000 });
      this.load();
    });
  }
}
