import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { DashboardComponent } from './shared/dashboard/dashboard.component';
import { DiaryComponent } from './diary/diary/diary.component';
import { RecipeListComponent } from './recipes/recipe-list/recipe-list.component';
import { RecipeDetailComponent } from './recipes/recipe-detail/recipe-detail.component';
import { RecipeFormComponent } from './recipes/recipe-form/recipe-form.component';
import { PlannerComponent } from './planner/planner/planner.component';
import { AuthGuard } from './auth/auth.guard'; // Note a mudança de 'authGuard' para 'AuthGuard'

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'diary', component: DiaryComponent, canActivate: [AuthGuard] },
  { path: 'recipes', component: RecipeListComponent, canActivate: [AuthGuard] },
  { path: 'recipes/new', component: RecipeFormComponent, canActivate: [AuthGuard] },
  { path: 'recipes/:id', component: RecipeDetailComponent, canActivate: [AuthGuard] },
  { path: 'recipes/:id/edit', component: RecipeFormComponent, canActivate: [AuthGuard] },
  { path: 'planner', component: PlannerComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/dashboard' }
];