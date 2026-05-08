import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent implements OnInit {

  @ViewChild('sidenav') sidenav!: MatSidenav;

  isHandset = false;
  sidenavOpened = true;

  navItems = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Expenses', icon: 'receipt_long', route: '/expenses' },
    { label: 'Income', icon: 'account_balance_wallet', route: '/incomes' },
    { label: 'Budgets', icon: 'savings', route: '/budgets' },
    { label: 'Reports', icon: 'bar_chart', route: '/reports' },
    { label: 'Categories', icon: 'category', route: '/categories' }
  ];

  constructor(
    public authService: AuthService,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit(): void {
    this.breakpointObserver.observe([Breakpoints.Handset, '(max-width: 768px)'])
      .subscribe(result => {
        this.isHandset = result.matches;
        this.sidenavOpened = !result.matches;
      });
  }

  toggleSidenav(): void {
    this.sidenav.toggle();
    this.sidenavOpened = this.sidenav.opened;
  }

  onNavItemClick(): void {
    if (this.isHandset) {
      this.sidenav.close();
      this.sidenavOpened = false;
    }
  }

  logout(): void {
    this.authService.logout();
  }
}
