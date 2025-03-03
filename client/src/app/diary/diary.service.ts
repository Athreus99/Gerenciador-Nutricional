import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

// src/app/diary/diary.service.ts
export interface DiaryEntry {
  id: number;
  tipo_refeicao: string;
  alimento_id: number | null;  // Pode ser nulo se for uma receita
  receita_id: number | null;   // Pode ser nulo se for um alimento
  alimento_nome: string;       // Nome do alimento ou receita
  quantidade: number;
  calorias: number;
  proteinas: number;
  carboidratos: number;
  gorduras: number;
  data: string;
}

@Injectable({
  providedIn: 'root'
})
export class DiaryService {
  private diaryEntriesSubject = new BehaviorSubject<DiaryEntry[]>([]);
  diaryEntries$ = this.diaryEntriesSubject.asObservable();

  constructor() {
    // Carregar entradas salvas no localStorage, se existirem
    const savedEntries = localStorage.getItem('diaryEntries');
    if (savedEntries) {
      this.diaryEntriesSubject.next(JSON.parse(savedEntries));
    }
  }

  getAllEntries(): DiaryEntry[] {
    return this.diaryEntriesSubject.value;
  }

  getEntriesByDate(date: string): DiaryEntry[] {
    return this.diaryEntriesSubject.value.filter(entry => entry.data === date);
  }

  getRecentEntries(limit: number = 5): DiaryEntry[] {
    // Ordenar por data (mais recente primeiro) e pegar os primeiros 'limit' itens
    return [...this.diaryEntriesSubject.value]
      .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
      .slice(0, limit);
  }

  addEntry(entry: DiaryEntry): void {
    const currentEntries = this.diaryEntriesSubject.value;
    const updatedEntries = [...currentEntries, entry];
    this.diaryEntriesSubject.next(updatedEntries);
    
    // Salvar no localStorage para persistência
    localStorage.setItem('diaryEntries', JSON.stringify(updatedEntries));
  }

  deleteEntry(id: number): void {
    const currentEntries = this.diaryEntriesSubject.value;
    const updatedEntries = currentEntries.filter(entry => entry.id !== id);
    this.diaryEntriesSubject.next(updatedEntries);
    
    // Atualizar localStorage
    localStorage.setItem('diaryEntries', JSON.stringify(updatedEntries));
  }

  calculateDailySummary(date: string): { totalCalorias: number; totalProteinas: number; totalCarboidratos: number; totalGorduras: number } {
    const entries = this.getEntriesByDate(date);
    
    const summary = {
      totalCalorias: 0,
      totalProteinas: 0,
      totalCarboidratos: 0,
      totalGorduras: 0
    };
    
    for (const entry of entries) {
      summary.totalCalorias += entry.calorias || 0;
      summary.totalProteinas += entry.proteinas || 0;
      summary.totalCarboidratos += entry.carboidratos || 0;
      summary.totalGorduras += entry.gorduras || 0;
    }
    
    // Arredondar valores para melhor visualização
    summary.totalCalorias = Math.round(summary.totalCalorias);
    summary.totalProteinas = Math.round(summary.totalProteinas * 10) / 10;
    summary.totalCarboidratos = Math.round(summary.totalCarboidratos * 10) / 10;
    summary.totalGorduras = Math.round(summary.totalGorduras * 10) / 10;
    
    return summary;
  }
}