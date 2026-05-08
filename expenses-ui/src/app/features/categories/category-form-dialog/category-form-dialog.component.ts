import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { Category } from '../../../core/services/category.service';

export const MATERIAL_ICONS = [
  'restaurant', 'directions_car', 'receipt', 'shopping_bag',
  'local_hospital', 'movie', 'school', 'category', 'home',
  'flight', 'fitness_center', 'pets', 'sports_esports', 'coffee'
];

export const COLORS = [
  '#FF7043', '#42A5F5', '#AB47BC', '#EC407A',
  '#26A69A', '#FFA726', '#5C6BC0', '#78909C',
  '#EF5350', '#66BB6A', '#FF7043', '#26C6DA'
];

@Component({
  selector: 'app-category-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './category-form-dialog.component.html'
})
export class CategoryFormDialogComponent {

  form: FormGroup;
  icons = MATERIAL_ICONS;
  colors = COLORS;
  isEdit: boolean;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CategoryFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Category | null
  ) {
    this.isEdit = !!data;
    this.form = this.fb.group({
      name: [data?.name ?? '', Validators.required],
      icon: [data?.icon ?? 'category'],
      color: [data?.color ?? '#78909C']
    });
  }

  save(): void {
    if (this.form.invalid) return;
    this.dialogRef.close(this.form.value);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
