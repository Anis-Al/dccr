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
          <button class="btn export-btn green-button" title="Exporter les données au format Excel">
            <i class="fas fa-file-excel"></i> Exporter
          </button>
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
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let item of donneesPaginees" class="clickable-row">
                  <td class="sticky-column">{{ item.nom }}</td>
                  <td>{{ item.date }}</td>
                  <td>{{ item.integrateur }}</td>
                  <td>{{ item.nombreCredits }}</td>
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
                  <td>{{ item.dateGeneration  }}</td>
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
      gap: 1rem;

      .search-box {
        margin-left: 0;
        width: 250px;
      }

      .export-btn {
        margin-left: auto;
      }
    }

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
    }

    .green-button {
      background-color: #28a745 !important;
      color: white !important;
    }

    .green-button:hover {
      background-color: #218838 !important;
    }

    .export-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
  `]
})
export class ArchivesComponent implements OnInit {
  selectedTab: 'fichiers' | 'credits' | 'declarations' = 'fichiers';
  searchTerm = '';
  
  pageActuelle = 1;
  donneesFiltrees: any[] = [];
  donneesPaginees: any[] = [];
  
  fichiersData: any[] = [
    { id: 1, nom: 'blabla', date: 'blabla', integrateur: 'blabla', nombreCredits: 'blabla', statut: 'blabla' },
    { id: 2, nom: 'blabla', date: 'blabla', integrateur: 'blabla', nombreCredits: 'blabla', statut: 'blabla' },
    { id: 3, nom: 'blabla', date: 'blabla', integrateur: 'blabla', nombreCredits: 'blabla', statut: 'blabla' },
    { id: 4, nom: 'blabla', date: 'blabla', integrateur: 'blabla', nombreCredits: 'blabla', statut: 'blabla' },
    { id: 5, nom: 'blabla', date: 'blabla', integrateur: 'blabla', nombreCredits: 'blabla', statut: 'blabla' },
    { id: 6, nom: 'blabla', date: 'blabla', integrateur: 'blabla', nombreCredits: 'blabla', statut: 'blabla' },
    { id: 7, nom: 'blabla', date: 'blabla', integrateur: 'blabla', nombreCredits: 'blabla', statut: 'blabla' },
    { id: 8, nom: 'blabla', date: 'blabla', integrateur: 'blabla', nombreCredits: 'blabla', statut: 'blabla' },
    { id: 9, nom: 'blabla', date: 'blabla', integrateur: 'blabla', nombreCredits: 'blabla', statut: 'blabla' },
    { id: 10, nom: 'blabla', date: 'blabla', integrateur: 'blabla', nombreCredits: 'blabla', statut: 'blabla' }
  ];
  
  creditsData: any[] = [
    { id: 1, numContrat: 'blabla', type: 'blabla', activite: 'blabla', situation: 'blabla', dateDeclaration: 'blabla', montant: 'blabla', devise: 'blabla', duree: 'blabla', taux: 'blabla', fichierSource: 'blabla' },
    { id: 2, numContrat: 'blabla', type: 'blabla', activite: 'blabla', situation: 'blabla', dateDeclaration: 'blabla', montant: 'blabla', devise: 'blabla', duree: 'blabla', taux: 'blabla', fichierSource: 'blabla' },
    { id: 3, numContrat: 'blabla', type: 'blabla', activite: 'blabla', situation: 'blabla', dateDeclaration: 'blabla', montant: 'blabla', devise: 'blabla', duree: 'blabla', taux: 'blabla', fichierSource: 'blabla' },
    { id: 4, numContrat: 'blabla', type: 'blabla', activite: 'blabla', situation: 'blabla', dateDeclaration: 'blabla', montant: 'blabla', devise: 'blabla', duree: 'blabla', taux: 'blabla', fichierSource: 'blabla' },
    { id: 5, numContrat: 'blabla', type: 'blabla', activite: 'blabla', situation: 'blabla', dateDeclaration: 'blabla', montant: 'blabla', devise: 'blabla', duree: 'blabla', taux: 'blabla', fichierSource: 'blabla' },
    { id: 6, numContrat: 'blabla', type: 'blabla', activite: 'blabla', situation: 'blabla', dateDeclaration: 'blabla', montant: 'blabla', devise: 'blabla', duree: 'blabla', taux: 'blabla', fichierSource: 'blabla' },
    { id: 7, numContrat: 'blabla', type: 'blabla', activite: 'blabla', situation: 'blabla', dateDeclaration: 'blabla', montant: 'blabla', devise: 'blabla', duree: 'blabla', taux: 'blabla', fichierSource: 'blabla' },
    { id: 8, numContrat: 'blabla', type: 'blabla', activite: 'blabla', situation: 'blabla', dateDeclaration: 'blabla', montant: 'blabla', devise: 'blabla', duree: 'blabla', taux: 'blabla', fichierSource: 'blabla' },
    { id: 9, numContrat: 'blabla', type: 'blabla', activite: 'blabla', situation: 'blabla', dateDeclaration: 'blabla', montant: 'blabla', devise: 'blabla', duree: 'blabla', taux: 'blabla', fichierSource: 'blabla' },
    { id: 10, numContrat: 'blabla', type: 'blabla', activite: 'blabla', situation: 'blabla', dateDeclaration: 'blabla', montant: 'blabla', devise: 'blabla', duree: 'blabla', taux: 'blabla', fichierSource: 'blabla' }
  ];
  
  declarationsData: any[] = [
    { id: 1, nom: 'blabla', dateGeneration: 'blabla', excelSource: 'blabla', nombreCredits: 'blabla', generateur: 'blabla' },
    { id: 2, nom: 'blabla', dateGeneration: 'blabla', excelSource: 'blabla', nombreCredits: 'blabla', generateur: 'blabla' },
    { id: 3, nom: 'blabla', dateGeneration: 'blabla', excelSource: 'blabla', nombreCredits: 'blabla', generateur: 'blabla' },
    { id: 4, nom: 'blabla', dateGeneration: 'blabla', excelSource: 'blabla', nombreCredits: 'blabla', generateur: 'blabla' },
    { id: 5, nom: 'blabla', dateGeneration: 'blabla', excelSource: 'blabla', nombreCredits: 'blabla', generateur: 'blabla' },
    { id: 6, nom: 'blabla', dateGeneration: 'blabla', excelSource: 'blabla', nombreCredits: 'blabla', generateur: 'blabla' },
    { id: 7, nom: 'blabla', dateGeneration: 'blabla', excelSource: 'blabla', nombreCredits: 'blabla', generateur: 'blabla' },
    { id: 8, nom: 'blabla', dateGeneration: 'blabla', excelSource: 'blabla', nombreCredits: 'blabla', generateur: 'blabla' },
    { id: 9, nom: 'blabla', dateGeneration: 'blabla', excelSource: 'blabla', nombreCredits: 'blabla', generateur: 'blabla' },
    { id: 10, nom: 'blabla', dateGeneration: 'blabla', excelSource: 'blabla', nombreCredits: 'blabla', generateur: 'blabla' }
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
    const lignesParPage = 5; 
    const startIndex = (this.pageActuelle - 1) * lignesParPage;
    const endIndex = startIndex + lignesParPage;
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


}
