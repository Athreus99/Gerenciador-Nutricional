import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

// Interfaces para tipagem
export interface LoginCredentials {
  email: string;
  senha: string;
}

export interface RegisterData {
  nome: string;
  email: string;
  senha: string;
}

export interface AuthResponse {
  message: string;
  token?: string;
  userId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // URL do backend no Render - URL ATUALIZADA CORRETA
  private apiUrl = 'https://gerenciador-nutricional.onrender.com/api/auth';
  
  constructor(private http: HttpClient) { }
  
  // Método de registro - ENDPOINT CORRETO
  register(user: RegisterData): Observable<AuthResponse> {
    console.log('Registrando usuário no endpoint:', `${this.apiUrl}/register`);
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, user)
      .pipe(
        catchError(this.handleError)
      );
  }
  
  // Método de login - ENDPOINT CORRETO
  login(credentials: LoginCredentials): Observable<AuthResponse> {
    console.log('Tentando login no endpoint:', `${this.apiUrl}/login`);
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          console.log('Resposta do login:', response);
          if (response.token) {
            localStorage.setItem('token', response.token);
          }
          if (response.userId) {
            localStorage.setItem('userId', response.userId);
          }
        }),
        catchError(this.handleError)
      );
  }
  
  // Método de logout
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  }
  
  // Verifica se o usuário está logado
  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }
  
  // Obtém o ID do usuário atual
  getCurrentUserId(): string | null {
    return localStorage.getItem('userId');
  }
  
  // Obtém o token JWT para requisições autenticadas
  getToken(): string | null {
    return localStorage.getItem('token');
  }
  
  // Tratamento de erros de HTTP
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Erro na requisição HTTP:', error);
    
    let errorMessage = 'Ocorreu um erro ao processar a requisição';
    
    if (error.error instanceof ErrorEvent) {
      // Erro do lado do cliente
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      // Erro retornado pelo backend
      if (error.status === 401) {
        errorMessage = 'Credenciais inválidas';
      } else if (error.status === 400) {
        errorMessage = error.error?.message || 'Dados inválidos';
      } else if (error.status === 404) {
        errorMessage = 'Endpoint não encontrado. Verifique a URL da API.';
      } else if (error.status === 500) {
        errorMessage = 'Erro interno do servidor';
      }
    }
    
    // Retorna um erro Observable para o componente
    return throwError(() => new Error(errorMessage));
  }
}
