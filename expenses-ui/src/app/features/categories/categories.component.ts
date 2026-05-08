import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Category, CategoryService } from '../../core/services/category.service';
import { CategoryFormDialogComponent } from './category-form-dialog/category-form-dialog.component';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatTooltipModule
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit {

  categories: Category[] = [];

  constructor(
    private categoryService: CategoryService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.categoryService.getAll().subscribe(data => this.categories = data);
  }

  openForm(category?: Category): void {
    const ref = this.dialog.open(CategoryFormDialogComponent, {
      width: '400px',
      data: category ?? null
    });

    ref.afterClosed().subscribe(result => {
      if (!result) return;
      if (category) {
        this.categoryService.update(category.id, result).subscribe(() => {
          this.snackBar.open('Category updated', 'Close', { duration: 3000 });
          this.load();
        });
      } else {
        this.categoryService.create(result).subscribe(() => {
          this.snackBar.open('Category created', 'Close', { duration: 3000 });
          this.load();
        });
      }
    });
  }

  delete(category: Category): void {
    if (!confirm(`Delete "${category.name}"?`)) return;
    this.categoryService.delete(category.id).subscribe({
      next: () => {
        this.snackBar.open('Category deleted', 'Close', { duration: 3000 });
        this.load();
      },
      error: () => this.snackBar.open('Cannot delete — category in use', 'Close', { duration: 3000 })
    });
  }
}
