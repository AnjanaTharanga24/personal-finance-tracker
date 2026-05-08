import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { CategoryService, Category } from '../../../core/services/category.service';
import { Budget } from '../../../core/services/budget.service';

@Component({
  selector: 'app-budget-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule
  ],
  templateUrl: './budget-form-dialog.component.html'
})
export class BudgetFormDialogComponent implements OnInit {

  form: FormGroup;
  categories: Category[] = [];
  isEdit: boolean;

  months = [
    { value: 1, label: 'January' }, { value: 2, label: 'February' },
    { value: 3, label: 'March' }, { value: 4, label: 'April' },
    { value: 5, label: 'May' }, { value: 6, label: 'June' },
    { value: 7, label: 'July' }, { value: 8, label: 'August' },
    { value: 9, label: 'September' }, { value: 10, label: 'October' },
    { value: 11, label: 'November' }, { value: 12, label: 'December' }
  ];

  years: number[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<BudgetFormDialogComponent>,
    private categoryService: CategoryService,
    @Inject(MAT_DIALOG_DATA) public data: { budget: Budget | null, month: number, year: number }
  ) {
    this.isEdit = !!data.budget;
    const currentYear = new Date().getFullYear();
    for (let y = currentYear + 1; y >= currentYear - 3; y--) this.years.push(y);

    this.form = this.fb.group({
      categoryId: [data.budget?.categoryId ?? null, Validators.required],
      amount: [data.budget?.amount ?? '', [Validators.required, Validators.min(0.01)]],
      month: [data.budget?.month ?? data.month, Validators.required],
      year: [data.budget?.year ?? data.year, Validators.required]
    });
  }

  ngOnInit(): void {
    this.categoryService.getAll().subscribe(cats => this.categories = cats);
  }

  save(): void {
    if (this.form.invalid) return;
    this.dialogRef.close(this.form.value);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
