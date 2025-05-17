import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../../components/pagination/pagination.component';

@Component({
  selector: 'app-archives',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent],
  template: `
    <div class="archives-container">
      <div class="header">
        <h1>Archives des données</h1>
        <div class="header-actions">
          <button class="btn btn-primary export-btn" title="Exporter les données au format Excel">
            <i class="fas fa-file-excel"></i> Exporter
          </button>
        </div>
      </div>

      <div class="archives-content">
        <div class="tabs-container">
          <div class="tab" [class.active]="selectedTab === 'fichiers'" (click)="changeTab('fichiers')">
            <i class="fas fa-file-excel"></i> Fichiers d'entrée
          </div>
          <div class="tab" [class.active]="selectedTab === 'credits'" (click)="changeTab('credits')">
            <i class="fas fa-money-check-alt"></i> Crédits
          </div>
          <div class="tab" [class.active]="selectedTab === 'declarations'" (click)="changeTab('declarations')">
            <i class="fas fa-file-alt"></i> Déclarations BA
          </div>
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input 
              type="text" 
              placeholder="Rechercher..." 
              [(ngModel)]="searchTerm"
              (input)="onSearch()"
            >
          </div>
        </div>

        <!-- Fichiers d'entrée -->
        <div class="table-section" *ngIf="selectedTab === 'fichiers'">
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th class="sticky-column">Nom du fichier</th>
                  <th>Date d'intégration</th>
                  <th>Intégrateur</th>
                  <th>Nombre de crédits</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let item of donneesPaginees" class="clickable-row">
                  <td class="sticky-column">{{ item.nom }}</td>
                  <td>{{ item.date | date:'dd/MM/yyyy HH:mm' }}</td>
                  <td>{{ item.integrateur }}</td>
                  <td>{{ item.nombreCredits }}</td>
                  <td>
                    <span class="badge" [ngClass]="getBadgeClass(item.statut)">{{ item.statut }}</span>
                  </td>
                </tr>
                <tr *ngIf="donneesPaginees.length === 0">
                  <td colspan="5" class="no-data">Aucun fichier trouvé</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Crédits -->
        <div class="table-section" *ngIf="selectedTab === 'credits'">
          <div class="table-container credits-table">
            <table>
              <thead>
                <tr>
                  <th class="sticky-column">N° Contrat</th>
                  <th>Type</th>
                  <th>Activité</th>
                  <th>Situation</th>
                  <th>Date Déclaration</th>
                  <th>Montant</th>
                  <th>Devise</th>
                  <th>Durée</th>
                  <th>Taux</th>
                  <th>Fichier source</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let item of donneesPaginees" class="clickable-row">
                  <td class="sticky-column">{{ item.numContrat }}</td>
                  <td>{{ item.type }}</td>
                  <td>{{ item.activite }}</td>
                  <td>{{ item.situation }}</td>
                  <td>{{ item.dateDeclaration }}</td>
                  <td>{{ item.montant }}</td>
                  <td>{{ item.devise }}</td>
                  <td>{{ item.duree }}</td>
                  <td>{{ item.taux }}</td>
                  <td>{{ item.fichierSource }}</td>
               
                </tr>
                <tr *ngIf="donneesPaginees.length === 0">
                  <td colspan="11" class="no-data">Aucun crédit trouvé</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Déclarations BA -->
        <div class="table-section" *ngIf="selectedTab === 'declarations'">
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th class="sticky-column">Nom du fichier</th>
                  <th>Date de génération</th>
                  <th>Excel source</th>
                  <th>Nombre de crédits</th>
                  <th>Générateur</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let item of donneesPaginees" class="clickable-row">
                  <td class="sticky-column">{{ item.nom }}</td>
                  <td>{{ item.dateGeneration | date:'dd/MM/yyyy HH:mm' }}</td>
                  <td>{{ item.excelSource }}</td>
                  <td>{{ item.nombreCredits }}</td>
                  <td>{{ item.generateur }}</td>
                 
                </tr>
                <tr *ngIf="donneesPaginees.length === 0">
                  <td colspan="6" class="no-data">Aucune déclaration trouvée</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="pagination-container">
          <app-pagination
            [lignesTotales]="donneesFiltrees.length"
            [pageActuelle]="pageActuelle"
            (changeurPage)="changerPage($event)"
          ></app-pagination>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .archives-container {
      height: 100%;
      display: flex;
      flex-direction: column;
      padding: 1.5rem;
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
    }

    .archives-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
      overflow: hidden;
    }

    .tabs-container {
      display: flex;
      background-color: var(--background-color);
      border-bottom: 1px solid var(--border-color);
      align-items: center;
      padding-right: 1rem;

      .tab {
        padding: 1rem 1.5rem;
        font-weight: 500;
        color: var(--text-color-light);
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        border-bottom: 3px solid transparent;

        i {
          font-size: 1rem;
        }

        &:hover {
          background-color: rgba(0, 0, 0, 0.03);
          color: var(--text-color);
        }

        &.active {
          color: var(--primary-color);
          border-bottom: 3px solid var(--primary-color);
          background-color: white;
        }
      }

      .search-box {
        position: relative;
        margin-left: auto;
        width: 250px;

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
    }

    .table-section {
      flex: 1;
      overflow: auto;
      position: relative;
    }

    .table-container {
      overflow-x: auto;
      height: 100%;
      min-height: 200px;
      position: relative;
      
      &.credits-table {
        table {
          min-width: 1200px;
        }
      }

      table {
        width: 100%;
        min-width: 800px;
        border-collapse: separate;
        border-spacing: 0;
        
        th, td {
          padding: 0.75rem;
          text-align: left;
          border-bottom: 1px solid var(--border-color);
        }

        th {
          position: sticky;
          top: 0;
          background-color: var(--background-color);
          font-weight: 600;
          z-index: 10;
          box-shadow: 0 1px 0 var(--border-color);
        }

        .sticky-column {
          position: sticky;
          left: 0;
          background-color: inherit;
          z-index: 1;
          box-shadow: 1px 0 0 var(--border-color);
        }

        thead th.sticky-column {
          z-index: 11;
          background-color: var(--background-color);
        }

        tbody tr {
          background-color: white;
          transition: background-color 0.2s ease;
          
          &:hover {
            background-color: var(--hover-color, #f5f5f5);
          }
          
          &.clickable-row {
            cursor: pointer;
          }

          td.sticky-column {
            background-color: inherit;
          }
        }
      }
    }

    .pagination-container {
      padding: 1rem;
      background-color: var(--background-color);
      border-top: 1px solid var(--border-color);
    }

    .no-data {
      text-align: center;
      padding: 2rem;
      color: var(--text-color-light);
      font-style: italic;
    }

    .badge {
      display: inline-block;
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 500;
      text-transform: uppercase;
      
      &.badge-success {
        background-color: rgba(40, 167, 69, 0.1);
        color: #28a745;
      }
      
      &.badge-warning {
        background-color: rgba(255, 193, 7, 0.1);
        color: #ffc107;
      }
      
      &.badge-danger {
        background-color: rgba(220, 53, 69, 0.1);
        color: #dc3545;
      }
      
      &.badge-info {
        background-color: rgba(23, 162, 184, 0.1);
        color: #17a2b8;
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
      
      &.btn-outline {
        background-color: transparent;
        border: 1px solid var(--border-color);
        color: var(--text-color);
        
        &:hover {
          background-color: var(--background-color);
        }
      }
    }

    .export-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
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

    .actions {
      display: flex;
      gap: 0.5rem;
      justify-content: center;
    }
  `]
})
export class ArchivesComponent implements OnInit {
  selectedTab: 'fichiers' | 'credits' | 'declarations' = 'fichiers';
  searchTerm = '';
  
  // Pagination
  pageActuelle = 1;
  lignesParPage = 10;
  donneesFiltrees: any[] = [];
  donneesPaginees: any[] = [];
  
  // Données de test
  fichiersData: any[] = [
    { id: 1, nom: 'Fichier_Janvier_2023.xlsx', date: '2023-01-15T10:30:00', integrateur: 'Ahmed', nombreCredits: 45, statut: 'Traité' },
    { id: 2, nom: 'Fichier_Février_2023.xlsx', date: '2023-02-20T14:15:00', integrateur: 'Karim', nombreCredits: 32, statut: 'En cours' },
    { id: 3, nom: 'Fichier_Mars_2023.xlsx', date: '2023-03-10T09:45:00', integrateur: 'Fatima', nombreCredits: 28, statut: 'Traité' },
  ];
  
  creditsData: any[] = [
    { id: 1, numContrat: 'CR-2023-001', type: 'Immobilier', activite: 'Construction', situation: 'En cours', dateDeclaration: '15/01/2023', montant: 500000, devise: 'DZD', duree: 60, taux: 4.5, fichierSource: 'Fichier_Janvier_2023.xlsx' },
    { id: 2, numContrat: 'CR-2023-002', type: 'Consommation', activite: 'Achat véhicule', situation: 'En cours', dateDeclaration: '20/02/2023', montant: 150000, devise: 'DZD', duree: 36, taux: 5.2, fichierSource: 'Fichier_Février_2023.xlsx' },
    { id: 3, numContrat: 'CR-2023-003', type: 'Professionnel', activite: 'Investissement', situation: 'Clôturé', dateDeclaration: '10/03/2023', montant: 1200000, devise: 'DZD', duree: 84, taux: 3.8, fichierSource: 'Fichier_Mars_2023.xlsx' },
  ];
  
  declarationsData: any[] = [
    { id: 1, nom: 'Declaration_BA_Janvier_2023.xml', dateGeneration: '2023-01-20T16:45:00', excelSource: 'Fichier_Janvier_2023.xlsx', nombreCredits: 45, generateur: 'Système' },
    { id: 2, nom: 'Declaration_BA_Février_2023.xml', dateGeneration: '2023-02-25T11:30:00', excelSource: 'Fichier_Février_2023.xlsx', nombreCredits: 32, generateur: 'Système' },
    { id: 3, nom: 'Declaration_BA_Mars_2023.xml', dateGeneration: '2023-03-15T14:20:00', excelSource: 'Fichier_Mars_2023.xlsx', nombreCredits: 28, generateur: 'Système' },
  ];

  ngOnInit() {
    this.updateDonneesFiltrees();
  }

  changeTab(tab: 'fichiers' | 'credits' | 'declarations') {
    this.selectedTab = tab;
    this.searchTerm = '';
    this.pageActuelle = 1;
    this.updateDonneesFiltrees();
  }

  updateDonneesFiltrees() {
    switch (this.selectedTab) {
      case 'fichiers':
        this.donneesFiltrees = this.filtrerFichiers();
        break;
      case 'credits':
        this.donneesFiltrees = this.filtrerCredits();
        break;
      case 'declarations':
        this.donneesFiltrees = this.filtrerDeclarations();
        break;
    }
    
    this.updatePagination();
  }

  filtrerFichiers() {
    return this.fichiersData.filter(fichier => {
      return !this.searchTerm || 
        fichier.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        fichier.integrateur.toLowerCase().includes(this.searchTerm.toLowerCase());
    });
  }

  filtrerCredits() {
    return this.creditsData.filter(credit => {
      return !this.searchTerm || 
        credit.numContrat.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        credit.type.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        credit.activite.toLowerCase().includes(this.searchTerm.toLowerCase());
    });
  }

  filtrerDeclarations() {
    return this.declarationsData.filter(declaration => {
      return !this.searchTerm || 
        declaration.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        declaration.excelSource.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        declaration.generateur.toLowerCase().includes(this.searchTerm.toLowerCase());
    });
  }

  updatePagination() {
    const startIndex = (this.pageActuelle - 1) * this.lignesParPage;
    const endIndex = startIndex + this.lignesParPage;
    this.donneesPaginees = this.donneesFiltrees.slice(startIndex, endIndex);
  }

  changerPage(page: number) {
    this.pageActuelle = page;
    this.updatePagination();
  }

  onSearch() {
    this.pageActuelle = 1;
    this.updateDonneesFiltrees();
  }

  resetFilters() {
    this.searchTerm = '';
    this.pageActuelle = 1;
    this.updateDonneesFiltrees();
  }

  getBadgeClass(statut: string): string {
    switch (statut.toLowerCase()) {
      case 'traité':
        return 'badge-success';
      case 'en cours':
        return 'badge-warning';
      case 'erreur':
        return 'badge-danger';
      default:
        return 'badge-info';
    }
  }
}
