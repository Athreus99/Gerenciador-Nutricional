// src/app/planner/planner.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { RecipeService, Recipe } from '../recipes/recipe.service';

export interface PlannedMeal {
  id: number;
  data: string;
  tipo_refeicao: string;
  receita_id: number;
  receita?: Recipe;
}

export interface ShoppingItem {
  id: number;
  nome: string;
  quantidade: number;
  unidade: string;
  comprado: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PlannerService {
  private plannedMeals: PlannedMeal[] = [];
  private plannedMealsSubject = new BehaviorSubject<PlannedMeal[]>([]);
  plannedMeals$ = this.plannedMealsSubject.asObservable();
  
  private shoppingList: ShoppingItem[] = [];
  private shoppingListSubject = new BehaviorSubject<ShoppingItem[]>([]);
  shoppingList$ = this.shoppingListSubject.asObservable();

  constructor(private recipeService: RecipeService) {
    // Carregar dados salvos do localStorage, se existirem
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    const savedMeals = localStorage.getItem('plannedMeals');
    const savedList = localStorage.getItem('shoppingList');
    
    if (savedMeals) {
      this.plannedMeals = JSON.parse(savedMeals);
      this.plannedMealsSubject.next(this.plannedMeals);
    }
    
    if (savedList) {
      this.shoppingList = JSON.parse(savedList);
      this.shoppingListSubject.next(this.shoppingList);
    }
  }

  private saveToStorage(): void {
    localStorage.setItem('plannedMeals', JSON.stringify(this.plannedMeals));
    localStorage.setItem('shoppingList', JSON.stringify(this.shoppingList));
  }

  getMealPlan(startDate: string, endDate: string): Observable<PlannedMeal[]> {
    // Filtrar as refeições pelo intervalo de datas
    const filteredMeals = this.plannedMeals.filter(meal => {
      return meal.data >= startDate && meal.data <= endDate;
    });
    
    // Carregar detalhes das receitas
    const mealsWithRecipes = filteredMeals.map(meal => {
      return { ...meal };
    });
    
    // Carregar detalhes das receitas (de forma assíncrona)
    for (const meal of mealsWithRecipes) {
      this.recipeService.getRecipeById(meal.receita_id).subscribe(recipe => {
        if (recipe) {
          meal.receita = recipe;
        }
      });
    }
    
    return of(mealsWithRecipes);
  }

  addMealToPlan(meal: Omit<PlannedMeal, 'id'>): Observable<PlannedMeal> {
    // Gerar ID único
    const newId = Date.now();
    
    const newMeal: PlannedMeal = {
      id: newId,
      ...meal
    };
    
    this.plannedMeals.push(newMeal);
    this.plannedMealsSubject.next(this.plannedMeals);
    this.saveToStorage();
    
    return of(newMeal);
  }

  removePlannedMeal(id: number): Observable<boolean> {
    const initialLength = this.plannedMeals.length;
    this.plannedMeals = this.plannedMeals.filter(meal => meal.id !== id);
    
    if (initialLength !== this.plannedMeals.length) {
      this.plannedMealsSubject.next(this.plannedMeals);
      this.saveToStorage();
      return of(true);
    }
    
    return of(false);
  }

  generateShoppingList(): Observable<ShoppingItem[]> {
    // Limpar lista atual
    this.shoppingList = [];
    
    // Map para agrupar ingredientes
    const ingredientsMap = new Map<string, { quantity: number, unit: string }>();
    
    // Para cada refeição planejada, adicionar ingredientes à lista
    const processPlannedMeals = this.plannedMeals.map(meal => {
      return new Promise<void>((resolve) => {
        this.recipeService.getRecipeById(meal.receita_id).subscribe(recipe => {
          if (recipe) {
            // Ajustar para o número de porções (assumindo que cada refeição é para 1 pessoa)
            const portionMultiplier = 1 / recipe.porcoes;
            
            recipe.ingredientes.forEach(ingredient => {
              const key = `${ingredient.nome.toLowerCase()}:${ingredient.unidade}`;
              const currentValue = ingredientsMap.get(key);
              
              if (currentValue) {
                ingredientsMap.set(key, {
                  quantity: currentValue.quantity + (ingredient.quantidade * portionMultiplier),
                  unit: ingredient.unidade
                });
              } else {
                ingredientsMap.set(key, {
                  quantity: ingredient.quantidade * portionMultiplier,
                  unit: ingredient.unidade
                });
              }
            });
          }
          resolve();
        });
      });
    });
    
    return new Observable(observer => {
      Promise.all(processPlannedMeals).then(() => {
        let id = 1;
        ingredientsMap.forEach((value, key) => {
          const [nome] = key.split(':');
          this.shoppingList.push({
            id: id++,
            nome: nome.charAt(0).toUpperCase() + nome.slice(1), // Capitalizar
            quantidade: Math.ceil(value.quantity * 10) / 10, // Arredondar para 1 casa decimal
            unidade: value.unit,
            comprado: false
          });
        });
        
        this.shoppingListSubject.next(this.shoppingList);
        this.saveToStorage();
        observer.next(this.shoppingList);
        observer.complete();
      });
    });
  }

  updateShoppingItem(id: number, comprado: boolean): Observable<boolean> {
    const item = this.shoppingList.find(i => i.id === id);
    if (item) {
      item.comprado = comprado;
      this.shoppingListSubject.next(this.shoppingList);
      this.saveToStorage();
      return of(true);
    }
    return of(false);
  }

  clearShoppingList(): Observable<boolean> {
    this.shoppingList = [];
    this.shoppingListSubject.next(this.shoppingList);
    this.saveToStorage();
    return of(true);
  }
}