import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth/auth.service';
import { DiaryService, DiaryEntry } from '../../diary/diary.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  username: string = '';
  todayDate: string = new Date().toLocaleDateString();
  currentDateString: string = new Date().toISOString().slice(0, 10);
  
  // Resumo nutricional dos últimos dias (dados serão substituídos)
  weeklyCalories: any[] = [];
  
  // Resumo do dia atual (dados serão substituídos)
  currentDaySummary = {
    totalCalorias: 0,
    totalProteinas: 0,
    totalCarboidratos: 0,
    totalGorduras: 0,
    metaAlcancada: 0 // porcentagem da meta diária alcançada
  };
  
  // Refeições recentes (dados serão substituídos)
  recentMeals: any[] = [];
  
  // Receitas sugeridas (dados de exemplo)
  suggestedRecipes = [
    { 
      id: 1, 
      nome: 'Omelete de Legumes', 
      calorias: 320, 
      tempo: 15,
      imagem: 'assets/images/omelete.png'
    },
    { 
      id: 2, 
      nome: 'Sanduíche Natural', 
      calorias: 280,
      tempo: 10,
      imagem: 'assets/images/sanduiche.jpg'
    },
    { 
      id: 3, 
      nome: 'Frango com Batata Doce', 
      calorias: 410, 
      tempo: 40,
      imagem: 'assets/images/frango.png'
    }
  ];

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private diaryService: DiaryService
  ) { }

  ngOnInit(): void {
    this.loadUserData();
    this.loadWeeklyData();
    this.loadTodayData();
    this.loadRecentMeals();
  }

  loadUserData(): void {
    // Simulação - em uma aplicação real, você buscaria do backend
    this.username = 'Usuário';
  }

  loadWeeklyData(): void {
    // Gerar dados para os últimos 7 dias
    const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    this.weeklyCalories = [];
    
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const dateString = date.toISOString().slice(0, 10);
      
      // Obter dados reais do serviço de diário
      const daySummary = this.diaryService.calculateDailySummary(dateString);
      
      this.weeklyCalories.push({
        day: days[date.getDay()],
        value: daySummary.totalCalorias || 0
      });
    }
  }

  loadTodayData(): void {
    // Obter dados reais do serviço de diário
    const todaySummary = this.diaryService.calculateDailySummary(this.currentDateString);
    
    this.currentDaySummary = {
      ...todaySummary,
      metaAlcancada: Math.min(Math.round((todaySummary.totalCalorias / 2000) * 100), 100) // Considerando 2000 kcal como meta
    };
  }

  loadRecentMeals(): void {
    // Obter refeições recentes do serviço de diário
    const recentEntries = this.diaryService.getRecentEntries(10);
    
    // Agrupar entradas por data e tipo de refeição
    const groupedEntries: {[key: string]: DiaryEntry[]} = {};
    
    recentEntries.forEach(entry => {
      const key = `${entry.data}-${entry.tipo_refeicao}`;
      if (!groupedEntries[key]) {
        groupedEntries[key] = [];
      }
      groupedEntries[key].push(entry);
    });
    
    // Converter grupos em refeições
    this.recentMeals = Object.keys(groupedEntries).map(key => {
      const entries = groupedEntries[key];
      const [date, mealType] = key.split('-');
      
      // Obter nome da refeição
      let mealName = 'Refeição';
      switch (mealType) {
        case 'cafe': mealName = 'Café da Manhã'; break;
        case 'almoco': mealName = 'Almoço'; break;
        case 'jantar': mealName = 'Jantar'; break;
        case 'lanche': mealName = 'Lanche'; break;
      }
      
      return {
        id: date + mealType,
        nome: mealName,
        data: this.formatDate(date),
        itens: entries.map(e => e.alimento_nome),
        calorias: entries.reduce((sum, e) => sum + e.calorias, 0)
      };
    }).slice(0, 3); // Limitar a 3 refeições
  }
  
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  }

  getWeekdayClass(value: number): string {
    // Retorna uma classe CSS baseada no valor calórico
    if (value > 2200) return 'high-calories';
    if (value > 1900) return 'medium-calories';
    return 'good-calories';
  }

  getMetaClass(): string {
    // Retorna uma classe CSS baseada na meta alcançada
    if (this.currentDaySummary.metaAlcancada > 90) return 'meta-boa';
    if (this.currentDaySummary.metaAlcancada > 70) return 'meta-media';
    return 'meta-baixa';
  }
}