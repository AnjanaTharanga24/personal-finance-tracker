import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { CategoryService, Category } from '../../../core/services/category.service';
import { Expense } from '../../../core/services/expense.service';

@Component({
  selector: 'app-expense-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule
  ],
  templateUrl: './expense-form-dialog.component.html'
})
export class ExpenseFormDialogComponent implements OnInit {

  form: FormGroup;
  categories: Category[] = [];
  isEdit: boolean;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ExpenseFormDialogComponent>,
    private categoryService: CategoryService,
    @Inject(MAT_DIALOG_DATA) public data: Expense | null
  ) {
    this.isEdit = !!data;
    this.form = this.fb.group({
      title: [data?.title ?? '', Validators.required],
      amount: [data?.amount ?? '', [Validators.required, Validators.min(0.01)]],
      date: [data?.date ? new Date(data.date) : new Date(), Validators.required],
      notes: [data?.notes ?? ''],
      categoryId: [data?.categoryId ?? null]
    });
  }

  ngOnInit(): void {
    this.categoryService.getAll().subscribe(cats => this.categories = cats);
  }

  save(): void {
    if (this.form.invalid) return;
    const value = this.form.value;
    const date = value.date instanceof Date
      ? value.date.toISOString().split('T')[0]
      : value.date;
    this.dialogRef.close({ ...value, date });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
