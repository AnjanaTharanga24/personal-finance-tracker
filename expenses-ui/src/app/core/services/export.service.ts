import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ExportService {

  constructor(private http: HttpClient) {}

  downloadCsv(type: 'expenses' | 'incomes', month: number, year: number): void {
    const params = new HttpParams().set('month', month).set('year', year);

    this.http.get(`${environment.apiUrl}/export/${type}`, {
      params,
      responseType: 'blob',
      observe: 'response'
    }).subscribe(response => {
      const blob = response.body!;
      const disposition = response.headers.get('Content-Disposition') ?? '';
      const match = disposition.match(/filename="?([^"]+)"?/);
      const filename = match ? match[1] : `${type}_${year}_${String(month).padStart(2, '0')}.csv`;

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    });
  }
}
