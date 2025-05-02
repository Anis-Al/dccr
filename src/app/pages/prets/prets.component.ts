import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PretDetailsComponent } from './pret-details/pret-details.component';
import { Credit } from '../../core/models/credits';
import { Garantie } from '../../core/models/credits';
import { Intervenant } from '../../core/models/credits';
import { GenererDonneesFictivesService } from '../../core/services/generer-donnees-fictives.service';

@Component({
  selector: 'app-prets',
  standalone: true,
  imports: [CommonModule, FormsModule, PretDetailsComponent],
  template: `
    <div class="prets-container" [class.details-open]="creditSelectionne">
      <div class="prets-list">
        <div class="header">
          <h1>Crédits En Cours</h1>
        </div>

        <div class="filters">
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input type="text" placeholder="Rechercher un crédit..." [(ngModel)]="searchTerm" (input)="onSearch()">
          </div>
          <div class="filter-buttons">
            <button class="btn" [class.active]="currentFilter === 'all'" (click)="filterLoans('all')">
              Tous
            </button>
            <button class="btn" [class.active]="currentFilter === 'active'" (click)="filterLoans('active')">
              En Cours
            </button>
            <button class="btn" [class.active]="currentFilter === 'late'" (click)="filterLoans('late')">
              En Retard
            </button>
            <!-- <button class="btn" [class.active]="currentFilter === 'completed'" (click)="filterLoans('completed')">
              Terminés
            </button> -->
          </div>
        </div>

        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th class="sticky-column">N° Contrat</th>
                <th>Date Déclaration</th>
                <th>Emprunteur Principal</th>
                <th>Situation</th>
                <th>Type</th>
                <th>Activité</th>
                <th>Fichier source</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let pret of paginatedPrets" 
                  (click)="onSelectPret(pret)"
                  [class.selected]="creditSelectionne?.numContrat === pret.numContrat && creditSelectionne !== null">
                <td class="sticky-column">{{pret.numContrat}}</td>
                <td>{{pret.dateDeclaration | date:'dd/MM/yyyy'}}</td>
                <td>{{getEmprunteurPrincipal(pret)}}</td>
                <td>{{pret.libelleSituation}}</td>
                <td>{{pret.libelleTypeCredit}}</td>
                <td>{{pret.libelleActivite}}</td>
                <td>{{pret.source.fileName}}</td>
                <!-- <td>
                  <span class="status-badge" [class]="getStatusClass(pret)">
                    {{getStatusLabel(pret)}}
                  </span>
                </td> -->
              </tr>
            </tbody>
          </table>
        </div>

        <div class="pagination" *ngIf="totalPages > 1">
          <button class="btn" [disabled]="pageActuelle === 1" (click)="changePage(pageActuelle - 1)">
            <i class="fas fa-chevron-left"></i>
          </button>
          <span class="page-info">Page {{pageActuelle}} sur {{totalPages}}</span>
          <button class="btn" [disabled]="pageActuelle === totalPages" (click)="changePage(pageActuelle + 1)">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>

      <div class="details-panel" *ngIf="creditSelectionne">
        <app-pret-details 
          [pret]="creditSelectionne" 
          (close)="creditSelectionne = null">
        </app-pret-details>
      </div>
    </div>
  `,
  styles: [`
    .prets-container {
      display: flex;
      height: 100%;
      transition: all 0.3s ease;

      &.details-open {
        .prets-list {
          width: 40%;
          min-width: 600px;
        }

        .details-panel {
          width: 60%;
        }
      }
    }

    .prets-list {
      width: 100%;
      transition: width 0.3s ease;
      overflow: auto;
      padding: 1rem;
    }

    .details-panel {
      width: 0;
      overflow: auto;
      background-color: var(--background-color);
      border-left: 1px solid var(--border-color);
      transition: width 0.3s ease;
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

    .status-badge {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;

      &.situation-1 {
        background-color: #e3f2fd;
        color: #1976d2;
      }

      &.situation-2 {
        background-color: #e8f5e9;
        color: #2e7d32;
      }

      &.situation-3 {
        background-color: #ffebee;
        color: #c62828;
      }

      &.situation-4 {
        background-color: #fff3e0;
        color: #f57c00;
      }

      &.retard-0 {
        background-color: #e8f5e9;
        color: #2e7d32;
      }

      &.retard-1 {
        background-color: #fff3e0;
        color: #f57c00;
      }

      &.retard-2 {
        background-color: #ffebee;
        color: #c62828;
      }

      &.retard-3 {
        background-color: #1a1a1a;
        color: #ffffff;
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
      justify-content: center;
      align-items: center;
      gap: 1rem;
      margin-top: 1rem;
      padding: 1rem;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

      .btn {
        padding: 0.5rem;
        min-width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }

      .page-info {
        font-size: 0.9rem;
        color: var(--text-color);
      }
    }

    .table-container {
      overflow-x: auto;
      margin: 0 -1rem;
      padding: 0 1rem;
      scrollbar-width: thin;
      position: relative;
      background-color: var(--background-color);
      
      &::-webkit-scrollbar {
        height: 8px;
      }
      
      &::-webkit-scrollbar-track {
        background: var(--background-color);
        border-radius: 4px;
      }
      
      &::-webkit-scrollbar-thumb {
        background: var(--border-color);
        border-radius: 4px;
        
        &:hover {
          background: #bdbdbd;
        }
      }

      table {
        width: 100%;
        min-width: 800px;
        border-collapse: separate;
        border-spacing: 0;
        table-layout: fixed;

        thead tr {
          background-color: #f8f9fa !important;
        }
        
        tbody tr {
          background-color: white !important;
          
          &:hover {
            background-color: #f2f2f2 !important;
          }
        }

        th, td {
          padding: 0.75rem;
          text-align: left;
          border-bottom: 1px solid var(--border-color);
          background-color: var(--background-color);
        }

        th {
          font-weight: 600;
          background-color: var(--background-color);
          border-bottom: 2px solid var(--border-color);
        }

        .sticky-column {
          position: sticky;
          left: 0;
          z-index: 1;
          background-color: var(--background-color);
          border-right: 2px solid var(--border-color);
          box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
        }

        thead th.sticky-column {
          z-index: 2;
        }

        tbody {
          background-color: white;
        }

        tbody tr {
          &:hover {
            td {
              background-color: var(--hover-color);
            }
          }

          &.selected {
            td {
              background-color: var(--primary-color-light) !important;
            }
          }
        }
      }
    }

    .status-badge {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.875rem;
      font-weight: 500;

      &.status-active {
        background-color: #e8f5e9;
        color: #2e7d32;
      }

      &.status-late {
        background-color: #ffebee;
        color: #c62828;
      }

      &.status-completed {
        background-color: #e3f2fd;
        color: #1976d2;
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

      .filter-buttons {
        display: flex;
        gap: 0.5rem;

        .btn {
          padding: 0.5rem 1rem;
          border: 1px solid var(--border-color);
          background: none;
          border-radius: 4px;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s ease;

          &:hover {
            background-color: var(--hover-color);
          }

          &.active {
            background-color: var(--primary-color);
            color: white;
            border-color: var(--primary-color);
          }
        }
      }
    }

    .table-container table {
      thead tr {
        background-color: #f8f9fa !important;
        th {
          background-color: inherit !important;
        }
      }
      
      tbody tr {
        background-color: white !important;
        
        &:hover {
          background-color: #f2f2f2 !important;
        }
        
        td {
          background-color: inherit !important;
        }
      }
    }
  `]
})
export class PretsComponent {
  searchTerm: string = '';
  currentFilter: string = 'all';
  creditSelectionne: Credit | null = null;
  
  pageActuelle: number = 1;
  lignesParPage: number = 5;
  totalPages: number = 2;
  paginatedPrets: Credit[] = [];
  filteredPrets: Credit[] = [];

  credits: Credit[] = [];

  constructor(
    private router: Router,
    private mockService: GenererDonneesFictivesService
  ) {
    this.loadMockData();
  }

  loadMockData() {
    this.credits = this.mockService.getMockCredits(25);
    this.updatePagination();

  }

  onSearch() {
    this.pageActuelle = 1;
    this.updatePagination();
  }

  filterLoans(filter: string) {
    this.currentFilter = filter;
    this.pageActuelle = 1;
    this.updatePagination();
  }

  changePage(page: number) {
    this.pageActuelle = page;
    this.updatePagination();
  }

  updatePagination() {
    this.filteredPrets = this.credits.filter(credit => {
      const matchesSearch = credit.numContrat.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                          this.getEmprunteurPrincipal(credit).toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesFilter = this.currentFilter === 'all' ||
                          (this.currentFilter === 'active' && credit.situation === 1) ||
                          (this.currentFilter === 'late' && credit.situation === 3) ||
                          (this.currentFilter === 'completed' && credit.situation === 2);

      return matchesSearch && matchesFilter;
    });

    this.totalPages = Math.ceil(this.filteredPrets.length / this.lignesParPage);
    const startIndex = (this.pageActuelle - 1) * this.lignesParPage;
    this.paginatedPrets = this.filteredPrets.slice(startIndex, startIndex + this.lignesParPage);
    console.log(this.paginatedPrets);
  }

  onNewLoan() {
    this.router.navigate(['/prets/nouveau']);
  }

  onSelectPret(credit: any) {
    this.creditSelectionne = this.creditSelectionne?.numContrat === credit.numContrat ? null : credit;
  }

  getEmprunteurPrincipal(credit: Credit): string {
    const emprunteur = credit.intervenants.find(i => i.libelleNiveauResponsabilite === 'Emprunteur');
    return emprunteur ? `${emprunteur.cle}` : 'N/A';
  }

  // getStatusClass(credit: Credit): string {
  //   if (credit?.classeRetard > 0) return 'status-late';
  //   if (credit.dureeRestante === 0) return 'status-completed';
  //   return 'status-active';
  // }

  // getStatusLabel(credit: Credit): string {
  //   if (credit.classeRetard > 0) return 'En Retard';
  //   if (credit.dureeRestante === 0) return 'Terminé';
  //   return 'En Cours';
  // }
}