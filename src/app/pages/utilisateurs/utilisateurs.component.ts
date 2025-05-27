import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../../core/models/user.model';
import { PaginationComponent } from '../../components/pagination/pagination.component';


@Component({
  selector: 'app-utilisateurs',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent],
  template: `
    <div class="utilisateurs-container">
      <div class="utilisateurs-list">
        <div class="header">
          <h1>Gestion des Utilisateurs</h1>
          <div class="header-actions">
            <button class="btn btn-primary" (click)="ajouterNouvelUtilisateur()">
              <i class="fas fa-plus"></i>
              <span>Nouvel Utilisateur</span>
            </button>
          </div>
        </div>

        <div class="filters">
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input type="text" placeholder="Rechercher un utilisateur..." [(ngModel)]="searchTerm" (input)="onSearch()">
          </div>
          <div class="role-filter">
            <label>Rôle:</label>
            <select [(ngModel)]="selectedRole" (change)="onSearch()">
              <option value="">Tous les rôles</option>
              <option value="admin">Integrateur</option>
              <option value="gestionnaire">Validateur</option>
              <option value="analyste">Consultant</option>
            </select>
          </div>
        </div>

        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th class="sticky-column">Nom Complet</th>
                <th>Matricule</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let user of utilisateursPagines" class="clickable-row">
                <td class="sticky-column">
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
                    <button class="btn-icon" title="Supprimer">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="utilisateursPagines.length === 0">
                <td colspan="5" class="no-data">Aucun utilisateur trouvé</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="pagination-container">
          <app-pagination
            [lignesTotales]="utilisateursFiltres.length"
            [pageActuelle]="pageActuelle"
            (changeurPage)="changerPage($event)">
          </app-pagination>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .utilisateurs-container {
      display: flex;
      height: 100%;
      transition: all 0.3s ease;
    }

    .utilisateurs-list {
      width: 100%;
      transition: width 0.3s ease;
      overflow: auto;
      padding: 1.5rem;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--border-color);

      h1 {
        margin: 0;
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--text-color);
      }

      .header-actions {
        display: flex;
        gap: 0.75rem;
        align-items: center;
      }
    }

    .filters {
      display: flex;
      gap: 1rem;
      align-items: center;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;

      .search-box {
        position: relative;
        flex: 1;
        min-width: 200px;

        i {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-color-light);
        }

        input {
          width: 100%;
          padding: 0.5rem 1rem 0.5rem 2.25rem;
          border: 1px solid var(--border-color);
          border-radius: 4px;
          font-size: 0.875rem;

          &:focus {
            outline: none;
            border-color: var(--primary-color);
          }
        }
      }

      .role-filter {
        display: flex;
        align-items: center;
        gap: 0.5rem;

        label {
          color: var(--text-color);
          font-size: 0.875rem;
        }

        select {
          padding: 0.5rem;
          border: 1px solid var(--border-color);
          border-radius: 4px;
          font-size: 0.875rem;
          color: var(--text-color);
          background-color: white;
          min-width: 200px;

          &:focus {
            outline: none;
            border-color: var(--primary-color);
          }
        }
      }
    }

    .table-container {
      overflow-x: auto;
      margin: 0 -1.5rem;
      padding: 0 1.5rem;
      position: relative;
      background-color: var(--background-color);
      min-height: 200px;

      table {
        width: 100%;
        min-width: 800px;
        border-collapse: separate;
        border-spacing: 0;

        th, td {
          padding: 0.75rem;
          text-align: left;
          border-bottom: 1px solid var(--border-color);
        }

        th {
          position: sticky;
          top: 0;
          background-color: var(--background-color);
          font-weight: 600;
          z-index: 10;
          box-shadow: 0 1px 0 var(--border-color);
        }

        .sticky-column {
          position: sticky;
          left: 0;
          background-color: inherit;
          z-index: 1;
          box-shadow: 1px 0 0 var(--border-color);
        }

        thead th.sticky-column {
          z-index: 11;
          background-color: var(--background-color);
        }

        tbody tr {
          background-color: white;
          transition: background-color 0.2s ease;

          &:hover {
            background-color: var(--hover-color, #f5f5f5);
          }

          &.clickable-row {
            cursor: pointer;
          }

          td.sticky-column {
            background-color: inherit;
          }
        }
      }
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

    .actions {
      display: flex;
      gap: 0.5rem;
      justify-content: center;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
      border: none;
      
      &.btn-primary {
        background-color: var(--primary-color, #1976d2);
        color: white;
        
        &:hover {
          background-color: var(--primary-color-dark, #1565c0);
        }
      }
    }

    .btn-icon {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.25rem;
      color: var(--text-color);
      opacity: 0.7;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;

      &:hover {
        opacity: 1;
        background-color: rgba(0, 0, 0, 0.05);
      }
    }

    .pagination-container {
      padding: 1rem;
      background-color: var(--background-color);
      border-top: 1px solid var(--border-color);
      margin-top: auto;
    }

    .no-data {
      text-align: center;
      padding: 2rem;
      color: var(--text-color-light);
      font-style: italic;
    }
  `]
})
export class UtilisateursComponent implements OnInit {
  
  pageActuelle = 1;
  lignesParPage = 5;
  searchTerm = '';
  selectedRole = '';
  utilisateursFiltres: User[] = [];
  utilisateursPagines: User[] = [];

  constructor(private router: Router) {}

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
    }
  ];

  ngOnInit() {
    this.updateFiltres();
  }

  updateFiltres() {
    this.utilisateursFiltres = this.utilisateurs.filter(user => {
      const matchSearch = !this.searchTerm || 
        user.fullName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.matricule.toString().includes(this.searchTerm);
      
      const matchRole = !this.selectedRole || user.role.toLowerCase() === this.selectedRole.toLowerCase();
      
      return matchSearch && matchRole;
    });
    
    this.updatePagination();
  }

  updatePagination() {
    const startIndex = (this.pageActuelle - 1) * this.lignesParPage;
    const endIndex = startIndex + this.lignesParPage;
    this.utilisateursPagines = this.utilisateursFiltres.slice(startIndex, endIndex);
  }

  changerPage(page: number) {
    this.pageActuelle = page;
    this.updatePagination();
  }

  onSearch() {
    this.pageActuelle = 1;
    this.updateFiltres();
  }

  ajouterNouvelUtilisateur() {
    this.router.navigate(['/utilisateurs/nouveau']);
  }
}