import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GenererDonneesFictivesService } from '../../core/services/generer-donnees-fictives.service';
import { Credit } from '../../core/models/credits';

@Component({
  selector: 'app-archives',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="archives-container">
      <h1>Archives des données</h1>
      <div class="card">
        <div class="card-header">
          <div class="controls-container">
            <div class="table-selector">
              <select [(ngModel)]="selectedTable" class="form-select">
                <option value="excel">Fichiers d'entrée</option>
                <option value="prets">Crédits</option>
                <option value="xml">Déclarations BA</option>
              </select>
            </div>
            <div class="search-container">
              <input 
                type="text" 
                [(ngModel)]="searchQuery" 
                (input)="applyFilter()"
                placeholder="Rechercher..."
                class="search-input"
              >
              <i class="fas fa-search search-icon"></i>
            </div>
            <div class="button-group">
              <button class="export-btn" (click)="exportTable()" title="Exporter les données au format Excel">
                <i class="fas fa-file-excel"></i> Exporter
              </button>
            </div>
          </div>
        </div>
        <div class="card-body">
          <div class="table-container">
            <!-- Excel Files Table -->
            <div *ngIf="selectedTable === 'excel'">
              <table class="table fichiers-table">
                <thead>
                  <tr>
                    <th>Nom du fichier</th>
                    <th>Chemin</th>
                    <th>Date d'intégration</th>
                    <th>Intégrateur</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let fichier of filteredExcelFiles">
                    <td>{{ fichier.nom }}</td>
                    <td>{{ fichier.chemin }}</td>
                    <td>{{ fichier.dateIntegration | date:'dd/MM/yyyy HH:mm' }}</td>
                    <td>{{ fichier.integrateur }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Credits Table -->
            <div *ngIf="selectedTable === 'prets'" class="table-wrapper">
              <table class="table">
                <thead>
                  <tr>
                    <th class="sticky-column">N° Contrat</th>
                    <th>Type</th>
                    <th>Plafond</th>
                    <th>Activité</th>
                    <th>Situation</th>
                    <th>Agence</th>
                    <th>Wilaya</th>
                    <th>Montant</th>
                    <th>Devise</th>
                    <th>Taux</th>
                    <th>Durée</th>
                    <th>Mensualité</th>
                    <th>Retard</th>
                    <th>Dates</th>
                    <th>Intervenants</th>
                    <th>Garanties</th>
                    <th>Source</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let credit of filteredCredits">
                    <td class="sticky-column">{{credit.numContrat}}</td>
                    <td>{{credit.libelleTypeCredit}}</td>
                    <td>{{credit.plafondAccorde ? credit.numeroPlafond || 'Oui' : 'Non'}}</td>
                    <td>{{credit.libelleActivite}}</td>
                    <td>{{credit.libelleSituation}}</td>
                    <td>{{credit.libelleAgence}}</td>
                    <td>{{credit.libelleWilaya}}</td>
                    <td>{{credit.creditsAccorde | currency}}</td>
                    <td>{{credit.libelleDev}}</td>
                    <td>{{credit.tauxInterets | number:'1.2-2'}}%</td>
                    <td>{{credit.libelleDureeInitiale}}</td>
                    <td>{{credit.mensualite | currency}}</td>
                    <td>
                      <span *ngIf="credit.libelleClasseRetard">
                        {{credit.libelleClasseRetard}} ({{credit.nombreEcheancesImpayes}} éch.)
                      </span>
                      <span *ngIf="!credit.libelleClasseRetard">Aucun</span>
                    </td>
                    <td>
                      <div>Octroi: {{credit.dateOctroi | date:'shortDate'}}</div>
                      <div>Expiration: {{credit.dateExpiration | date:'shortDate'}}</div>
                    </td>
                    <td>
                      <div *ngFor="let intervenant of credit.intervenants">
                        {{intervenant.libelleNiveauResponsabilite}}: {{intervenant.cle}}
                      </div>
                    </td>
                    <td>
                      <div *ngFor="let garantie of credit.garanties || []">
                        {{garantie.libelleType}}: {{garantie.montant | currency}}
                      </div>
                      <div *ngIf="!credit.garanties?.length">Aucune</div>
                    </td>
                    <td>{{credit.source.fileName || 'Manuel'}}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- XML Files Table -->
            <div *ngIf="selectedTable === 'xml'">
              <table class="table">
                <thead>
                  <tr>
                    <th>Nom du fichier</th>
                    <th>Excel Source</th>
                    <th>Nombre des crédits</th>
                    <th>Intégrateur</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let fichier of filteredXmlFiles">
                    <td>{{ fichier.nom }}</td>
                    <td>{{fichier.fichierSource}}</td>
                    <td>{{ fichier.nombreCredits }}</td>
                    <td>{{ fichier.integrateur }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
    .archives-container {
      padding: 20px;
    }
    
    .card {
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
      margin-bottom: 20px;
    }
    
    .card-header {
      padding: 15px 20px;
      background-color: #f8f9fa;
      border-bottom: 1px solid #e0e0e0;
      display: flex;
      align-items: center;
    }
    
    .card-body {
      padding: 20px;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 1rem;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    
    th, td {
      padding: 12px 15px;
      text-align: left;
      border-bottom: 1px solid #e0e0e0;
    }
    
    th {
      background-color: #f8f9fa;
      font-weight: 600;
      color: #495057;
      position: sticky;
      top: 0;
    }
    
    tr:hover {
      background-color: #f8f9fa;
    }
    
    .sticky-column {
      position: sticky;
      left: 0;
      background-color: white;
      z-index: 1;
    }
    
    .table-wrapper {
      overflow-x: auto;
    }
    
    .controls-container {
      display: flex;
      gap: 15px;
      align-items: center;
      flex-wrap: wrap;
    }
    
    .table-selector select {
      padding: 10px 15px;
      border-radius: 6px;
      border: 1px solid #ced4da;
      font-size: 14px;
      background-color: white;
      min-width: 200px;
      transition: all 0.2s;
    }
    
    .table-selector select:focus {
      border-color: #86b7fe;
      box-shadow: 0 0 0 0.25rem rgba(13,110,253,.25);
      outline: none;
    }
    
    .search-container {
      position: relative;
      flex: 1;
      min-width: 250px;
    }
    
    .search-input {
      width: 100%;
      padding: 10px 15px 10px 35px;
      border-radius: 6px;
      border: 1px solid #ced4da;
      font-size: 14px;
      transition: all 0.2s;
    }
    
    .search-input:focus {
      border-color: #86b7fe;
      box-shadow: 0 0 0 0.25rem rgba(13,110,253,.25);
      outline: none;
    }
    
    .search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      color: #6c757d;
    }
    
    .export-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 15px;
      background-color: #28a745;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .export-btn:hover {
      background-color: #218838;
    }
    
    .export-btn i {
      font-size: 16px;
    }
    
    .badge {
      display: inline-block;
      padding: 0.25em 0.4em;
      font-size: 75%;
      font-weight: 700;
      line-height: 1;
      text-align: center;
      white-space: nowrap;
      vertical-align: baseline;
      border-radius: 0.25rem;
    }
    
    .badge-anis { background-color: #17a2b8; color: white; }
    .badge-brahim { background-color: #6c757d; color: white; }
    .badge-aziz { background-color: #ffc107; color: #212529; }
    
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
    `
  ]
})
export class ArchivesComponent {
  selectedTable: 'excel' | 'prets' | 'xml' = 'excel';
  searchQuery = '';
  
  // Mock data for Excel files
  mockExcelFiles = [
    {
      id: '1',
      nom: 'clients_mars_2024.xlsx',
      chemin: 'Downloads/clients_mars_2024.xlsx',
      dateIntegration: new Date('2024-03-20T14:30:00'),
      integrateur: 'Alim Anis'
    },
    {
      id: '2',
      nom: 'clients_fevrier_2024.xlsx',
      chemin: 'Downloads/clients_fevrier_2024.xlsx',
      dateIntegration: new Date('2024-02-15T09:00:00'),
      integrateur: 'Alim Anis'
    }
  ];

  get filteredExcelFiles() {
    return this.mockExcelFiles.filter(fichier => 
      fichier.nom.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      fichier.chemin.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      fichier.integrateur.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  credits: Credit[] = [];

  get filteredCredits() {
    return this.credits.filter(credit => 
      credit.numContrat.toString().includes(this.searchQuery) ||
      credit.libelleTypeCredit.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      credit.libelleActivite.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      credit.libelleSituation.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      credit.libelleAgence.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      credit.libelleWilaya.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      credit.creditsAccorde.toString().includes(this.searchQuery) ||
      credit.libelleDev.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      credit.tauxInterets.toString().includes(this.searchQuery) ||
      credit.libelleDureeInitiale.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      credit.mensualite.toString().includes(this.searchQuery) ||
      credit.libelleClasseRetard?.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      credit.dateOctroi.toString().includes(this.searchQuery) ||
      credit.dateExpiration.toString().includes(this.searchQuery) ||
      credit.intervenants.some(intervenant => intervenant.libelleNiveauResponsabilite.toLowerCase().includes(this.searchQuery.toLowerCase()) || intervenant.cle.toLowerCase().includes(this.searchQuery.toLowerCase())) ||
      credit.garanties?.some(garantie => garantie.libelleType.toLowerCase().includes(this.searchQuery.toLowerCase()) || garantie.montant.toString().includes(this.searchQuery)) ||
      credit.source?.fileName?.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  constructor(private genererDonneesFictivesService: GenererDonneesFictivesService) {
    this.credits = this.genererDonneesFictivesService.getMockCredits(20);
  }

  // Mock data for XML files
  mockXmlFiles = [
    {
      id: '1',
      nom: 'credits_mars_1_2025.xml',
      fichierSource: 'credits_mars_1_2025.xlsx',
      nombreCredits: 24,
      integrateur: 'Anis'
    }
  ];

  get filteredXmlFiles() {
    return this.mockXmlFiles.filter(fichier => 
      fichier.nom.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      fichier.fichierSource.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      fichier.integrateur.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  getEmprunteurPrincipal(credit: any): string {
    const emprunteur = credit.intervenants.find((i: any) => i.libelleNiveauResponsabilite === 'Emprunteur');
    return emprunteur ? `${emprunteur.cle}` : 'N/A';
  }

  applyFilter() {
    // No need to do anything here, the filtered data is already computed in the getters
  }

  exportTable() {
    let data: any[] = [];
    switch(this.selectedTable) {
      case 'excel':
        data = this.filteredExcelFiles;
        break;
      case 'prets':
        data = this.filteredCredits;
        break;
      case 'xml':
        data = this.filteredXmlFiles;
        break;
    }
  }
}
