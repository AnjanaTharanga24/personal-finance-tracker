import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  template: `
    <h1 style="margin: 0 0 24px 0; font-size: 24px; font-weight: 500;">
      Welcome back, {{ username }}!
    </h1>
    <mat-card style="padding: 32px; text-align: center; color: #9e9e9e;">
      <mat-icon style="font-size: 64px; width: 64px; height: 64px;">bar_chart</mat-icon>
      <p style="font-size: 18px;">Dashboard charts coming in Phase 5</p>
      <p>Use the sidebar to manage your expenses and categories.</p>
    </mat-card>
  `
})
export class DashboardComponent {
  username = this.authService.getUsername();
  constructor(private authService: AuthService) {}
}
