import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule,DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PretDetailsComponent } from './pret-details/pret-details.component';
import { CreditDto }  from '../../core/dtos/Credits/credits';
import { CreditsService } from '../../core/services/credits/credits.service';
import { catchError, Observable, of, Subscription, tap } from 'rxjs';
import { ExcelSelectionService } from '../../core/services/excel/excel-selection.service';
import { PaginationComponent } from '../../components/pagination/pagination.component';


@Component({
  selector: 'app-prets',
  standalone: true,
  imports: [CommonModule, FormsModule, PretDetailsComponent, PaginationComponent],
  template: `
    <div class="prets-container" [class.details-open]="creditSelectionne">
      <div class="prets-list">
        <div class="header">
          <h1>Crédits En Cours</h1>
          <button class="btn btn-icon" title="Annuler le filtre" *ngIf="selectedExcelFile" (click)="annulerSelection($event)">
            <i class="fas fa-times"></i>
          </button>
          <button class="btn header-btn" (click)="nouveauCredit()" *ngIf="selectedExcelFile">
            <span>Nouveau</span>
            <i class="fas fa-plus"></i>
          </button>
        </div>

        <div class="filters">
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input type="text" placeholder="Rechercher un crédit..." [(ngModel)]="searchTerm" (input)="onSearch()">
          </div>
          <div class="date-filters">
            <div class="date-input">
              <label>Du:</label>
              <input type="date" [(ngModel)]="dateDebut" (change)="filtrerParDate()">
            </div>
            <div class="date-input">
              <label>Au:</label>
              <input type="date" [(ngModel)]="dateFin" (change)="filtrerParDate()">
            </div>
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
                    [class.highlight-excel]="selectedExcelFile && credit.id_excel === selectedExcelFile.id_fichier_excel"
                >                  
                  <td class="collante">{{credit.num_contrat_credit}}</td>
                  <td>{{credit.date_declaration}}</td>
                  <td>{{credit.libelle_situation}}</td>
                  <td>{{credit.libelle_type_credit}}</td>
                  <td>{{credit.libelle_activite}}</td>
                </tr>
                <tr *ngIf="CreditsPagines.length === 0">
                  <td colspan="5" class="no-data">Aucun crédit trouvé</td>
                </tr>
            </tbody>
          </table>
        </div>

        <div class="pagination-container">
          <app-pagination
            [lignesTotales]="CreditsFiltres.length"
            [pageActuelle]="pageActuelle"
            (changeurPage)="changerPage($event)"
          ></app-pagination>
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
  styles: [
    `
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

    .pagination-container {
      padding: 1rem 0;
      background-color: var(--background-color);
      border-top: 1px solid var(--border-color);
      margin-top: auto;
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1rem;
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
      min-height: 200px;
      
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
          &.highlight-excel {
            td {
              background-color: #ff1744 !important;
              color: #fff !important;
              font-weight: bold;
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

      .date-filters {
        display: flex;
        gap: 1rem;
        align-items: center;

        .date-input {
          display: flex;
          align-items: center;
          gap: 0.5rem;

          label {
            color: var(--text-color);
            font-size: 0.875rem;
          }

          input[type="date"] {
            padding: 0.5rem;
            border: 1px solid var(--border-color);
            border-radius: 4px;
            font-size: 0.875rem;
            color: var(--text-color);
            background-color: white;

            &:focus {
              outline: none;
              border-color: var(--primary-color);
            }
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
        background-color: #f8f9fa;
        th {
          background-color: inherit;
        }
      }
      
      tbody tr {
        background-color: white;
        
        &:hover {
          background-color: #f2f2f2;
        }
        
        td {
          background-color: inherit;
        }
      }
    }
    
    /* Highlight Excel row */
    .highlight-excel td {
      background-color: #fffde7 !important;
    }

    .no-data {
      text-align: center;
      padding: 2rem;
      color: var(--text-color-light);
      font-style: italic;
    }
    `
  ]
})
export class PretsComponent implements OnInit {
  credits$: Observable<CreditDto[]> | undefined;
  private TousLesCredits: CreditDto[] = []; 
  private loadCreditsSubscription: Subscription | undefined;
  isLoading: boolean = false; 
  selectedExcelFile: any = null;

  searchTerm: string = '';
  dateDebut: string = '';
  dateFin: string = '';
  creditSelectionne: CreditDto | null = null;

  pageActuelle: number = 1;
  lignesParPage: number = 5;
  PagesTotales: number = 1;
  CreditsPagines: CreditDto[] = [];
  CreditsFiltres: CreditDto[] = []; 

  errorMessage: string | null = null;
  excelSelectionSubscription: Subscription;


  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const id_excel = params['id_excel'];
      if (id_excel) {
        this.selectedExcelFile = { id_fichier_excel: +id_excel };
        this.CreditsFiltres = this.CreditsFiltres.filter(c => c.id_excel === +id_excel);
        this.updatePagination();
      } else {
        this.selectedExcelFile = null;
      }
    });
    // Subscribe to the cached credits
    this.creditService.getCreditsActuelles().subscribe(credits => {
      this.TousLesCredits = credits;
      this.route.queryParams.subscribe(params => {
        const fichierId = params['fichierId'];
        if (fichierId) {
          this.CreditsFiltres = this.TousLesCredits.filter(credit => credit.id_excel === fichierId);
        } else {
          this.CreditsFiltres = this.TousLesCredits;
        }
        this.updatePagination();
      });
    });

    // Initial load or refresh of credits
    this.loadCredits();
}

  constructor(
    private router: Router,
    private creditService: CreditsService,
    private excelSelectionService: ExcelSelectionService,
    private route: ActivatedRoute
  ) {
    this.excelSelectionSubscription = this.excelSelectionService.selectedExcel$.subscribe(excel => {
      this.selectedExcelFile = excel;
    });
  }
  ngOnDestroy() {
    if (this.excelSelectionSubscription) {
      this.excelSelectionSubscription.unsubscribe();
    }
  }

  onSearch() {
    this.pageActuelle = 1;
    this.updatePagination();
  }

  filtrerParDate() {
    this.pageActuelle = 1;
    
    const filteredCredits = this.TousLesCredits.filter(credit => {
      if (!credit.date_declaration) return false;
      
      const creditDate = new Date(credit.date_declaration);
      if (isNaN(creditDate.getTime())) return false;
      
      const dateDebutValid = this.dateDebut ? new Date(this.dateDebut) : null;
      const dateFinValid = this.dateFin ? new Date(this.dateFin) : null;
      
      if (dateDebutValid && dateFinValid) {
        return creditDate >= dateDebutValid && creditDate <= dateFinValid;
      } else if (dateDebutValid) {
        return creditDate >= dateDebutValid;
      } else if (dateFinValid) {
        return creditDate <= dateFinValid;
      }
      
      return true;
    });

    this.CreditsFiltres = filteredCredits;
    this.updatePagination();
  }

  changerPage(page: number) {
    this.pageActuelle = page;
    this.updatePagination();
  }

  

  updatePagination(): void {
    this.CreditsFiltres = this.TousLesCredits.filter(credit =>
      credit.num_contrat_credit?.toLowerCase().includes(this.searchTerm.toLowerCase()) ?? false
    );

    this.PagesTotales = Math.ceil(this.CreditsFiltres.length / this.lignesParPage);
    this.PagesTotales = Math.max(1, this.PagesTotales); 

    this.pageActuelle = Math.max(1, Math.min(this.pageActuelle, this.PagesTotales));

    const startIndex = (this.pageActuelle - 1) * this.lignesParPage;
    const endIndex = startIndex + this.lignesParPage;
    this.CreditsPagines = this.CreditsFiltres.slice(startIndex, endIndex);
  }

  async nouveauCredit() {
    try {
      console.log('Starting navigation...');
      console.log('Selected Excel File:', this.selectedExcelFile);
      
      const navigationExtras = this.selectedExcelFile?.id_fichier_excel 
        ? { 
            queryParams: { id_excel: this.selectedExcelFile.id_fichier_excel },
            queryParamsHandling: 'merge' as const
          }
        : undefined;
      
      console.log('Navigation extras:', navigationExtras);
      
      const result = await this.router.navigate(
        ['/credits/nouveau'], 
        navigationExtras
      );
      
      console.log('Navigation result:', result);
      
      if (!result) {
        console.error('Navigation failed: No route matched');
      }
    } catch (error) {
      console.error('Navigation error:', error);
    }
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

    this.loadCreditsSubscription?.unsubscribe();
    this.loadCreditsSubscription = this.creditService.getTousLesCredits()
      .subscribe({ 
        error: (err) => {
          console.error(err);
          this.errorMessage = err?.message;
          this.isLoading = false; 
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }


  annulerSelection(event: Event) {
    event.stopPropagation();
    this.selectedExcelFile = null;
    this.CreditsFiltres = this.TousLesCredits;
    this.updatePagination();
  }

 

  
}

 
