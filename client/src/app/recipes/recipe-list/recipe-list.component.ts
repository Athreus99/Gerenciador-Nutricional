import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RecipeService, Recipe } from '../recipe.service';

@Component({
  selector: 'app-recipe-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {
  recipes: Recipe[] = [];
  filteredRecipes: Recipe[] = [];
  selectedFilter: string = 'all';

  mealTypes = [
    { value: 'all', label: 'Todas as Refeições' },
    { value: 'cafe', label: 'Café da Manhã' },
    { value: 'almoco', label: 'Almoço' },
    { value: 'jantar', label: 'Jantar' },
    { value: 'lanche', label: 'Lanche' }
  ];

  constructor(private recipeService: RecipeService) { }

  ngOnInit(): void {
    this.loadRecipes();
  }

  loadRecipes(): void {
    this.recipeService.getRecipes().subscribe(recipes => {
      this.recipes = recipes;
      this.applyFilter();
    });
  }

  applyFilter(): void {
    if (this.selectedFilter === 'all') {
      this.filteredRecipes = [...this.recipes];
    } else {
      this.filteredRecipes = this.recipes.filter(recipe => recipe.tipo_refeicao === this.selectedFilter);
    }
  }

  filterRecipes(value: string): void {
    this.selectedFilter = value;
    this.applyFilter();
  }

  getMealTypeLabel(type: string): string {
    const mealType = this.mealTypes.find(m => m.value === type);
    return mealType ? mealType.label : type;
  }

  getImageUrl(url: string): string {
    // Usar uma imagem padrão local que sabemos que existe
    return url || 'assets/images/default-recipe.png';
  }
}
