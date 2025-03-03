import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RecipeService, Recipe } from '../recipe.service';

@Component({
  selector: 'app-recipe-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './recipe-form.component.html',
  styleUrls: ['./recipe-form.component.css']
})
export class RecipeFormComponent implements OnInit {
  recipeForm: FormGroup;
  mode: 'create' | 'edit' = 'create';
  recipeId: number | null = null;
  loading: boolean = false;
  submitting: boolean = false;
  errorMessage: string = '';
  
  mealTypes = [
    { value: 'cafe', label: 'Café da Manhã' },
    { value: 'almoco', label: 'Almoço' },
    { value: 'jantar', label: 'Jantar' },
    { value: 'lanche', label: 'Lanche' }
  ];
  
  // Unidades de medida comuns
  unitOptions = [
    'g', 'kg', 'ml', 'l', 'unidade', 'unidades', 'colher de chá', 
    'colher de sopa', 'xícara', 'pitada', 'a gosto', 'dentes', 'fatias'
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private recipeService: RecipeService
  ) {
    this.recipeForm = this.createForm();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.mode = 'edit';
        this.recipeId = +idParam;
        this.loadRecipe(this.recipeId);
      }
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      descricao: ['', [Validators.required, Validators.minLength(10)]],
      tipo_refeicao: ['cafe', Validators.required],
      tempo_preparo: [30, [Validators.required, Validators.min(1)]],
      porcoes: [2, [Validators.required, Validators.min(1)]],
      calorias_totais: [0, [Validators.required, Validators.min(0)]],
      imagem_url: ['assets/images/default-recipe.png', Validators.required],
      ingredientes: this.fb.array([this.createIngredient()]),
      modo_preparo: this.fb.array([this.createStep()])
    });
  }

  createIngredient(): FormGroup {
    return this.fb.group({
      id: [0], // Será substituído automaticamente
      nome: ['', Validators.required],
      quantidade: [1, [Validators.required, Validators.min(0.1)]],
      unidade: ['unidade', Validators.required]
    });
  }

  createStep(): FormGroup {
    return this.fb.group({
      instrucao: ['', Validators.required]
    });
  }

  get ingredientes(): FormArray {
    return this.recipeForm.get('ingredientes') as FormArray;
  }

  get modoPreparo(): FormArray {
    return this.recipeForm.get('modo_preparo') as FormArray;
  }

  addIngredient(): void {
    this.ingredientes.push(this.createIngredient());
  }

  removeIngredient(index: number): void {
    if (this.ingredientes.length > 1) {
      this.ingredientes.removeAt(index);
    }
  }

  addStep(): void {
    this.modoPreparo.push(this.createStep());
  }

  removeStep(index: number): void {
    if (this.modoPreparo.length > 1) {
      this.modoPreparo.removeAt(index);
    }
  }

  loadRecipe(id: number): void {
    this.loading = true;
    this.recipeService.getRecipeById(id).subscribe({
      next: (recipe) => {
        if (recipe) {
          // Limpar arrays existentes
          while (this.ingredientes.length !== 0) {
            this.ingredientes.removeAt(0);
          }
          
          while (this.modoPreparo.length !== 0) {
            this.modoPreparo.removeAt(0);
          }
          
          // Adicionar ingredientes do backend
          recipe.ingredientes.forEach(ingredient => {
            this.ingredientes.push(this.fb.group({
              id: [ingredient.id],
              nome: [ingredient.nome, Validators.required],
              quantidade: [ingredient.quantidade, [Validators.required, Validators.min(0.1)]],
              unidade: [ingredient.unidade, Validators.required]
            }));
          });
          
          // Adicionar passos do modo de preparo
          recipe.modo_preparo.forEach(step => {
            this.modoPreparo.push(this.fb.group({
              instrucao: [step, Validators.required]
            }));
          });
          
          // Preencher o formulário com os dados da receita
          this.recipeForm.patchValue({
            nome: recipe.nome,
            descricao: recipe.descricao,
            tipo_refeicao: recipe.tipo_refeicao,
            tempo_preparo: recipe.tempo_preparo,
            porcoes: recipe.porcoes,
            calorias_totais: recipe.calorias_totais,
            imagem_url: recipe.imagem_url
          });
          
          this.loading = false;
        } else {
          this.errorMessage = 'Receita não encontrada';
          this.loading = false;
        }
      },
      error: (err) => {
        this.errorMessage = 'Erro ao carregar receita';
        this.loading = false;
        console.error(err);
      }
    });
  }

  onSubmit(): void {
    if (this.recipeForm.valid) {
      this.submitting = true;
      
      // Extrair passos do modo de preparo
      const steps = this.modoPreparo.controls.map(control => 
        control.get('instrucao')?.value
      );
      
      // Preparar dados da receita
      const recipeData = {
        ...this.recipeForm.value,
        modo_preparo: steps
      };
      
      if (this.mode === 'create') {
        this.recipeService.addRecipe(recipeData).subscribe({
          next: (recipe) => {
            this.submitting = false;
            this.router.navigate(['/recipes', recipe.id]);
          },
          error: (err) => {
            this.errorMessage = 'Erro ao salvar receita';
            this.submitting = false;
            console.error(err);
          }
        });
      } else if (this.mode === 'edit' && this.recipeId) {
        this.recipeService.updateRecipe(this.recipeId, recipeData).subscribe({
          next: (recipe) => {
            if (recipe) {
              this.submitting = false;
              this.router.navigate(['/recipes', recipe.id]);
            } else {
              this.errorMessage = 'Receita não encontrada';
              this.submitting = false;
            }
          },
          error: (err) => {
            this.errorMessage = 'Erro ao atualizar receita';
            this.submitting = false;
            console.error(err);
          }
        });
      }
    } else {
      // Marcar todos os campos como touched para mostrar validações
      this.markFormGroupTouched(this.recipeForm);
    }
  }
  
  // Função auxiliar para marcar todos os campos como touched
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
      
      if (control instanceof FormArray) {
        control.controls.forEach(c => {
          if (c instanceof FormGroup) {
            this.markFormGroupTouched(c);
          } else {
            c.markAsTouched();
          }
        });
      }
    });
  }

  cancel(): void {
    if (this.mode === 'edit' && this.recipeId) {
      this.router.navigate(['/recipes', this.recipeId]);
    } else {
      this.router.navigate(['/recipes']);
    }
  }
}