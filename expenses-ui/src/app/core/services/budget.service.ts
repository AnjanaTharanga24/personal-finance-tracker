import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Budget {
  id: number;
  categoryId: number;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  amount: number;
  spentAmount: number;
  remainingAmount: number;
  percentage: number;
  month: number;
  year: number;
}

export interface BudgetRequest {
  categoryId: number;
  amount: number;
  month: number;
  year: number;
}

@Injectable({ providedIn: 'root' })
export class BudgetService {

  private url = `${environment.apiUrl}/budgets`;

  constructor(private http: HttpClient) {}

  getByMonthAndYear(month: number, year: number): Observable<Budget[]> {
    const params = new HttpParams().set('month', month).set('year', year);
    return this.http.get<Budget[]>(this.url, { params });
  }

  create(request: BudgetRequest): Observable<Budget> {
    return this.http.post<Budget>(this.url, request);
  }

  update(id: number, request: BudgetRequest): Observable<Budget> {
    return this.http.put<Budget>(`${this.url}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
