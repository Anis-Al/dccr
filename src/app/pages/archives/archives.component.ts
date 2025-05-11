import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../../components/pagination/pagination.component';


@Component({
  selector: 'app-archives',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent],
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
                placeholder="Rechercher..."
                class="search-input"
              >
              <i class="fas fa-search search-icon"></i>
            </div>
            <div class="button-group">
              <button class="export-btn"  title="Exporter les données au format Excel">
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
                
                </tbody>
              </table>
              <div class="pagination-container">
                <app-pagination
                  [lignesTotales]="donneesFiltrees.length"
                  [pageActuelle]="pageActuelle"
                  (changeurPage)="changerPage($event)"
                ></app-pagination>
              </div>
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
                
                </tbody>
              </table>
              <div class="pagination-container">
                <app-pagination
                  [lignesTotales]="donneesFiltrees.length"
                  [pageActuelle]="pageActuelle"
                  (changeurPage)="changerPage($event)"
                ></app-pagination>
              </div>
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
                
                </tbody>
              </table>
              <div class="pagination-container">
                <app-pagination
                  [lignesTotales]="donneesFiltrees.length"
                  [pageActuelle]="pageActuelle"
                  (changeurPage)="changerPage($event)"
                ></app-pagination>
              </div>
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
  pageActuelle = 1;
  lignesParPage = 5;
  donneesFiltrees: any[] = [];
  donneesPaginees: any[] = [];

  ngOnInit() {
    this.updatePagination();
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
  selectedTable: 'excel' | 'prets' | 'xml' = 'excel';
  
  
}
