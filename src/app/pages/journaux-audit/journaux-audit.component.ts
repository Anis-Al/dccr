import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../../components/pagination/pagination.component';

interface AuditLog {
  id: string;
  utilisateur: string;
  action: string;
  ressource: string;
  details: string;
  date: Date;
  niveau: 'Info' | 'Avertissement' | 'Erreur';
}

@Component({
  selector: 'app-journaux-audit',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent, DatePipe],
  template: `
    <div class="journaux-container">
      <div class="journaux-list">
        <div class="header">
          <h1>Journaux d'Audit</h1>
          <div class="header-actions">
            <span>
            </span>
          </div>
        </div>

        <div class="filters">
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input type="text" placeholder="Rechercher un journal..." [(ngModel)]="searchTerm" (input)="onSearch()">
          </div>
          <div class="date-filters">
            <div class="date-select">
              <label>Période:</label>
              <select [(ngModel)]="selectedPeriode" (change)="filtrerParPeriode()">
                <option value="">Toutes les périodes</option>
                <option value="today">Aujourd'hui</option>
                <option value="week">Cette semaine</option>
                <option value="month">Ce mois</option>
              </select>
            </div>
            <div class="date-select">
              <label>Action:</label>
              <select [(ngModel)]="selectedAction" (change)="filtrerParAction()">
                <option value="">Toutes les actions</option>
                <option value="create">Création</option>
                <option value="update">Modification</option>
                <option value="delete">Suppression</option>
                <option value="export">Export</option>
                <option value="import">Import</option>
              </select>
            </div>
          </div>
        </div>

        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th class="collante">Date</th>
                <th>Utilisateur</th>
                <th>Action</th>
                <th>Ressource</th>
                <th>Niveau</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let log of journauxPagines; trackBy: trackByJournal"
                  (click)="selectionnerJournal(log)"
                  [class.selected]="journalSelectionne?.id === log.id">
                <td class="collante">{{ log.date | date:'dd/MM/yyyy HH:mm:ss' }}</td>
                <td>{{ log.utilisateur }}</td>
                <td>{{ log.action }}</td>
                <td>{{ log.ressource }}</td>
                <td>
                  <span class="niveau-badge" [ngClass]="log.niveau.toLowerCase()">
                    {{ log.niveau }}
                  </span>
                </td>
              </tr>
              <tr *ngIf="journauxPagines.length === 0">
                <td colspan="5" class="no-data">Aucun journal trouvé</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="pagination-container">
          <app-pagination
            [lignesTotales]="journauxFiltres.length"
            [pageActuelle]="pageActuelle"
            (changeurPage)="changerPage($event)">
          </app-pagination>
        </div>
      </div>
      
      <div class="details-panel" *ngIf="journalSelectionne">
        <div class="header">
          <h2>Détails du Journal</h2>
          <button class="btn-icon close-btn" (click)="fermerDetails()">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="details-content">
          <div class="detail-item">
            <span class="label">ID:</span>
            <span class="value">{{ journalSelectionne.id }}</span>
          </div>
          <div class="detail-item">
            <span class="label">Date:</span>
            <span class="value">{{ journalSelectionne.date | date:'dd/MM/yyyy HH:mm:ss' }}</span>
          </div>
          <div class="detail-item">
            <span class="label">Utilisateur:</span>
            <span class="value">{{ journalSelectionne.utilisateur }}</span>
          </div>
          <div class="detail-item">
            <span class="label">Action:</span>
            <span class="value">{{ journalSelectionne.action }}</span>
          </div>
          <div class="detail-item">
            <span class="label">Ressource:</span>
            <span class="value">{{ journalSelectionne.ressource }}</span>
          </div>
          <div class="detail-item">
            <span class="label">Niveau:</span>
            <span class="niveau-badge" [ngClass]="journalSelectionne.niveau.toLowerCase()">
              {{ journalSelectionne.niveau }}
            </span>
          </div>
          <div class="detail-item">
            <span class="label">Détails:</span>
            <span class="value details-text">{{ journalSelectionne.details }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .journaux-container {
      display: flex;
      height: 100%;
      position: relative;
    }

    .journaux-list {
      width: 100%;
      overflow: auto;
      padding: 1rem;
      transition: width 0.3s ease;
    }
    
    .journaux-list.with-details {
      width: 60%;
    }
    
    .details-panel {
      width: 40%;
      padding: 1rem;
      border-left: 1px solid var(--border-color);
      overflow: auto;
      background-color: var(--background-color);
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

      &:hover {
        opacity: 1;
        background-color: rgba(0, 0, 0, 0.05);
      }
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
    
    .niveau-badge {
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 500;
      display: inline-block;

      &.info {
        background-color: #e3f2fd;
        color: #1976d2;
      }

      &.avertissement {
        background-color: #fff3e0;
        color: #f57c00;
      }

      &.erreur {
        background-color: #ffebee;
        color: var(--error-color, #d32f2f);
      }
    }
    
    .details-content {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      
      .detail-item {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        
        .label {
          font-weight: 500;
          color: var(--text-color-light);
          font-size: 0.875rem;
        }
        
        .value {
          font-size: 1rem;
          color: var(--text-color);
        }
        
        .details-text {
          white-space: pre-wrap;
          background-color: #f5f5f5;
          padding: 0.75rem;
          border-radius: 4px;
          font-family: monospace;
          font-size: 0.875rem;
        }
      }
    }
  `]
})
export class JournauxAuditComponent implements OnInit {
  pageActuelle = 1;
  lignesParPage = 5;
  journauxFiltres: AuditLog[] = [];
  journauxPagines: AuditLog[] = [];
  journalSelectionne: AuditLog | null = null;
  
  searchTerm = '';
  selectedPeriode = '';
  selectedAction = '';
  
  journaux: AuditLog[] = [
    {
      id: '1',
      utilisateur: 'Cheb Khaled',
      action: 'Création',
      ressource: 'Credit #cr.20250304.0001',
      details: 'Nouveau crédit créé',
      date: new Date('2024-03-20T15:30:00'),
      niveau: 'Info'
    },
    {
      id: '2',
      utilisateur: 'Alim Anis',
      action: 'Export',
      ressource: 'Déclaration BA #CREM.021.........',
      details: 'Export SEPA généré pour mars 2024',
      date: new Date('2024-03-20T14:45:00'),
      niveau: 'Info'
    }
  ];

  ngOnInit() {
    this.journauxFiltres = this.journaux;
    this.updatePagination();
  }

  updatePagination() {
    const startIndex = (this.pageActuelle - 1) * this.lignesParPage;
    const endIndex = startIndex + this.lignesParPage;
    this.journauxPagines = this.journauxFiltres.slice(startIndex, endIndex);
  }

  changerPage(page: number) {
    this.pageActuelle = page;
    this.updatePagination();
  }
  
  onSearch() {
    this.filtrerJournaux();
  }
  
  filtrerParPeriode() {
    this.filtrerJournaux();
  }
  
  filtrerParAction() {
    this.filtrerJournaux();
  }
  
  filtrerJournaux() {
    this.journauxFiltres = this.journaux.filter(journal => {
      // Filtre par terme de recherche
      const matchesSearch = !this.searchTerm || 
        journal.utilisateur.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        journal.ressource.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      // Filtre par action
      const matchesAction = !this.selectedAction || 
        journal.action.toLowerCase() === this.selectedAction.toLowerCase();
      
      // Filtre par période
      let matchesPeriode = true;
      if (this.selectedPeriode) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const journalDate = new Date(journal.date);
        
        if (this.selectedPeriode === 'today') {
          const endOfDay = new Date(today);
          endOfDay.setHours(23, 59, 59, 999);
          matchesPeriode = journalDate >= today && journalDate <= endOfDay;
        } else if (this.selectedPeriode === 'week') {
          const startOfWeek = new Date(today);
          startOfWeek.setDate(today.getDate() - today.getDay());
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6);
          endOfWeek.setHours(23, 59, 59, 999);
          matchesPeriode = journalDate >= startOfWeek && journalDate <= endOfWeek;
        } else if (this.selectedPeriode === 'month') {
          const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
          const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59, 999);
          matchesPeriode = journalDate >= startOfMonth && journalDate <= endOfMonth;
        }
      }
      
      return matchesSearch && matchesAction && matchesPeriode;
    });
    
    this.pageActuelle = 1;
    this.updatePagination();
  }
  
  trackByJournal(index: number, journal: AuditLog): string {
    return journal.id;
  }
  
  selectionnerJournal(journal: AuditLog) {
    this.journalSelectionne = journal;
    document.querySelector('.journaux-list')?.classList.add('with-details');
  }
  
  fermerDetails() {
    this.journalSelectionne = null;
    document.querySelector('.journaux-list')?.classList.remove('with-details');
  }
}