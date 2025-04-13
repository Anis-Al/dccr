import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { User } from '../../core/models/user.model';


@Component({
  selector: 'app-utilisateurs',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="utilisateurs">
      <div class="header">
        <h1>Gestion des Utilisateurs</h1>
        <button 
        class="btn btn-primary" 
        (click)="ajouterNouvelUtilisateur()"
        >
          <i class="fas fa-plus"></i>
          Nouvel Utilisateur
        </button>
      </div>

      <div class="filters card">
        <div class="form-grid">
          <div class="form-group">
            <label>Rechercher</label>
            <input type="text" class="form-control" placeholder="Nom ou matricule">
          </div>

          <div class="form-group">
            <label>Rôle</label>
            <select class="form-control">
              <option value="">Tous les rôles</option>
              <option value="admin">Integrateur</option>
              <option value="gestionnaire">Validateur</option>
              <option value="analyste">Consultant</option>
            </select>
          </div>

        
        </div>
      </div>

      <div class="card">
        <table class="table">
          <thead>
            <tr>
             <th>Nom Complet</th>
              <th>Matricule</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of utilisateurs">
              <td>
                <div class="user-info">
                  <img [src]="'/assets/default-avatar.svg'" alt="Avatar" class="avatar">
                  <span>{{ user.fullName }}</span>
                </div>
              </td>
              <td>{{ user.matricule }}</td>
              <td>{{ user.email }}</td>
              <td>
                <span class="role-badge" [class]="user.role.toLowerCase()">
                  {{ user.role }}
                </span>
              </td>
              <td>
                <div class="actions">
                  <button class="btn-icon" title="Modifier">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button class="btn-icon" >
                    <i class="fas fa-trash"></i>
                  </button>
                  
                </div>  
              </td>
            </tr>
          </tbody>
        </table>

        <div class="pagination">
          <button class="btn btn-secondary" disabled>
            <i class="fas fa-chevron-left"></i>
            Précédent
          </button>
          <span>Page 1 sur 3</span>
          <button class="btn btn-secondary">
            Suivant
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .utilisateurs {
      padding: 1rem;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .filters {
      margin-bottom: 1rem;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .user-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;

      .avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
      }
    }

    .role-badge {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;

      &.admin {
        background-color: #e8eaf6;
        color: #3f51b5;
      }

      &.consultant {
        background-color: #e0f2f1;
        color: #009688;
      }

      &.analyste {
        background-color: #f3e5f5;
        color: #9c27b0;
      }
    }

    .status-badge {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;

      &.actif {
        background-color: #e8f5e9;
        color: var(--success-color);
      }

      &.inactif {
        background-color: #fafafa;
        color: #9e9e9e;
      }
    }

    .actions {
      display: flex;
      gap: 0.5rem;
    }

    .btn-icon {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.25rem;
      color: var(--text-color);
      opacity: 0.7;

      &:hover {
        opacity: 1;
      }
    }

    .pagination {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid var(--border-color);

      
      .btn {
        display: flex;
        align-items: center;
        gap: 0.5rem;

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }
    }
  `]
})
export class UtilisateursComponent {
  utilisateurs: User[] = [
    {
      matricule: 77822231992,
      fullName: 'Halil Ibrahim',
      email: 'Ibrahim.Halil@socgen.com',
      role: 'Admin',
      
    },
    {
      matricule: 552221145,
      fullName: 'Alim Anis',
      email: 'anis.algiers@gmail.com',
      role: 'Consultant',
      
    },
    
    
  ];

  constructor(private router:Router){}

  ajouterNouvelUtilisateur(){
    this.router.navigate(['/utilisateurs/nouveau'])
  }
} 