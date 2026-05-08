import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CategoryExpense {
  categoryName: string;
  categoryColor: string;
  total: number;
}

export interface MonthlyData {
  month: number;
  year: number;
  totalExpenses: number;
  totalIncome: number;
}

export interface RecentExpense {
  title: string;
  amount: number;
  date: string;
  categoryName: string;
  categoryColor: string;
}

export interface DashboardSummary {
  totalExpenses: number;
  totalIncome: number;
  netSavings: number;
  totalBudgets: number;
  overBudgetCount: number;
  expensesByCategory: CategoryExpense[];
  monthlyTrend: MonthlyData[];
  recentExpenses: RecentExpense[];
}

export interface CategoryRow {
  categoryName: string;
  categoryColor: string;
  categoryIcon: string;
  amount: number;
  percentage: number;
  budgetAmount: number | null;
  spentVsBudget: number | null;
  status: string;
}

export interface TrendRow {
  month: number;
  year: number;
  monthLabel: string;
  totalExpenses: number;
  totalIncome: number;
  savings: number;
}

export interface MonthlyReport {
  month: number;
  year: number;
  totalExpenses: number;
  totalIncome: number;
  netSavings: number;
  categoryBreakdown: CategoryRow[];
  trend: TrendRow[];
}

@Injectable({ providedIn: 'root' })
export class ReportService {
  constructor(private http: HttpClient) {}

  getSummary(month: number, year: number): Observable<DashboardSummary> {
    const params = new HttpParams().set('month', month).set('year', year);
    return this.http.get<DashboardSummary>(`${environment.apiUrl}/reports/summary`, { params });
  }

  getMonthlyReport(month: number, year: number): Observable<MonthlyReport> {
    const params = new HttpParams().set('month', month).set('year', year);
    return this.http.get<MonthlyReport>(`${environment.apiUrl}/reports/monthly`, { params });
  }
}
