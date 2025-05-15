import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../../components/pagination/pagination.component';



@Component({
  selector: 'app-fichiers-xml',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent],
  template: `
    <div class="fichiers-container">
      <div class="fichiers-list">
        <div class="header">
          <h1>Déclarations BA</h1>
          <div class="header-actions">
            <button class="btn btn-primary">
              <i class="fas fa-plus"></i>
              <span>Générer XML</span>
            </button>
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
                <th>Excel Source</th>
                <th>Date de géneration</th>
                <th>Nombre des crédits</th>
                <th>Intégrateur</th>
                <th class="actions-header">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let fichier of fichiersPagines">
                <td>{{fichier?.nom_fichier || 'N/A'}}</td>
                <td>{{fichier?.excel_source || 'N/A'}}</td>
                <td>{{fichier?.date_generation || 'N/A'}}</td>
                <td>{{fichier?.nombre_credits || 0}}</td>
                <td>{{fichier?.integrateur || 'N/A'}}</td>
                <td class="actions-cell">
                  <div class="tooltip-container button-group">
                    <button 
                      (click)="downloadFiles(fichier)" 
                      class="btn-icon"
                      (mouseenter)="showTooltip($event, 'download')"
                      (mouseleave)="hideTooltip($event, 'download')"
                    >
                      <i class="fas fa-download"></i>
                      <span class="tooltip-text">Télécharger les versions de 'correction' et 'supression' pour ce fichier</span>
                    </button>
                    <button 
                      (click)="markAsSubmitted(fichier)" 
                      class="btn-icon"
                      (mouseenter)="showTooltip($event, 'submit')"
                      (mouseleave)="hideTooltip($event, 'submit')"
                    >
                      <i class="fas fa-check"></i>
                      <span class="tooltip-text">Marquer comme soumis à la BA</span>
                    </button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="fichiersPagines.length === 0">
                <td colspan="5" class="no-data">Aucun fichier trouvé</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="pagination-container">
          <app-pagination
            [lignesTotales]="fichiersFiltres.length"
            [pageActuelle]="pageActuelle"
            (changeurPage)="changerPage($event)">
          </app-pagination>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .fichiers-container {
      display: flex;
      height: 100%;
      transition: all 0.3s ease;
    }

    .fichiers-list {
      width: 100%;
      transition: width 0.3s ease;
      overflow: auto;
      padding: 1rem;
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
            opacity: 0.9;
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
        
        th:last-child, td:last-child {
          width: 100px;
          text-align: center;
        }

        th {
          font-weight: 600;
          background-color: var(--background-color);
          border-bottom: 2px solid var(--border-color);
        }

        tbody {
          background-color: white;
        }
      }
    }

    /* Badge styles */
    .badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      color: white;
      min-width: 40px;
      text-align: center;
    }

    /* Credit count badges */
    .badge-low { background-color: #38a169; }
    .badge-medium { background-color: #3182ce; }
    .badge-high { background-color: #e53e3e; }

    /* Integrator badges */
    .badge-anis { background-color: #6b46c1; }
    .badge-brahim { background-color: #d69e2e; }
    .badge-aziz { background-color: #d53f8c; }

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
      width: 32px;
      height: 32px;

      &:hover {
        opacity: 1;
        background-color: rgba(0, 0, 0, 0.05);
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

    /* Center-align specific columns */
    td:nth-child(3), td:nth-child(5) {
      text-align: center;
    }

    /* Center the badge in the Actions column */
    td:nth-child(5) .tooltip-container {
      display: flex;
      justify-content: center;
    }

    .tooltip-container {
      position: relative;
      display: inline-block;
    }
    
    .tooltip-text {
      visibility: hidden;
      width: 200px;
      background-color: #333;
      color: #fff;
      text-align: center;
      border-radius: 4px;
      padding: 5px;
      position: absolute;
      z-index: 1;
      bottom: 125%;
      left: 50%;
      transform: translateX(-50%);
      opacity: 0;
      transition: opacity 0.3s;
    }
    
    .btn-icon:hover + .tooltip-text {
      visibility: visible;
      opacity: 1;
    }

    .button-group {
      display: flex;
      gap: 8px;
      justify-content: center;
    }

    .actions-header {
      text-align: center;
    }
    
    .actions-cell {
      padding: 0.5rem;
      text-align: center;
    }
  `]
})
export class FichiersXMLComponent {
  // Pagination
  pageActuelle: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;
  
  // Search and filters
  searchTerm: string = '';
  dateDebut: string = '';
  dateFin: string = '';
  
  // Data
  fichiers: any[] = [];
  fichiersFiltres: any[] = [];
  fichiersPagines: any[] = [];
  
  constructor() {
    // Mock data for demonstration
    this.fichiers = [
      { 
        id: 1, 
        nom_fichier: 'declaration_20230501.xml', 
        excel_source: 'credits_mai_2023.xlsx',
        nombre_credits: 45,
        integrateur: 'Anis'
      },
      { 
        id: 2, 
        nom_fichier: 'declaration_20230601.xml', 
        excel_source: 'credits_juin_2023.xlsx',
        nombre_credits: 32,
        integrateur: 'Brahim'
      },
      { 
        id: 3, 
        nom_fichier: 'declaration_20230701.xml', 
        excel_source: 'credits_juillet_2023.xlsx',
        nombre_credits: 67,
        integrateur: 'Aziz'
      }
    ];
    
    this.fichiersFiltres = [...this.fichiers];
    this.updatePaginatedData();
  }
  
  // Pagination methods
  changerPage(page: number): void {
    this.pageActuelle = page;
    this.updatePaginatedData();
  }
  
  updatePaginatedData(): void {
    const startIndex = (this.pageActuelle - 1) * this.itemsPerPage;
    this.fichiersPagines = this.fichiersFiltres.slice(startIndex, startIndex + this.itemsPerPage);
    this.totalPages = Math.ceil(this.fichiersFiltres.length / this.itemsPerPage);
  }
  
  // Search and filter methods
  onSearch(): void {
    this.applyFilters();
  }
  
  filtrerParDate(): void {
    this.applyFilters();
  }
  
  applyFilters(): void {
    this.fichiersFiltres = this.fichiers.filter(fichier => {
      // Apply search term filter
      const searchMatch = !this.searchTerm || 
        fichier.nom_fichier.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        fichier.excel_source.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        fichier.integrateur.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      // Apply date filters if implemented
      // This would require actual date fields in the data
      
      return searchMatch;
    });
    
    this.pageActuelle = 1;
    this.updatePaginatedData();
  }
  
  // Action methods
  downloadFiles(fichier: any): void {
    console.log('Downloading files for:', fichier.nom_fichier);
    // Implementation for downloading files
  }
  
  markAsSubmitted(fichier: any): void {
    console.log('Marking as submitted:', fichier.nom_fichier);
    // Implementation for marking as submitted
  }
  
  // Tooltip methods
  showTooltip(event: MouseEvent, type: string) {
    const button = event.target as HTMLElement;
    const tooltip = button.querySelector('.tooltip-text') as HTMLElement;
    if (tooltip) {
      tooltip.style.visibility = 'visible';
      tooltip.style.opacity = '1';
    }
  }
  
  hideTooltip(event: MouseEvent, type: string) {
    const button = event.target as HTMLElement;
    const tooltip = button.querySelector('.tooltip-text') as HTMLElement;
    if (tooltip) {
      tooltip.style.visibility = 'hidden';
      tooltip.style.opacity = '0';
    }
  }
}