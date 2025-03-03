import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FoodService {
  private apiUrl = 'http://localhost:3000/api/foods';
  
  constructor(private http: HttpClient) { }
  
  getAllFoods(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  
  getFoodById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
  
  addFood(food: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, food);
  }
  
  updateFood(id: number, food: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, food);
  }
  
  deleteFood(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}