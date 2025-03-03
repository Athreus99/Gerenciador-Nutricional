// src/app/diary/diary/diary.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth/auth.service';
import { DiaryService, DiaryEntry } from '../diary.service';
import { RecipeService, Recipe } from '../../recipes/recipe.service';

@Component({
  selector: 'app-diary',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './diary.component.html',
  styleUrls: ['./diary.component.css']
})
export class DiaryComponent implements OnInit {
  diaryForm: FormGroup;
  diaryEntries: DiaryEntry[] = [];
  foods: any[] = [];
  recipes: Recipe[] = []; // Nova propriedade para armazenar as receitas
  selectedDate: string;
  dailySummary = {
    totalCalorias: 0,
    totalProteinas: 0,
    totalCarboidratos: 0,
    totalGorduras: 0
  };

  mealTypes = [
    { value: 'cafe', label: 'Café da Manhã' },
    { value: 'almoco', label: 'Almoço' },
    { value: 'jantar', label: 'Jantar' },
    { value: 'lanche', label: 'Lanche' }
  ];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private authService: AuthService,
    private diaryService: DiaryService,
    private recipeService: RecipeService // Injetar o serviço de receitas
  ) {
    this.selectedDate = new Date().toISOString().slice(0, 10);
    this.diaryForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadFoods();
    this.loadRecipes(); // Carregar receitas
    this.loadDiaryEntries();
  }

  createForm(): FormGroup {
    return this.fb.group({
      tipo_refeicao: ['cafe', Validators.required],
      item_tipo: ['alimento'], // 'alimento' ou 'receita'
      alimento_id: [null],
      receita_id: [null], // Novo campo para receitas
      quantidade: [1, [Validators.required, Validators.min(0.1)]],
      data: [this.selectedDate, Validators.required]
    });
  }

  loadFoods(): void {
    // Dados de exemplo com informações nutricionais
    this.foods = [
      { id: 1, nome: 'Maçã', calorias: 52, proteinas: 0.3, carboidratos: 14, gorduras: 0.2, porcao: '100g' },
      { id: 2, nome: 'Banana', calorias: 89, proteinas: 1.1, carboidratos: 23, gorduras: 0.3, porcao: '100g' },
      { id: 3, nome: 'Arroz', calorias: 130, proteinas: 2.7, carboidratos: 28, gorduras: 0.3, porcao: '100g' },
      { id: 4, nome: 'Feijão', calorias: 127, proteinas: 8.7, carboidratos: 22, gorduras: 0.5, porcao: '100g' },
      { id: 5, nome: 'Frango', calorias: 165, proteinas: 31, carboidratos: 0, gorduras: 3.6, porcao: '100g' }
    ];
  }

  // Método para carregar receitas
  loadRecipes(): void {
    this.recipeService.getRecipes().subscribe({
      next: (recipes) => {
        this.recipes = recipes;
      },
      error: (err) => {
        console.error('Erro ao carregar receitas:', err);
      }
    });
  }

  loadDiaryEntries(): void {
    // Carregar apenas as entradas para a data selecionada
    this.diaryEntries = this.diaryService.getEntriesByDate(this.selectedDate);
    this.updateSummary();
  }

  onDateChange(event: any): void {
    this.selectedDate = event.target.value;
    this.diaryForm.patchValue({ data: this.selectedDate });
    this.loadDiaryEntries();
  }

  // Evento quando o tipo de item muda (alimento ou receita)
  onItemTypeChange(itemType: string): void {
    // Limpar os campos de seleção
    if (itemType === 'alimento') {
      this.diaryForm.patchValue({ receita_id: null });
    } else {
      this.diaryForm.patchValue({ alimento_id: null });
    }
  }

  onSubmit(): void {
    if (this.diaryForm.valid) {
      const formValues = this.diaryForm.value;
      const itemTipo = formValues.item_tipo;
      let newEntry: DiaryEntry;

      if (itemTipo === 'alimento' && formValues.alimento_id) {
        // Adicionar alimento individual
        const selectedFood = this.foods.find(f => f.id === parseInt(formValues.alimento_id));
        
        if (selectedFood) {
          const quantity = formValues.quantidade;
          
          newEntry = {
            id: Date.now(), // Usar timestamp como ID único
            tipo_refeicao: formValues.tipo_refeicao,
            alimento_id: selectedFood.id,
            receita_id: null,
            alimento_nome: selectedFood.nome,
            quantidade: quantity,
            calorias: selectedFood.calorias * quantity,
            proteinas: selectedFood.proteinas * quantity,
            carboidratos: selectedFood.carboidratos * quantity,
            gorduras: selectedFood.gorduras * quantity,
            data: formValues.data
          };
          
          // Adicionar ao serviço compartilhado
          this.diaryService.addEntry(newEntry);
        }
      } else if (itemTipo === 'receita' && formValues.receita_id) {
        // Adicionar receita
        const selectedRecipe = this.recipes.find(r => r.id === parseInt(formValues.receita_id));
        
        if (selectedRecipe) {
          const quantity = formValues.quantidade;
          
          // Calcular valores nutricionais da receita completa
          // Notas: 
          // 1. Idealmente, faríamos um cálculo mais preciso considerando cada ingrediente
          // 2. Estamos simplificando usando os valores totais da receita
          newEntry = {
            id: Date.now(),
            tipo_refeicao: formValues.tipo_refeicao,
            alimento_id: null,
            receita_id: selectedRecipe.id,
            alimento_nome: selectedRecipe.nome, // Usamos o nome da receita
            quantidade: quantity,
            calorias: selectedRecipe.calorias_totais * quantity,
            proteinas: 0, // Você pode calcular isso se tiver os dados
            carboidratos: 0, // Você pode calcular isso se tiver os dados
            gorduras: 0, // Você pode calcular isso se tiver os dados
            data: formValues.data
          };
          
          // Adicionar ao serviço compartilhado
          this.diaryService.addEntry(newEntry);
        }
      }
      
      // Recarregar entradas para a data selecionada
      this.loadDiaryEntries();
      
      // Reiniciar campos do formulário mas manter refeição
      this.diaryForm.patchValue({
        alimento_id: null,
        receita_id: null,
        quantidade: 1
      });
    }
  }

  deleteEntry(id: number): void {
    this.diaryService.deleteEntry(id);
    this.loadDiaryEntries();
  }

  updateSummary(): void {
    this.dailySummary = this.diaryService.calculateDailySummary(this.selectedDate);
  }
  
  getEntriesByMealType(mealType: string): DiaryEntry[] {
    return this.diaryEntries.filter(entry => entry.tipo_refeicao === mealType);
  }
  
  hasMealTypeEntries(mealType: string): boolean {
    return this.getEntriesByMealType(mealType).length > 0;
  }
  
  // Método para determinar se um item no diário é uma receita
  isRecipe(entry: DiaryEntry): boolean {
    return entry.receita_id !== null;
  }
}