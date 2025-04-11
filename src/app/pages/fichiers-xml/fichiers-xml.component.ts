import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface XMLFile {
  id: string;
  nom: string;
  fichierSource: string;
  nombreCredits: number;
  integrateur: string;
  type: 'correction' | 'supression';
  Generateur: string;
  dateGeneration: Date;
}

@Component({
  selector: 'app-fichiers-xml',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fichiers-xml">
      <div class="header">
        <h1>Déclarations BA</h1>
      </div>

      <div class="card">
        <table class="table">
          <thead>
            <tr>
              <th>Nom du fichier</th>
              <th>Excel Source</th>
              <th>Nombre des crédits</th>
              <th>Intégrateur</th>
              <th class="actions-header">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let fichier of paginatedFichiers">
              <td>{{ fichier.nom }}</td>
              <td>{{fichier.fichierSource}}</td>
              <td>{{ fichier.nombreCredits }}</td>
              <td>
                <span class="badge" [ngClass]="{
                  'badge-anis': fichier.integrateur === 'Anis',
                  'badge-brahim': fichier.integrateur === 'Brahim',
                  'badge-aziz': fichier.integrateur === 'Aziz'
                }">{{ fichier.integrateur }}</span>
              </td>
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
          </tbody>
        </table>
      </div>

      <div class="pagination" *ngIf="totalPages > 1">
        <button class="btn" [disabled]="currentPage === 1" (click)="changePage(currentPage - 1)">
          <i class="fas fa-chevron-left"></i>
        </button>
        <span class="page-info">Page {{currentPage}} sur {{totalPages}}</span>
        <button class="btn" [disabled]="currentPage === totalPages" (click)="changePage(currentPage + 1)">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .fichiers-xml {
      padding: 1rem;
    }

    .header {
      margin-bottom: 1rem;
    }

    .generation-form {
      margin-bottom: 1rem;

      h2 {
        margin-bottom: 1rem;
      }
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .form-actions {
      display: flex;
      justify-content: flex-end;
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
        background: none;
        border: 1px solid #dee2e6;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover:not(:disabled) {
          background-color: #f8f9fa;
          border-color: #ced4da;
        }

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

    .actions-cell {
      padding-right: 20px;
    }

    .button-group {
      display: flex;
      gap: 8px;
    }

    .actions-header {
      text-align: center;
    }
  `]
})
export class FichiersXMLComponent {
  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 4;
  totalPages: number = 1;
  paginatedFichiers: XMLFile[] = [];

  // Sample data
  fichiers: XMLFile[] = Array(6).fill(null).map((_, index) => ({
    id: (index + 1).toString(),
    nom: `credits_${['mars', 'avril', 'janvier','juin'][index % 3]}_${Math.floor(index / 3) + 1}_2025.xml`,
    fichierSource: `credits_${['mars', 'avril', 'janvier'][index % 3]}_${Math.floor(index / 3) + 1}_2025.xlsx`,
    nombreCredits: Math.floor(Math.random() * 50) + 1,
    integrateur: ['Anis', 'Brahim','Aziz'][index % 3],
    type: index % 3 === 0 ? 'correction' : 'supression',
    Generateur: ['Anis', 'Brahim','Aziz'][index % 3],
    dateGeneration: new Date(2024, 2, 20 - index),
  }));

  constructor() {
    this.updatePagination();
  }

  changePage(page: number) {
    this.currentPage = page;
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.fichiers.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.paginatedFichiers = this.fichiers.slice(startIndex, startIndex + this.itemsPerPage);
  }

  downloadFiles(fichier: XMLFile) {
    // Implement download logic here
  }

  markAsSubmitted(fichier: XMLFile) {
    // Implement mark as submitted logic here
  }

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