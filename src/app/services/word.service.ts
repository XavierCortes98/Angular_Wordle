import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WordService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getWord(): Observable<string> {
    return this.http.get<string>(this.apiUrl + '/getWord');
  }

  checkWord(word: string): Observable<boolean> {
    return this.http.post<boolean>(this.apiUrl + '/checkWord', { word });
  }
}
