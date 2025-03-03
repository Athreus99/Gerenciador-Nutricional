import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PlannerService, PlannedMeal, ShoppingItem } from '../planner.service';
import { RecipeService, Recipe } from '../../recipes/recipe.service';
@Component({
  selector: 'app-planner',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './planner.component.html',
  styleUrls: ['./planner.component.css']
})
export class PlannerComponent implements OnInit {
  plannerForm: FormGroup;
  recipes: Recipe[] = [];
  mealPlan: PlannedMeal[] = [];
  shoppingList: ShoppingItem[] = [];
  
  startDate: string;
  endDate: string;
  weekDays: any[] = [];
  showShoppingList: boolean = false;
  generatingList: boolean = false;
  
  mealTypes = [
    { value: 'cafe', label: 'Café da Manhã' },
    { value: 'almoco', label: 'Almoço' },
    { value: 'jantar', label: 'Jantar' },
    { value: 'lanche', label: 'Lanche' }
  ];

  constructor(
    private fb: FormBuilder,
    private plannerService: PlannerService,
    private recipeService: RecipeService
  ) {
    // Inicializar datas (semana atual)
    const today = new Date();
    this.startDate = this.formatDate(today);
    
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 6);
    this.endDate = this.formatDate(nextWeek);
    
    this.generateWeekDays();
    
    this.plannerForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadRecipes();
    this.loadMealPlan();
    
    // Inscrever-se nas atualizações da lista de compras
    this.plannerService.shoppingList$.subscribe(list => {
      this.shoppingList = list;
    });
  }
  
  formatDate(date: Date): string {
    return date.toISOString().slice(0, 10);
  }
  
  createForm(): FormGroup {
    return this.fb.group({
      data: [this.startDate, Validators.required],
      tipo_refeicao: ['cafe', Validators.required],
      receita_id: [null, Validators.required]
    });
  }
  
  generateWeekDays(): void {
    this.weekDays = [];
    const start = new Date(this.startDate);
    const end = new Date(this.endDate);
    
    // Array com nomes dos dias da semana em português
    const weekdayNames = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
    
    // Gerar array de dias da semana
    const currentDate = new Date(start);
    while (currentDate <= end) {
      this.weekDays.push({
        date: this.formatDate(currentDate),
        name: weekdayNames[currentDate.getDay()],
        displayDate: `${currentDate.getDate()}/${currentDate.getMonth() + 1}`
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }
  
  loadRecipes(): void {
    this.recipeService.getRecipes().subscribe(recipes => {
      this.recipes = recipes;
    });
  }
  
  loadMealPlan(): void {
    this.plannerService.getMealPlan(this.startDate, this.endDate).subscribe(plan => {
      this.mealPlan = plan;
    });
  }
  
  onDateRangeChange(): void {
    // Verificar se a data final é posterior à inicial
    if (new Date(this.endDate) < new Date(this.startDate)) {
      this.endDate = this.startDate;
    }
    
    this.generateWeekDays();
    this.loadMealPlan();
  }
  
  onSubmit(): void {
    if (this.plannerForm.valid) {
      this.plannerService.addMealToPlan(this.plannerForm.value).subscribe(() => {
        this.loadMealPlan();
        this.plannerForm.patchValue({
          receita_id: null
        });
      });
    }
  }
  
  removePlannedMeal(id: number): void {
    if (confirm('Tem certeza que deseja remover esta refeição do plano?')) {
      this.plannerService.removePlannedMeal(id).subscribe(() => {
        this.loadMealPlan();
      });
    }
  }
  
  toggleShoppingList(): void {
    this.showShoppingList = !this.showShoppingList;
  }
  
  generateShoppingList(): void {
    this.generatingList = true;
    this.plannerService.generateShoppingList().subscribe({
      next: (list) => {
        this.shoppingList = list;
        this.generatingList = false;
        this.showShoppingList = true;
      },
      error: () => {
        this.generatingList = false;
        alert('Erro ao gerar lista de compras');
      }
    });
  }
  
  updateShoppingItem(item: ShoppingItem, bought: boolean): void {
    item.comprado = bought;
    this.plannerService.updateShoppingItem(item.id, bought).subscribe();
  }
  
  clearShoppingList(): void {
    if (confirm('Tem certeza que deseja limpar a lista de compras?')) {
      this.plannerService.clearShoppingList().subscribe(() => {
        this.shoppingList = [];
      });
    }
  }
  
  getPlannedMeals(date: string, mealType: string): PlannedMeal[] {
    return this.mealPlan.filter(
      meal => meal.data === date && meal.tipo_refeicao === mealType
    );
  }
  
  getRecipeName(recipeId: number): string {
    const recipe = this.recipes.find(r => r.id === recipeId);
    return recipe ? recipe.nome : 'Receita desconhecida';
  }
  
  getMealTypeLabel(type: string): string {
    const mealType = this.mealTypes.find(m => m.value === type);
    return mealType ? mealType.label : type;
  }

  onShoppingItemChange(item: ShoppingItem, event: Event): void {
    const target = event.target as HTMLInputElement;
    this.updateShoppingItem(item, target.checked);
  }
}
