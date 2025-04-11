import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ExcelFile {
  id: string;
  nom: string;
  chemin: string;
  dateIntegration: Date;
  integrateur: string;
}

@Component({
  selector: 'app-fichiers-excel',
  standalone: true,
  imports: [CommonModule],
  template: `
      <div class="liste-fichiers">
      <h1>Fichiers En Cours </h1>

      <div class="filters card">
        <div class="form-grid">
          <div class="form-group">
            <label>Rechercher</label>
            <div class="input-with-icon">
              <i class="fas fa-search"></i>
              <input type="text" class="form-control" placeholder="Nom du fichier">
            </div>
          </div>

          <div class="form-group">
            <label>Date d'intégration</label>
            <select class="form-control">
              <option value="today">Aujourd'hui</option>
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
            </select>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="table-responsive">
          <table class="table fichiers-table">
            <thead>
              <tr>
                <th>Nom du fichier</th>
                <th>Chemin</th>
                <th>Date d'intégration</th>
                <th>Intégrateur</th>
                <th>Actions</th>

              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let fichier of paginatedFiles">
                <td>{{ fichier.nom }}</td>
                <td>{{ fichier.chemin }}</td>
                <td>{{ fichier.dateIntegration | date:'dd/MM/yyyy HH:mm' }}</td>
                <td>{{ fichier.integrateur }}</td>
                
                <td>
                <div class="actions">
                  
                  <button class="btn-icon" >
                    <i class="fas fa-trash"></i>
                  </button>
                  
                </div>
              </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="pagination" *ngIf="totalPages > 1">
          <button class="btn" [disabled]="pageActuelle === 1" (click)="changePage(pageActuelle - 1)">
            <i class="fas fa-chevron-left"></i>
          </button>
          <span class="page-info">Page {{ pageActuelle }} sur {{ totalPages }}</span>
          <button class="btn" [disabled]="pageActuelle === totalPages" (click)="changePage(pageActuelle + 1)">
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  `, 
  styles: [`
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

    .status-badge.validé {
      background-color: #e8f5e9;
      color: green;
    }

    .status-badge.non-validé {
      background-color: #ffebee;
      color: red;
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 1rem;
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
    }

    .input-with-icon i {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: 1rem;
      color: var(--text-color);
      opacity: 0.7;
    }

    .input-with-icon input {
      padding-left: 2.5rem;
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
      }

      th, td {
        padding: 0.75rem;
        text-align: left;
        border-bottom: 1px solid #dee2e6;
      }
    }
  `]
})
export class FichiersExcelComponent {
  pageActuelle = 1;
  lignesParPage = 3;
  paginatedFiles: ExcelFile[] = [];
  totalPages = 2;

  fichiers: ExcelFile[] = [
    {
      id: '1',
      nom: 'clients_mars_2024.xlsx',
      chemin: 'Downloads/clients_mars_2024.xlsx',     
      dateIntegration: new Date('2024-03-20T14:30:00'),
      integrateur: 'Alim Anis',
     
    },
    {
      id: '2',
      nom: 'clients_fevrier_2024.xlsx',
      chemin: 'Downloads/clients_fevrier_2024.xlsx',
      dateIntegration: new Date('2024-02-15T09:00:00'),     
      integrateur: 'Alim Anis',
    },
    {
      id: '3',
      nom: 'clients_fevrier_2024.xlsx',
      chemin: 'Downloads/clients_fevrier_2024.xlsx',
      dateIntegration: new Date('2024-02-15T09:00:00'),     
      integrateur: 'Alim Anis',
    },
    {
      id: '4',
      nom: 'clients_fevrier_2024.xlsx',
      chemin: 'Downloads/clients_fevrier_2024.xlsx',
      dateIntegration: new Date('2024-02-15T09:00:00'),     
      integrateur: 'Alim Anis',
    }
    
  ];
  

  constructor() {
    this.updatePagination();
  }

  updatePagination() {
    const startIndex = (this.pageActuelle - 1) * this.lignesParPage;
    const endIndex = startIndex + this.lignesParPage;
    this.paginatedFiles = this.fichiers.slice(startIndex, endIndex);
    this.totalPages = Math.ceil(this.fichiers.length / this.lignesParPage);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.pageActuelle = page;
      this.updatePagination();
    }
  }
  
} 