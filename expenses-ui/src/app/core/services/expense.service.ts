import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Expense {
  id: number;
  title: string;
  amount: number;
  date: string;
  notes: string;
  categoryId: number;
  categoryName: string;
  categoryIcon: string;
  categoryColor: string;
  createdAt: string;
}

export interface ExpenseRequest {
  title: string;
  amount: number;
  date: string;
  notes?: string;
  categoryId?: number | null;
}

export interface ExpenseFilter {
  month?: number;
  year?: number;
  categoryId?: number;
}

@Injectable({ providedIn: 'root' })
export class ExpenseService {

  private url = `${environment.apiUrl}/expenses`;

  constructor(private http: HttpClient) {}

  getAll(filter?: ExpenseFilter): Observable<Expense[]> {
    let params = new HttpParams();
    if (filter?.month) params = params.set('month', filter.month);
    if (filter?.year) params = params.set('year', filter.year);
    if (filter?.categoryId) params = params.set('categoryId', filter.categoryId);
    return this.http.get<Expense[]>(this.url, { params });
  }

  create(request: ExpenseRequest): Observable<Expense> {
    return this.http.post<Expense>(this.url, request);
  }

  update(id: number, request: ExpenseRequest): Observable<Expense> {
    return this.http.put<Expense>(`${this.url}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
