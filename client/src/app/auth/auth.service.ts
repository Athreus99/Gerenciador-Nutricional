import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

// Definindo interfaces para tipar nossos dados
interface AuthResponse {
  token: string;
  userId: string;
  message: string;
}

interface User {
  nome: string;
  email: string;
  senha: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://gerenciador-nutricional.onrender.com';
  
  constructor(private http: HttpClient) { }
  
  register(user: User): Observable<{message: string}> {
    return this.http.post<{message: string}>(`${this.apiUrl}/register`, user);
  }
  
  login(credentials: {email: string, senha: string}): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          localStorage.setItem('token', response.token);
          localStorage.setItem('userId', response.userId);
        })
      );
  }
  
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  }
  
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
  
  getCurrentUserId(): string | null {
    return localStorage.getItem('userId');
  }
}
