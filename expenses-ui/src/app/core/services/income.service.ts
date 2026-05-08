import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Income {
  id: number;
  source: string;
  amount: number;
  date: string;
  notes: string;
  createdAt: string;
}

export interface IncomeRequest {
  source: string;
  amount: number;
  date: string;
  notes?: string;
}

@Injectable({ providedIn: 'root' })
export class IncomeService {

  private url = `${environment.apiUrl}/incomes`;

  constructor(private http: HttpClient) {}

  getAll(month?: number, year?: number): Observable<Income[]> {
    let params = new HttpParams();
    if (month) params = params.set('month', month);
    if (year) params = params.set('year', year);
    return this.http.get<Income[]>(this.url, { params });
  }

  create(request: IncomeRequest): Observable<Income> {
    return this.http.post<Income>(this.url, request);
  }

  update(id: number, request: IncomeRequest): Observable<Income> {
    return this.http.put<Income>(`${this.url}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
