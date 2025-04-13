import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
  <div class="login-container">
  <div class="login-grid">
    <div class="logo-column">
      <img src="assets/sga-logo.png" alt="SGA Logo" class="logo-img">
    </div>

    <div class="login-card">
      <h1 class="app-title">Déclarations Correctives BA</h1>
      <h2 class="login-title">Connexion</h2>
      
      <form class="login-form" [formGroup]="loginForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="username">Matricule</label>
          <div class="input-group">
            <input 
              type="text" 
              id="username" 
              formControlName="username"
              placeholder="Entrez votre matricule"
              [ngClass]="{'error': loginForm.get('username')?.invalid && (loginForm.get('username')?.touched || loginForm.get('username')?.dirty)}">
          </div>
        </div>

        <div class="form-group">
          <label for="password">Mot de passe</label>
          <div class="input-group">
            <input 
              type="password" 
              id="password" 
              formControlName="password"
              placeholder="Entrez votre mot de passe"
              [ngClass]="{'error': loginForm.get('password')?.invalid && (loginForm.get('password')?.touched || loginForm.get('password')?.dirty)}">
          </div>
        </div>

        <button type="submit" class="login-button" [disabled]="loginForm.invalid || isSubmitting">
          <span *ngIf="!isSubmitting">Se connecter</span>
          <span *ngIf="isSubmitting" class="loading-spinner"></span>
        </button>

        <div class="error-message server-error" *ngIf="errorMessage">
          {{ errorMessage }}
        </div>
      </form>
    </div>
  </div>
</div>
`,
  styles:`
  .login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  font-family: 'Poppins', sans-serif;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);

  .login-grid {
    display: grid;
    grid-template-columns: auto 400px;
    gap: 8rem;
    align-items: center;
  }

  .logo-column {
    text-align: center;
    
    .logo-img {
      width: 500px;
      filter: drop-shadow(0 2px 6px rgba(0,0,0,0.15));
      transition: all 0.3s ease;
      
      &:hover {
        transform: scale(1.03);
        filter: drop-shadow(0 4px 8px rgba(0,0,0,0.2));
      }
    }
  }
}

.login-card {
  background: rgba(255,255,255,0.95);
  padding: 2.5rem;
  border-radius: 1.5rem;
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.15);
  border: 1px solid rgba(255,255,255,0.2);
  max-width: 420px;

  .app-title {
    position: relative;
    display: inline-block;
    padding-bottom: 0.5rem;
    color: #2d3748;
    font-size: 1.75rem;
    font-weight: 500;
    text-align: center;
    margin: 0 0 1rem 0;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 25%;
      width: 50%;
      height: 3px;
      background: linear-gradient(90deg, transparent, #ff2d30, transparent);
      border-radius: 3px;
      transition: all 0.3s ease;
    }
    
    &:hover::after {
      width: 80%;
      left: 10%;
      background: linear-gradient(90deg, transparent, #ff2d30, #c3cfe2, transparent);
    }
  }

  .login-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #2d3748;
    text-align: center;
    margin-bottom: 2rem;
  }
}

.form-group {
  margin-bottom: 1.5rem;

  label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: #4a5568;
    margin-bottom: 0.5rem;
  }

  .input-group {
    position: relative;
    
    input {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1px solid #e2e8f0;
      border-radius: 0.5rem;
      font-size: 0.875rem;
      transition: all 0.3s ease;

      &:focus {
        outline: none;
        border-color: #ff2d30;
        box-shadow: 0 0 0 3px rgba(255, 45, 48, 0.1);
      }

      &::placeholder {
        color: #a0aec0;
      }

      &.error {
        border-color: #e53e3e;
        
        &:focus {
          box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.1);
        }
      }
    }
  }
}

.login-button {
  font-family: 'Poppins', sans-serif;
  font-weight: 500;
  letter-spacing: 0.5px;
  width: 100%;
  padding: 0.75rem;
  background-color: #ff2d30;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background-color: #d11a1d;
  }

  &:disabled {
    background-color: #e2e8f0;
    cursor: not-allowed;
  }

  .loading-spinner {
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: white;
    animation: spin 1s ease-in-out infinite;
  }
}

.error-message {
  color: #e53e3e;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  display: block;

  &.server-error {
    text-align: center;
    margin-top: 1rem;
    font-size: 0.875rem;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .login-container {
    padding: 1rem;
    
    .login-grid {
      grid-template-columns: 1fr;
      gap: 3rem;
      padding: 1rem;
    }

    .logo-column {
      margin-top: 1rem;
      
      .logo-img {
        width: 200px;
      }
    }

    .login-card {
      padding: 1.5rem;
      margin-bottom: 2rem;
      
      .app-title {
        font-size: 1.5rem;
      }
      
      .login-title {
        font-size: 1.25rem;
        margin-bottom: 1.5rem;
      }
    }
  }
}

@media (max-width: 480px) {
  .login-container {
    padding: 1rem;
  }

  .login-card {
    padding: 1.25rem;
  }
}
`
})
export class LoginComponent {
  loginForm: FormGroup;
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isSubmitting = true;
      this.errorMessage = '';

      console.log('Form submitted:', this.loginForm.value);
      
      setTimeout(() => {

        this.router.navigate(['/tableau-de-bord']);
        this.isSubmitting = false;
      }, 1000);
    } else {

      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
    }
  }
}
