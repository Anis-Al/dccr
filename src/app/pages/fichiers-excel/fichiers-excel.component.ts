import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExcelCrudService } from '../../core/services/excel/excel-crud.service';
import { ExcelMetadonneesDto } from '../../core/dtos/Excel/excel-metadonnees-dto';
import { Router } from '@angular/router';
import { PaginationComponent } from '../../components/pagination/pagination.component';
import { CreditDto } from '../../core/dtos/Credits/credits';
import { CreditsService } from '../../core/services/credits/credits.service';
import { Observable, Subscription } from 'rxjs';
import { PretDetailsComponent } from '../prets/pret-details/pret-details.component';

@Component({
  selector: 'app-fichiers-excel',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent, DatePipe, PretDetailsComponent],
  template: `
    <!-- Excel Files View -->
    <div class="prets-container" [class.details-open]="creditSelectionne" *ngIf="!fichierSelectionne">
      <div class="prets-list">
        <div class="header">
          <h1>Fichiers d'Entrée En Cours</h1>
        </div>

        <div class="filters">
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input type="text" placeholder="Rechercher un fichier..." [(ngModel)]="searchTerm" (input)="onSearch()">
          </div>
          <div class="date-filters">
            <div class="date-input">
              <label>Du:</label>
              <input type="date" [(ngModel)]="dateDebut" (change)="filtrerParDate()" placeholder="YYYY-MM-DD" [max]="today">
            </div>
            <div class="date-input">
              <label>Au:</label>
              <input type="date" [(ngModel)]="dateFin" (change)="filtrerParDate()" placeholder="YYYY-MM-DD" [max]="today">
            </div>
          </div>
        </div>

        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th class="collante">Nom du fichier</th>
                <th>Date d'intégration</th>
                <th>Intégrateur</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let fichier of FichiersExcelPagines; trackBy: trackByFichier" 
                  (click)="onRowClick($event, fichier)"
                  class="clickable-row"
                  title="Voir ses crédits">
                <td class="collante">{{ fichier.nom_fichier_excel }}</td>  
                <td>{{ fichier.date_heure_integration_excel | date:'dd/MM/yyyy HH:mm' }}</td>
                <td>{{ fichier.integrateur }}</td>
                <td>
                  <div class="actions" (click)="$event.stopPropagation()">
                    <button class="btn-icon" (click)="supprimerFichier(fichier)">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="FichiersExcelPagines.length === 0">
                <td colspan="4" class="no-data">Aucun fichier trouvé</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="pagination-container">
          <app-pagination
            [lignesTotales]="fichiersFiltres.length"
            [pageActuelle]="pageActuelle"
            (changeurPage)="changePage($event)">
          </app-pagination>
        </div>
      </div>
    </div>

    <!-- Credits View (Full Screen) -->
    <div class="prets-container" [class.details-open]="creditSelectionne" *ngIf="fichierSelectionne">
      <div class="prets-list">
        <div class="header">
          <div>
            <div class="breadcrumb" *ngIf="fichierSelectionne">
              <a (click)="fermerCredits()">Fichiers d'Entrée</a>
              <i class="fas fa-chevron-right"></i>
              <span>{{ fichierSelectionne.nom_fichier_excel }}</span>
            </div>
            <h1>Crédits En Cours<small style="font-size: 0.875rem; opacity: 0.8;">- {{ fichierSelectionne.nom_fichier_excel }}</small></h1>
          </div>
          <div class="header-actions">
            <button class="btn btn-secondary" (click)="fermerCredits()">
              <i class="fas fa-arrow-left"></i>
              <span>Retour</span>
            </button>
            <button class="btn btn-primary" (click)="ajouterNouveauCredit()">
              <i class="fas fa-plus"></i>
              <span>Nouveau</span>
            </button>
          </div>
        </div>

        <div class="filters">
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input type="text" placeholder="Rechercher un crédit..." [(ngModel)]="creditSearchTerm" (input)="onCreditSearch()">
          </div>
          <div class="date-filters">
            <div class="date-select">
              <label>Date de Déclaration:</label>
              <select [(ngModel)]="selectedDate" (change)="filtrerCreditParDate()">
                <option value="">Toutes les dates</option>
                <option *ngFor="let date of datesDeclaration" [value]="date">{{date}}</option>
              </select>
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
              <tr *ngFor="let credit of creditsPagines"
                  (click)="selectionnerCredit(credit)"
                  [class.selected]="creditSelectionne?.num_contrat_credit === credit.num_contrat_credit">
                <td class="collante">{{credit.num_contrat_credit}}</td>
                <td>{{credit.date_declaration |date:'dd/MM/yyyy'}}</td>
                <td>{{credit.libelle_situation}}</td>
                <td>{{credit.libelle_type_credit}}</td>
                <td>{{credit.libelle_activite}}</td>
              </tr>
              <tr *ngIf="creditsPagines.length === 0">
                <td colspan="5" class="no-data">Aucun crédit trouvé</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="pagination-container">
          <app-pagination
            [lignesTotales]="creditsFiltres.length"
            [pageActuelle]="creditPageActuelle"
            (changeurPage)="changerCreditPage($event)">
          </app-pagination>
        </div>
      </div>

      <div class="details-panel" *ngIf="creditSelectionne">
        <app-pret-details 
          [pret]="creditSelectionne" 
          (close)="fermerDetails()">
        </app-pret-details>
      </div>
    </div>
  `,
  styles: [`
    .breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  color: var(--text-color-light);

  a {
    color: var(--primary-color);
    text-decoration: none;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }

  i {
    font-size: 0.75rem;
    opacity: 0.5;
  }

  span {
    color: var(--text-color);
  }
}
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

      .btn {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.5rem 1rem;
        border-radius: 4px;
        font-size: 0.875rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        border: 1px solid transparent;

        i {
          font-size: 0.875rem;
        }

        &-primary {
          background-color: var(--primary-color);
          color: white;
          border-color: var(--primary-color);

          &:hover {
            background-color: darken(#000000, 5%);
          }
        }

        &-secondary {
          background-color: #f5f5f5;
          color: var(--text-color);
          border-color: #ddd;

          &:hover {
            background-color: #e9e9e9;
          }
        }
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
        
        .date-select {
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
            min-width: 150px;
            
            &:focus {
              outline: none;
              border-color: var(--primary-color);
            }
          }
        }
        
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
        
        th:last-child, td:last-child {
          width: 80px;
          text-align: center;
        }

        thead tr {
          background-color: #f8f9fa !important;
        }
        
        tbody tr {
          background-color: white !important;
          
          &:hover {
            background-color: #f2f2f2 !important;
            cursor: pointer;
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
          &.selected {
            td {
              background-color: var(--primary-color-light) !important;
            }
          }
          
          &:hover {
            td {
              background-color: var(--hover-color);
            }
          }
        }
      }
    }

    .pagination-container {
      padding: 1rem 0;
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
      margin: 0 auto;

      &:hover {
        opacity: 1;
        background-color: rgba(0, 0, 0, 0.05);
      }
    }
    
    .actions {
      display: flex;
      justify-content: center;
      width: 100%;
    }

    .clickable-row {
      cursor: pointer;
      
      &:hover {
        background-color: var(--hover-color) !important;
      }
    }
  `]
})
export class FichiersExcelComponent implements OnInit {

  fichiers: ExcelMetadonneesDto[] = [];
  fichiersFiltres: ExcelMetadonneesDto[] = [];
  FichiersExcelPagines: ExcelMetadonneesDto[] = [];
  fichierSelectionne: ExcelMetadonneesDto | null = null;
  
  pageActuelle = 1;
  lignesParPage = 5;
  totalPages = 1;
  
  searchTerm = '';
  dateDebut: string | null = null;
  dateFin: string | null = null;
  today: string = new Date().toISOString().split('T')[0];
  
  tousLesCredits: CreditDto[] = [];
  creditsFiltres: CreditDto[] = [];
  creditsPagines: CreditDto[] = [];
  creditSelectionne: CreditDto | null = null;
  
  creditPageActuelle = 1;
  creditLignesParPage = 5;
  creditPagesTotales = 1;
  
  creditSearchTerm = '';
  selectedDate = '';
  datesDeclaration: string[] = [];
  
  private loadCreditsSubscription: Subscription | undefined;
  isLoading = false;

  constructor(
    private excelCrudService: ExcelCrudService, 
    private router: Router,
    private creditService: CreditsService
  ) {}

  ngOnInit() {
    this.getTousLesMetadonneesduExcel();
  }

  getTousLesMetadonneesduExcel() {
    this.excelCrudService.getTousLesMetadonneesDuExcel()
      .subscribe({
        next: (metadonnees) => {
          this.fichiers = metadonnees;
          this.fichiersFiltres = [...this.fichiers];
          this.updatePagination();
        },
        error: (error) => {
          console.error(error);
        }
      });
  }

  updatePagination() {
    const startIndex = (this.pageActuelle - 1) * this.lignesParPage;
    const endIndex = startIndex + this.lignesParPage;
    this.FichiersExcelPagines = this.fichiersFiltres.slice(startIndex, endIndex);
    this.totalPages = Math.ceil(this.fichiersFiltres.length / this.lignesParPage);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.pageActuelle = page;
      this.updatePagination();
    }
  }

  onSearch() {
    this.filtrerFichiers();
  }

  filtrerParDate() {
    this.filtrerFichiers();
  }

  filtrerFichiers() {
    this.fichiersFiltres = this.fichiers.filter(fichier => {
      const matchesSearch = !this.searchTerm || 
        fichier.nom_fichier_excel.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        fichier.integrateur.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      let matchesDateRange = true;
      if (this.dateDebut || this.dateFin) {
        const fichierDate = new Date(fichier.date_heure_integration_excel);
        
        if (this.dateDebut) {
          const debut = new Date(this.dateDebut);
          matchesDateRange = matchesDateRange && fichierDate >= debut;
        }
        
        if (this.dateFin) {
          const fin = new Date(this.dateFin);
          fin.setHours(23, 59, 59, 999); 
          matchesDateRange = matchesDateRange && fichierDate <= fin;
        }
      }
      
      return matchesSearch && matchesDateRange;
    });
    
    this.pageActuelle = 1;
    this.updatePagination();
  }

  trackByFichier(index: number, fichier: ExcelMetadonneesDto): number {
    return fichier.id_fichier_excel; 
  }
  
  onRowClick(event: MouseEvent, fichier: ExcelMetadonneesDto) {
    const target = event.target as HTMLElement;
    if (target.closest('.actions')) {
      return;
    }
    this.fichierSelectionne = fichier;
    this.creditPageActuelle = 1;
    this.creditSearchTerm = '';
    this.selectedDate = '';
    this.loadCreditsForFichier(fichier.id_fichier_excel);
  }

  supprimerFichier(fichier: ExcelMetadonneesDto) {
    if (confirm(`Sûr de vouloir supprimer ce fichier : "${fichier.nom_fichier_excel}" ?`)) {
      this.excelCrudService.supprimerFichierExcel(fichier.id_fichier_excel)
        .subscribe({
          next: () => {
            this.getTousLesMetadonneesduExcel();
          },
          error: (error) => {
            console.error( error);
          }
        });
    }
  }

  loadCreditsForFichier(idExcel: number) {
    this.isLoading = true;
    this.loadCreditsSubscription?.unsubscribe();
    
    this.loadCreditsSubscription = this.creditService.getTousLesCredits()
      .subscribe({
        next: (credits) => {
          this.tousLesCredits = credits
            .filter(credit => credit.id_excel === idExcel)
            .map(credit => ({
              ...credit,
            }));
          
          this.extractUniqueDates();
          this.updateCreditPagination();
          this.isLoading = false;
        },
        error: (err) => {
          console.error(err);
          this.isLoading = false;
        }
      });
  }
  
  formatDate(dateString: string | null | undefined): string {
    if (!dateString) return '';
    
    if (dateString.includes('/')) return dateString;
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  }
  
  extractUniqueDates() {
    const uniqueDates = new Set<string>();
    
    // Ajouter toutes les dates de déclaration au set
    this.tousLesCredits.forEach(credit => {
      if (credit.date_declaration) {
        uniqueDates.add(credit.date_declaration);
      }
    });
    
    this.datesDeclaration = Array.from(uniqueDates).sort((a, b) => {
      const [dayA, monthA, yearA] = a.split('/').map(Number);
      const [dayB, monthB, yearB] = b.split('/').map(Number);
      
      const dateA = new Date(yearA, monthA - 1, dayA);
      const dateB = new Date(yearB, monthB - 1, dayB);
      
      return dateA.getTime() - dateB.getTime();
    });
  }
  
  updateCreditPagination() {
    let filteredCredits = JSON.parse(JSON.stringify(this.tousLesCredits));

    if (this.creditSearchTerm) {
      filteredCredits = filteredCredits.filter((credit: CreditDto) =>
        credit.num_contrat_credit?.toLowerCase().includes(this.creditSearchTerm.toLowerCase()) ?? false
      );
    }

    if (this.selectedDate) {
      filteredCredits = filteredCredits.filter((credit: CreditDto) => {
        if (!credit.date_declaration) return false;
        return credit.date_declaration === this.selectedDate;
      });
    }

    this.creditsFiltres = filteredCredits;
    this.creditPagesTotales = Math.ceil(this.creditsFiltres.length / this.creditLignesParPage);
    this.creditPagesTotales = Math.max(1, this.creditPagesTotales);
    this.creditPageActuelle = Math.max(1, Math.min(this.creditPageActuelle, this.creditPagesTotales));

    const startIndex = (this.creditPageActuelle - 1) * this.creditLignesParPage;
    const endIndex = startIndex + this.creditLignesParPage;
    this.creditsPagines = this.creditsFiltres.slice(startIndex, endIndex);
  }
  
  onCreditSearch() {
    this.creditPageActuelle = 1;
    this.updateCreditPagination();
  }
  
  filtrerCreditParDate() {
    this.creditPageActuelle = 1;
    this.updateCreditPagination();
  }
  
  changerCreditPage(page: number) {
    this.creditPageActuelle = page;
    this.updateCreditPagination();
  }
  
  selectionnerCredit(credit: CreditDto) {
    if (this.creditSelectionne?.num_contrat_credit === credit.num_contrat_credit) {
      this.fermerDetails();
    } else {
      this.creditSelectionne = credit;
    }
  }
  
  fermerDetails() {
    this.creditSelectionne = null;
  }
  
  fermerCredits() {
    this.fichierSelectionne = null;
    this.creditSelectionne = null;
    this.creditSearchTerm = '';
    this.selectedDate = '';
    this.creditPageActuelle = 1;
  }
  
  ajouterNouveauCredit() {
    if (this.fichierSelectionne) {
      this.router.navigate(['/credits/nouveau'], {
        queryParams: { id_excel: this.fichierSelectionne.id_fichier_excel }
      });
    }
  }
  
  ngOnDestroy() {
    if (this.loadCreditsSubscription) {
      this.loadCreditsSubscription.unsubscribe();
    }
  }
}

