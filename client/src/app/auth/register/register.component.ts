import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, RouterLink]
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', Validators.required]
    }, {
      validator: this.mustMatch('senha', 'confirmarSenha')
    });
  }
  
  // Validador personalizado para verificar se as senhas coincidem
  mustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }
  
  onSubmit(): void {
    if (this.registerForm.valid) {
      // Remover o campo de confirmação de senha
      const formData = { ...this.registerForm.value };
      delete formData.confirmarSenha;
      
      this.authService.register(formData)
        .subscribe({
          next: () => {
            // Redirecionar para a página de login após o registro
            this.router.navigate(['/login'], {
              queryParams: { registered: 'true' }
            });
          },
          error: error => {
            if (error.status === 400) {
              this.errorMessage = 'Email já cadastrado';
            } else {
              this.errorMessage = 'Erro ao registrar usuário';
            }
          }
        });
    }
  }
}