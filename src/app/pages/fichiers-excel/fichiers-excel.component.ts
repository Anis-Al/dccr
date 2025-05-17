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
    <div class="fichiers-container" [class.details-open]="creditSelectionne">
      <div class="fichiers-list" [class.with-credits]="fichierSelectionne">
        <div class="header">
          <h1>Fichiers d'Entrée En Cours</h1>
          <div class="header-actions">
            <span>
            </span>
          </div>
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
                  [class.selected]="fichierSelectionne?.id_fichier_excel === fichier.id_fichier_excel"
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
      
      <div class="credits-section" *ngIf="fichierSelectionne">
        <div class="header">
          <h2>Crédits du fichier: {{ fichierSelectionne.nom_fichier_excel }}</h2>
          <div class="header-actions">
            <button class="btn btn-primary" (click)="ajouterNouveauCredit()">
              <i class="fas fa-plus"></i> Nouveau
            </button>
            <button class="btn btn-secondary close-btn" (click)="fermerCredits()">
              <i class="fas fa-times"></i>
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
                <td>{{credit.date_declaration}}</td>
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
      
      <!-- Panneau de détails du crédit -->
      <div class="details-panel" *ngIf="creditSelectionne">
        <app-pret-details 
          [pret]="creditSelectionne" 
          (close)="fermerDetails()">
        </app-pret-details>
      </div>
    </div>
  `,
  styles: [`
    .fichiers-container {
      display: flex;
      height: 100%;
      position: relative;
    }

    .fichiers-list {
      width: 100%;
      overflow: auto;
      padding: 1rem;
      transition: width 0.3s ease;
    }
    
    .fichiers-list.with-credits {
      width: 40%;
    }
    
    .credits-section {
      width: 60%;
      padding: 1rem;
      border-left: 1px solid var(--border-color);
      overflow: auto;
      background-color: var(--background-color);
    }
    
    .details-panel {
      position: fixed;
      top: 0;
      right: 0;
      width: 40%;
      height: 100%;
      background-color: white;
      box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
      z-index: 1000;
      overflow-y: auto;
      padding: 1rem;
    }
    
    .fichiers-container.details-open .credits-section {
      width: 40%;
    }
    
    .close-btn {
      padding: 0.5rem;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--border-color);

      h1, h2 {
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
          &:hover {
            td {
              background-color: var(--hover-color);
            }
          }
          
          &.selected {
            td {
              background-color: var(--primary-color-light, #e3f2fd);
            }
            td.collante {
              border-left: 3px solid var(--primary-color, #1976d2);
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
      
      &.btn-secondary {
        background-color: var(white, #f5f5f5);
        color: var(--text-color, #333);
        
        &:hover {
          background-color: var(--border-color, #e0e0e0);
        }
      }
    }

    .actions {
      display: flex;
      justify-content: center;
      width: 100%;
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
    if (confirm(`Sur de vouloir supprimer ce fichier : "${fichier.nom_fichier_excel}" ?`)) {
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
              date_declaration: this.formatDate(credit.date_declaration)
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
    this.tousLesCredits = [];
    this.creditsFiltres = [];
    this.creditsPagines = [];
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