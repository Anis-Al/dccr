import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { loginDto } from '../../core/dtos/Auth/login-dto';
import { AuthService } from '../../core/services/auth&utilisateurs/auth.service';
import { changerMotDePasseDto } from '../../core/dtos/Auth/login-dto';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  showChangePassword = false;
  changePasswordForm: FormGroup;
  successChangePasswordMessage = '';
  errorChangePasswordMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.formBuilder.group({
      matricule: ['', [Validators.required]],
      mdp: ['', [Validators.required]]
    });
    this.changePasswordForm = this.formBuilder.group({
      matricule: ['', [Validators.required]],
      ancienMotDePasse: ['', [Validators.required]],
      nouveauMotDePasse: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = '';

      const loginData: loginDto = {
        matricule: this.loginForm.get('matricule')?.value,
        mot_de_passe: this.loginForm.get('mdp')?.value
      };

      this.authService.login(loginData).subscribe({
        next: (response) => {
          if (response && response.token) {
            this.authService.setToken(response.token);
            console.log('Token:', response.token);
            console.log('Decoded Token:', this.authService.decodeToken(response.token));
            console.log(this.authService.getUserInfo()); 
            this.router.navigate(['/tableau-de-bord']);
          } else if (response && response.message) {
            this.errorMessage = response.message;
          } else {
            this.errorMessage = 'Réponse invalide du serveur';
          }
        },
        error: (error) => {
          this.isSubmitting = false;
          this.errorMessage = error.error?.message || 'Échec de la connexion. Veuillez vérifier vos identifiants.';
        },
        complete: () => {
          this.isSubmitting = false;
        }
      });
    } else {
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
    }
  }

  toggleChangePassword() {
    this.showChangePassword = !this.showChangePassword;
  }

  onChangePasswordSubmit() {
    if (this.changePasswordForm.valid) {
      const dto: changerMotDePasseDto = this.changePasswordForm.value;
      this.successChangePasswordMessage = '';
      this.errorChangePasswordMessage = '';
      this.authService.changerMotDePasse(dto).subscribe({
        next: (res) => {
          this.successChangePasswordMessage = res.message;
          this.changePasswordForm.reset();
        },
        error: (err) => {
          this.errorChangePasswordMessage = err.error?.message || 'Erreur lors du changement de mot de passe.';
        }
      });
    } else {
      Object.keys(this.changePasswordForm.controls).forEach(key => {
        this.changePasswordForm.get(key)?.markAsTouched();
      });
    }
  }
}
