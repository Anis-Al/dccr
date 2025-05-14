import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExcelCrudService } from '../../core/services/excel/excel-crud.service';
import { ExcelMetadonneesDto } from '../../core/dtos/Excel/excel-metadonnees-dto';
import { Router } from '@angular/router';
import { PaginationComponent } from '../../components/pagination/pagination.component';

@Component({
  selector: 'app-fichiers-excel',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent],
  template: `
    <div class="fichiers-container">
      <div class="fichiers-list">
        <div class="header">
          <h1>Fichiers En Cours</h1>
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
                <th>Nom du fichier</th>
                <th>Date d'intégration</th>
                <th>Intégrateur</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let fichier of FichiersExcelPagines; trackBy: trackByFichier" 
                  (click)="onRowClick($event, fichier)"
                  class="clickable-row"
                  title="Voir ses crédits"
                  >
                <td>{{ fichier.nom_fichier_excel }}</td>  
                <td>{{ fichier.date_heure_integration_excel | date:'dd/MM/yyyy HH:mm' }}</td>
                <td>{{ fichier.integrateur }}</td>
                <td>
                  <div class="actions" (click)="$event.stopPropagation()">
                    <button class="btn-icon">
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
  `,
  styles: [`
    .fichiers-container {
      padding: 1rem;
    }

    .fichiers-list {
      width: 100%;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .header-actions {
      display: flex;
      gap: 0.5rem;
    }

    .btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border-radius: 0.25rem;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .btn-primary {
      background-color: var(--primary-color, #ff2d30);
      color: white;
      border: none;
    }

    .btn-secondary {
      background-color: #e9ecef;
      color: #495057;
      border: none;
    }

    .filters {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 1rem;
      padding: 1rem;
      background-color: #f8f9fa;
      border-radius: 0.5rem;
    }

    .search-box {
      position: relative;
      flex: 1;
      min-width: 200px;
    }

    .search-box i {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: #6c757d;
    }

    .search-box input {
      width: 100%;
      padding: 0.5rem 1rem 0.5rem 2.5rem;
      border: 1px solid #ced4da;
      border-radius: 0.25rem;
    }

    .date-filters {
      display: flex;
      gap: 1rem;
    }

    .date-input {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .date-input label {
      white-space: nowrap;
    }

    .date-input input {
      padding: 0.5rem;
      border: 1px solid #ced4da;
      border-radius: 0.25rem;
    }

    .table-container {
      margin-bottom: 1rem;
      border-radius: 0.5rem;
      overflow: hidden;
      box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th, td {
      padding: 0.75rem;
      text-align: left;
      border-bottom: 1px solid #dee2e6;
    }

    th {
      background-color: #f8f9fa;
      font-weight: 600;
    }

    .clickable-row {
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .clickable-row:hover {
      background-color: rgba(190, 0, 0, 0.1);
    }

    .actions {
      display: flex;
      justify-content: center;
    }

    .btn-icon {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.25rem;
      color: var(--text-color, #212529);
      opacity: 0.7;
    }

    .btn-icon:hover {
      opacity: 1;
    }

    .no-data {
      text-align: center;
      color: #6c757d;
      padding: 2rem;
    }

    .pagination-container {
      margin-top: 1rem;
    }
  `]
})
export class FichiersExcelComponent implements OnInit {
  fichiers: ExcelMetadonneesDto[] = [];
  fichiersFiltres: ExcelMetadonneesDto[] = [];
  FichiersExcelPagines: ExcelMetadonneesDto[] = [];
  
  pageActuelle = 1;
  lignesParPage = 5;
  totalPages = 1;
  
  searchTerm = '';
  dateDebut: string | null = null;
  dateFin: string | null = null;

  constructor(private excelCrudService: ExcelCrudService, private router: Router) {}

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
      // Filter by search term
      const matchesSearch = !this.searchTerm || 
        fichier.nom_fichier_excel.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        fichier.integrateur.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      // Filter by date range
      let matchesDateRange = true;
      if (this.dateDebut || this.dateFin) {
        const fichierDate = new Date(fichier.date_heure_integration_excel);
        
        if (this.dateDebut) {
          const debut = new Date(this.dateDebut);
          matchesDateRange = matchesDateRange && fichierDate >= debut;
        }
        
        if (this.dateFin) {
          const fin = new Date(this.dateFin);
          fin.setHours(23, 59, 59, 999); // End of day
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
    // Prevent navigation if the click is inside the actions column
    const target = event.target as HTMLElement;
    if (target.closest('.actions')) {
      return;
    }
    this.router.navigate(['/credits'], { queryParams: { id_excel: fichier.id_fichier_excel } });
  }

  
}