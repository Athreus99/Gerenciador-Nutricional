import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RecipeService, Recipe } from '../recipe.service';

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe | undefined;
  recipeId: number = 0;
  loading: boolean = true;
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private recipeService: RecipeService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        this.recipeId = +idParam;
        this.loadRecipe();
      } else {
        this.error = 'ID da receita não fornecido';
        this.loading = false;
      }
    });
  }

  loadRecipe(): void {
    this.loading = true;
    this.recipeService.getRecipeById(this.recipeId).subscribe({
      next: (recipe) => {
        if (recipe) {
          this.recipe = recipe;
          this.loading = false;
        } else {
          this.error = 'Receita não encontrada';
          this.loading = false;
        }
      },
      error: (err) => {
        this.error = 'Erro ao carregar a receita';
        this.loading = false;
        console.error(err);
      }
    });
  }

  getMealTypeLabel(type: string): string {
    const mealTypes: {[key: string]: string} = {
      'cafe': 'Café da Manhã',
      'almoco': 'Almoço',
      'jantar': 'Jantar',
      'lanche': 'Lanche'
    };
    
    return mealTypes[type] || type;
  }

  goBack(): void {
    this.router.navigate(['/recipes']);
  }

  getImageUrl(url: string): string {
    // Usar uma imagem padrão local se a URL for inválida ou não existir
    if (!url) {
      return 'assets/images/default-recipe.png';
    }
    return url;
  }
}
