import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PretDetailsComponent } from './pret-details/pret-details.component';
import { CreditDto }   from '../../core/models/credits';
import { CreditsService } from '../../core/services/credits/credits.service';
import { catchError, Observable, of, Subscription, tap } from 'rxjs';


@Component({
  selector: 'app-prets',
  standalone: true,
  imports: [CommonModule, FormsModule, PretDetailsComponent],
  template: `
    <div class="prets-container" [class.details-open]="creditSelectionne">
      <div class="prets-list">
        <div class="header">
          <h1>Crédits En Cours</h1>
          <button class="btn header-btn" (click)="nouveauCredit()">
            <span>Nouveau</span>
            <i class="fas fa-plus"></i>
          </button>
        </div>

        <div class="filters">
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input type="text" placeholder="Rechercher un crédit..." [(ngModel)]="searchTerm" (input)="onSearch()">
          </div>
          <div class="filter-buttons">
            <button class="btn" [class.active]="currentFilter === 'all'" (click)="filtrerCredit('all')">
              Tous
            </button>
            <button class="btn" [class.active]="currentFilter === 'lastMonth'" (click)="filtrerCredit('lastMonth')">
              Dernier mois
            </button>
            <button class="btn" [class.active]="currentFilter === 'lastQuarter'" (click)="filtrerCredit('lastQuarter')">
              Dernier trimestre
            </button>
            <button class="btn" [class.active]="currentFilter === 'lastYear'" (click)="filtrerCredit('lastYear')">
              Dernière année
            </button>
          </div>
        </div>

        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th class="collante">N° Contrat</th>
                <th>Date Déclaration</th>
                <th>Situation</th>
                <th>Type</th>
                <th>Activité</th>
              </tr>
            </thead>
            <tbody>
                <tr *ngFor="let credit of CreditsPagines"
                    (click)="selectionnerCredit(credit)"
                    [class.selected]="creditSelectionne?.num_contrat_credit === credit.num_contrat_credit"
                >                  
                  <td class="collante">{{credit.num_contrat_credit}}</td>
                  <td>{{credit.date_declaration}}</td>
                  <td>{{credit.libelle_situation}}</td>
                  <td>{{credit.libelle_type_credit}}</td>
                  <td>{{credit.libelle_activite}}</td>

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

        .collante {
          position: sticky;
          left: 0;
          z-index: 1;
          background-color: var(--background-color);
          border-right: 2px solid var(--border-color);
          box-shadow: 2px 0 4px rgba(0, 0, 0, 0.1);
        }

        thead th.collante {
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

    .header-btn {
      margin-left: auto;
      background-color: var(--primary-color);
      color: white;
      border-color: var(--primary-color);
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
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
export class PretsComponent implements OnInit {
  credits$: Observable<CreditDto[]> | undefined;
  private TousLesCredits: CreditDto[] = []; 
  private loadCreditsSubscription: Subscription | undefined;
  isLoading: boolean = false; 

  searchTerm: string = '';
  currentFilter: string = 'all'; 
  creditSelectionne: CreditDto | null = null;

  pageActuelle: number = 1;
  lignesParPage: number = 10;
  totalPages: number = 1;
  CreditsPagines: CreditDto[] = [];
  filteredPrets: CreditDto[] = []; 

  errorMessage: string | null = null;


  ngOnInit() {
    this.loadCredits();
  }

  constructor(
    private router: Router,
    private creditService: CreditsService
  ) {
  }

  

  onSearch() {
    this.pageActuelle = 1;
    this.updatePagination();
  }

  filtrerCredit(filter: string) {
    this.currentFilter = filter;
    this.pageActuelle = 1;
    
    if (filter !== 'all') {
      this.searchTerm = '';
    }

    const currentDate = new Date();
    const filteredCredits = this.TousLesCredits.filter(credit => {
      if (filter === 'all') return true;
      
      // Skip if there's no date declaration
      if (!credit.date_declaration) return false;
      
      const creditDate = new Date(credit.date_declaration);
      
      // Skip if the date is invalid
      if (isNaN(creditDate.getTime())) return false;
      
      switch (filter) {
        case 'lastMonth':
          return creditDate >= new Date(currentDate.setMonth(currentDate.getMonth() - 1));
        case 'lastQuarter':
          return creditDate >= new Date(currentDate.setMonth(currentDate.getMonth() - 3));
        case 'lastYear':
          return creditDate >= new Date(currentDate.setFullYear(currentDate.getFullYear() - 1));
        default:
          return true;
      }
    });

    this.filteredPrets = filteredCredits;
    this.updatePagination();
  }

  changePage(page: number) {
    this.pageActuelle = page;
    this.updatePagination();
  }

  // updatePagination(): void {
  //   if (!this.TousLesCredits) {
  //     this.filteredPrets = [];
  //     this.CreditsPagines = [];
  //     this.totalPages = 1;
  //     return;
  //   }
  //   let searchedCredits = this.TousLesCredits.filter(credit =>
  //     credit.num_contrat_credit?.toLowerCase().includes(this.searchTerm.toLowerCase()) ?? false
  //   );
  //   this.totalPages = Math.ceil(this.filteredPrets.length / this.lignesParPage);
  //   if (this.totalPages < 1) { this.totalPages = 1; } 

  //   if(this.pageActuelle > this.totalPages) {
  //       this.pageActuelle = this.totalPages;
  //   }
  //    if(this.pageActuelle < 1) {
  //       this.pageActuelle = 1;
  //   }
  //   const startIndex = (this.pageActuelle - 1) * this.lignesParPage;
  //   this.CreditsPagines = this.filteredPrets.slice(startIndex, startIndex + this.lignesParPage);
  // }

  updatePagination(): void {
    console.log('Updating pagination. Filter:', this.currentFilter, 'Search:', this.searchTerm, 'Total Items:', this.TousLesCredits.length); // Debug line

    this.filteredPrets = this.TousLesCredits.filter(credit =>
      credit.num_contrat_credit?.toLowerCase().includes(this.searchTerm.toLowerCase()) ?? false
    );
     console.log('Filtered count:', this.filteredPrets.length);

    this.totalPages = Math.ceil(this.filteredPrets.length / this.lignesParPage);
    this.totalPages = Math.max(1, this.totalPages); 

    this.pageActuelle = Math.max(1, Math.min(this.pageActuelle, this.totalPages));

    const startIndex = (this.pageActuelle - 1) * this.lignesParPage;
    const endIndex = startIndex + this.lignesParPage;
    this.CreditsPagines = this.filteredPrets.slice(startIndex, endIndex);

     console.log(`Page ${this.pageActuelle}/${this.totalPages}. Displaying items ${startIndex + 1} to ${Math.min(endIndex, this.filteredPrets.length)} (${this.CreditsPagines.length} items).`); 
  }

  nouveauCredit() {
    this.router.navigate(['/credits/nouveau']);
  }

  selectionnerCredit(credit: CreditDto): void {
    if (this.creditSelectionne?.num_contrat_credit === credit.num_contrat_credit) {
        this.fermerDetails(); 
    } else {
        this.creditSelectionne = credit;
    }
}

  fermerDetails(): void {
      this.creditSelectionne = null;
  } 

 

  loadCredits(): void {
    this.isLoading = true;      
    this.errorMessage = null; 
    this.TousLesCredits = [];   
    this.CreditsPagines = []; 
    this.totalPages = 1;    

    this.loadCreditsSubscription?.unsubscribe();

    this.loadCreditsSubscription = this.creditService.getTousLesCredits()
      .subscribe({ 
        next: (resultat: CreditDto[]) => {
          console.log('Data received in subscribe:', resultat);
          if (Array.isArray(resultat)) {
             this.TousLesCredits =resultat; 
             this.updatePagination();     
          } else {
            console.error(resultat);
            this.TousLesCredits = [];
            this.updatePagination();
          }
          this.isLoading = false; 
        },
        error: (err) => {
          console.error(err);
          this.errorMessage = err?.message;
          this.TousLesCredits = [];    
          this.CreditsPagines = [];
          this.totalPages = 1;
          this.isLoading = false; 
        }
      });
  }




 

  
}