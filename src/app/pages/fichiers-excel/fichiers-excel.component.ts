import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExcelCrudService } from '../../core/services/excel/excel-crud.service';
import { ExcelMetadonneesDto } from '../../core/dtos/Excel/excel-metadonnees-dto';
import { Router } from '@angular/router';
import { PaginationComponent } from '../../components/pagination/pagination.component';



@Component({
  selector: 'app-fichiers-excel',
  standalone: true,
  imports: [CommonModule, PaginationComponent, FormsModule],
  template: `
      <div class="liste-fichiers">
      <h1>Fichiers En Cours </h1>

      <div class="filters card">
        <div class="form-grid">
          <div class="form-group">
            <label>Rechercher</label>
            <div class="input-with-icon">
              <i class="fas fa-search"></i>
              <input type="text" class="form-control" placeholder="Nom du fichier ou intégrateur" [(ngModel)]="searchTerm" (input)="onSearch()">
            </div>
          </div>

          <div class="form-group">
            <label>Date d'intégration</label>
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
        </div>
      </div>

        <div class="table-responsive">
          <table class="table fichiers-table">
            <thead>
              <tr>
                <th>Nom du fichier</th>
                <th>Date d'intégration</th>
                <th>Intégrateur</th>
                <th>Actions</th>

              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let fichier of FichiersExcelPagines; trackBy: trackByFichier" (click)="onRowClick($event, fichier)" class="clickable-row">
                <td title="Voir ses crédits">{{ fichier.nom_fichier_excel }}</td>
                <td title="Voir ses crédits">{{ fichier.date_heure_integration_excel | date:'dd/MM/yyyy HH:mm' }}</td>
                <td title="Voir ses crédits">{{ fichier.integrateur }}</td>
                <td>
                  <div class="actions" (click)="$event.stopPropagation()">
                    <button class="btn-icon" title="Supprimer">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

        <div class="pagination-container">
          <app-pagination
            [lignesTotales]="fichiersFiltres.length"
            [pageActuelle]="pageActuelle"
            (changeurPage)="changePage($event)"
          ></app-pagination>
        </div>
      </div>
    </div>
  `, 
  styles: [`
    .card {
      background-color: #ffffff;
      border: none;
    }
    
    .liste-fichiers {
      padding: 1rem;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .table-responsive {
      overflow-x: auto;
      margin: 0 -1rem;
      padding: 0 1rem;
    }

    .actions {
      display: flex;
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


    .input-with-icon {
      position: relative;

      i {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 1rem;
        color: var(--text-color);
        opacity: 0.7;
      }

      input {
        padding-left: 2.5rem;
      }
    }

    .date-filters {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      flex-wrap: wrap;

      .date-input {
        display: flex;
        align-items: center;
        gap: 0.3rem;

        label {
          white-space: nowrap;
          font-size: 0.875rem;
          color: var(--text-color);
        }

        input[type="date"] {
          padding: 0.3rem;
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


    .fichiers-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;

      thead tr {
        background-color: #f8f9fa !important;
        position: sticky;
        top: 0;
      }

      tbody tr {
        background-color: white !important;
        position: relative;
        transition: background 0.2s;
        
        &:hover {
          cursor: pointer;
          background: rgba(0, 0, 0, 0.02) !important;
        }
      }
    }

    /* Native browser tooltip styling */
    [title] {
      position: relative;
      
      &:hover::after {
        content: attr(title);
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        background-color: #333;
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        white-space: nowrap;
        z-index: 1000;
        pointer-events: none;
        opacity: 0.9;
        margin-bottom: 5px;
      }
    }
  `]
})
export class FichiersExcelComponent implements OnInit {
  fichiers: ExcelMetadonneesDto[] = [];
  fichiersFiltres: ExcelMetadonneesDto[] = [];
  dateDebut: string = '';
  dateFin: string = '';
  searchTerm: string = '';

  constructor(private excelCrudService: ExcelCrudService, private router: Router) {
    this.updatePagination();
  }

  ngOnInit() {
    this.getTousLesMetadonneesduExcel();
  }

  pageActuelle = 1;
  lignesParPage = 5;
  FichiersExcelPagines: ExcelMetadonneesDto[] = [];
  totalPages = 2;


  getTousLesMetadonneesduExcel() {
    this.excelCrudService.getTousLesMetadonneesDuExcel()
      .subscribe({
        next: (metadonnees) => {
          this.fichiers = metadonnees;
          this.updatePagination();
        },
        error: (error) => {
          console.error(error);
        }
      });
  }

  updatePagination() {
    // Apply search filter
    this.fichiersFiltres = this.fichiers.filter(fichier =>
      fichier.nom_fichier_excel?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      fichier.integrateur?.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    // Apply date filter
    if (this.dateDebut || this.dateFin) {
      this.fichiersFiltres = this.fichiersFiltres.filter(fichier => {
        if (!fichier.date_heure_integration_excel) return false;
        
        const fichierDate = new Date(fichier.date_heure_integration_excel);
        if (isNaN(fichierDate.getTime())) return false;
        
        const dateDebutValid = this.dateDebut ? new Date(this.dateDebut) : null;
        const dateFinValid = this.dateFin ? new Date(this.dateFin) : null;
        
        if (dateDebutValid && dateFinValid) {
          return fichierDate >= dateDebutValid && fichierDate <= dateFinValid;
        } else if (dateDebutValid) {
          return fichierDate >= dateDebutValid;
        } else if (dateFinValid) {
          return fichierDate <= dateFinValid;
        }
        
        return true;
      });
    }

    // Update pagination
    const startIndex = (this.pageActuelle - 1) * this.lignesParPage;
    const endIndex = startIndex + this.lignesParPage;
    this.FichiersExcelPagines = this.fichiersFiltres.slice(startIndex, endIndex);
    this.totalPages = Math.max(1, Math.ceil(this.fichiersFiltres.length / this.lignesParPage));
    this.pageActuelle = Math.max(1, Math.min(this.pageActuelle, this.totalPages));
  }

  onSearch() {
    this.pageActuelle = 1;
    this.updatePagination();
  }

  filtrerParDate() {
    this.pageActuelle = 1;
    this.updatePagination();
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.pageActuelle = page;
      this.updatePagination();
    }
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