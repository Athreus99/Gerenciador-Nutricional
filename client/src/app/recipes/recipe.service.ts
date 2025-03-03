import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

export interface Ingredient {
  id: number;
  nome: string;
  quantidade: number;
  unidade: string;
}

export interface Recipe {
  id: number;
  nome: string;
  descricao: string;
  tipo_refeicao: string;
  tempo_preparo: number;
  porcoes: number;
  calorias_totais: number;
  imagem_url: string;
  ingredientes: Ingredient[];
  modo_preparo: string[];
}

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private recipes: Recipe[] = [
    {
      id: 1,
      nome: 'Salada de Frutas',
      descricao: 'Uma deliciosa salada de frutas frescas, perfeita para café da manhã ou lanche.',
      tipo_refeicao: 'cafe',
      tempo_preparo: 15,
      porcoes: 2,
      calorias_totais: 120,
      imagem_url: 'assets/images/frutas.png',
      ingredientes: [
        { id: 1, nome: 'Maçã', quantidade: 1, unidade: 'unidade' },
        { id: 2, nome: 'Banana', quantidade: 1, unidade: 'unidade' },
        { id: 3, nome: 'Laranja', quantidade: 1, unidade: 'unidade' },
        { id: 4, nome: 'Uvas', quantidade: 100, unidade: 'g' },
        { id: 5, nome: 'Mel', quantidade: 1, unidade: 'colher de sopa' }
      ],
      modo_preparo: [
        'Lave bem todas as frutas.',
        'Descasque a maçã, banana e laranja.',
        'Corte todas as frutas em pedaços pequenos.',
        'Coloque as frutas em uma tigela grande.',
        'Adicione o mel e misture delicadamente.',
        'Sirva imediatamente ou refrigere antes de servir.'
      ]
    },
    {
      id: 2,
      nome: 'Frango Grelhado com Legumes',
      descricao: 'Frango grelhado suculento acompanhado de legumes frescos, uma refeição saudável e completa.',
      tipo_refeicao: 'almoco',
      tempo_preparo: 30,
      porcoes: 4,
      calorias_totais: 350,
      imagem_url: 'assets/images/frango.png',
      ingredientes: [
        { id: 1, nome: 'Peito de frango', quantidade: 500, unidade: 'g' },
        { id: 2, nome: 'Brócolis', quantidade: 200, unidade: 'g' },
        { id: 3, nome: 'Cenoura', quantidade: 2, unidade: 'unidades' },
        { id: 4, nome: 'Abobrinha', quantidade: 1, unidade: 'unidade' },
        { id: 5, nome: 'Azeite de oliva', quantidade: 2, unidade: 'colheres de sopa' },
        { id: 6, nome: 'Alho', quantidade: 2, unidade: 'dentes' },
        { id: 7, nome: 'Sal', quantidade: 1, unidade: 'colher de chá' },
        { id: 8, nome: 'Pimenta do reino', quantidade: 1/2, unidade: 'colher de chá' }
      ],
      modo_preparo: [
        'Tempere o frango com sal, pimenta e alho amassado.',
        'Aqueça uma frigideira com 1 colher de azeite e grelhe o frango até dourar dos dois lados.',
        'Corte os legumes em pedaços médios.',
        'Em outra panela, refogue os legumes com o restante do azeite.',
        'Tempere os legumes com sal e pimenta a gosto.',
        'Sirva o frango fatiado acompanhado dos legumes.'
      ]
    },
    {
      id: 3,
      nome: 'Sanduíche Natural',
      descricao: 'Sanduíche leve e nutritivo, perfeito para um lanche rápido e saudável.',
      tipo_refeicao: 'lanche',
      tempo_preparo: 10,
      porcoes: 1,
      calorias_totais: 280,
      imagem_url: 'assets/images/sanduiche.jpg',
      ingredientes: [
        { id: 1, nome: 'Pão integral', quantidade: 2, unidade: 'fatias' },
        { id: 2, nome: 'Peito de frango desfiado', quantidade: 50, unidade: 'g' },
        { id: 3, nome: 'Cenoura ralada', quantidade: 1/4, unidade: 'unidade' },
        { id: 4, nome: 'Alface', quantidade: 2, unidade: 'folhas' },
        { id: 5, nome: 'Tomate', quantidade: 2, unidade: 'fatias' },
        { id: 6, nome: 'Cream cheese light', quantidade: 1, unidade: 'colher de sopa' }
      ],
      modo_preparo: [
        'Passe o cream cheese nas duas fatias de pão.',
        'Distribua o frango desfiado sobre uma fatia.',
        'Adicione a cenoura ralada, alface e tomate.',
        'Feche o sanduíche com a outra fatia de pão.',
        'Corte ao meio e sirva.'
      ]
    },
    {
      id: 4,
      nome: 'Omelete de Espinafre',
      descricao: 'Uma omelete rica em proteínas e nutrientes, ideal para o café da manhã.',
      tipo_refeicao: 'cafe',
      tempo_preparo: 15,
      porcoes: 1,
      calorias_totais: 220,
      imagem_url: 'assets/images/omelete.png',
      ingredientes: [
        { id: 1, nome: 'Ovos', quantidade: 2, unidade: 'unidades' },
        { id: 2, nome: 'Espinafre', quantidade: 1, unidade: 'xícara' },
        { id: 3, nome: 'Cebola', quantidade: 1/4, unidade: 'unidade' },
        { id: 4, nome: 'Queijo ralado', quantidade: 1, unidade: 'colher de sopa' },
        { id: 5, nome: 'Azeite', quantidade: 1, unidade: 'colher de chá' },
        { id: 6, nome: 'Sal', quantidade: 1, unidade: 'pitada' },
        { id: 7, nome: 'Pimenta', quantidade: 1, unidade: 'pitada' }
      ],
      modo_preparo: [
        'Bata os ovos em uma tigela com sal e pimenta.',
        'Pique a cebola e refogue no azeite até ficar transparente.',
        'Adicione o espinafre e cozinhe até murchar.',
        'Despeje os ovos batidos sobre os vegetais na frigideira.',
        'Polvilhe o queijo ralado por cima.',
        'Cozinhe em fogo baixo até os ovos ficarem firmes.',
        'Dobre ao meio e sirva.'
      ]
    },
    {
      id: 5,
      nome: 'Risoto de Cogumelos',
      descricao: 'Um risoto cremoso e aromático com cogumelos frescos, perfeito para o jantar.',
      tipo_refeicao: 'jantar',
      tempo_preparo: 40,
      porcoes: 4,
      calorias_totais: 380,
      imagem_url: 'assets/images/risoto.jpg',
      ingredientes: [
        { id: 1, nome: 'Arroz arbóreo', quantidade: 300, unidade: 'g' },
        { id: 2, nome: 'Cogumelos variados', quantidade: 200, unidade: 'g' },
        { id: 3, nome: 'Cebola', quantidade: 1, unidade: 'unidade' },
        { id: 4, nome: 'Alho', quantidade: 2, unidade: 'dentes' },
        { id: 5, nome: 'Caldo de legumes', quantidade: 1, unidade: 'litro' },
        { id: 6, nome: 'Vinho branco', quantidade: 100, unidade: 'ml' },
        { id: 7, nome: 'Manteiga', quantidade: 2, unidade: 'colheres de sopa' },
        { id: 8, nome: 'Queijo parmesão ralado', quantidade: 50, unidade: 'g' },
        { id: 9, nome: 'Azeite', quantidade: 2, unidade: 'colheres de sopa' },
        { id: 10, nome: 'Sal e pimenta', quantidade: 1, unidade: 'a gosto' }
      ],
      modo_preparo: [
        'Aqueça o caldo de legumes em uma panela separada.',
        'Em outra panela, refogue a cebola e o alho no azeite até ficarem transparentes.',
        'Adicione os cogumelos e refogue por 3-4 minutos.',
        'Acrescente o arroz e misture bem para absorver os sabores.',
        'Adicione o vinho branco e mexa até evaporar.',
        'Adicione o caldo quente aos poucos, mexendo constantemente.',
        'Continue adicionando o caldo e mexendo até o arroz ficar al dente (cerca de 18-20 minutos).',
        'Desligue o fogo e adicione a manteiga e o queijo parmesão.',
        'Tempere com sal e pimenta a gosto.',
        'Deixe descansar por 2 minutos antes de servir.'
      ]
    }
  ];

  constructor() { }

  getRecipes(): Observable<Recipe[]> {
    return of(this.recipes);
  }

  getRecipeById(id: number): Observable<Recipe | undefined> {
    const recipe = this.recipes.find(r => r.id === id);
    return of(recipe);
  }

  getRecipesByType(type: string): Observable<Recipe[]> {
    if (type === 'all') {
      return this.getRecipes();
    }
    const filteredRecipes = this.recipes.filter(r => r.tipo_refeicao === type);
    return of(filteredRecipes);
  }

  addRecipe(recipe: Omit<Recipe, 'id'>): Observable<Recipe> {
    const newRecipe = {
      id: this.recipes.length + 1,
      ...recipe
    };
    this.recipes.push(newRecipe);
    return of(newRecipe);
  }

  updateRecipe(id: number, recipeData: Partial<Recipe>): Observable<Recipe | undefined> {
    const index = this.recipes.findIndex(r => r.id === id);
    if (index === -1) {
      return of(undefined);
    }
    
    const updatedRecipe = {
      ...this.recipes[index],
      ...recipeData
    };
    
    this.recipes[index] = updatedRecipe;
    return of(updatedRecipe);
  }
    
}