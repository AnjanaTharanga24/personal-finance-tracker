import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { Income } from '../../../core/services/income.service';

@Component({
  selector: 'app-income-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule
  ],
  templateUrl: './income-form-dialog.component.html'
})
export class IncomeFormDialogComponent {

  form: FormGroup;
  isEdit: boolean;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<IncomeFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Income | null
  ) {
    this.isEdit = !!data;
    this.form = this.fb.group({
      source: [data?.source ?? '', Validators.required],
      amount: [data?.amount ?? '', [Validators.required, Validators.min(0.01)]],
      date: [data?.date ? new Date(data.date) : new Date(), Validators.required],
      notes: [data?.notes ?? '']
    });
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
