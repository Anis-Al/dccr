import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaginationComponent } from '../../../../components/pagination/pagination.component';
import { CreditDetailsComponent } from '../../../credits/credit-details/credit-details.component';

@Component({
  selector: 'app-credits-list',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent, CreditDetailsComponent],
  template: `
    <div class="prets-container" [class.details-open]="creditSelectionne" *ngIf="fichierSelectionne">
      <div class="prets-list">
        <div class="header">
          <div>
            <div class="breadcrumb" *ngIf="fichierSelectionne">
              <a (click)="fermerCredits.emit()">Fichiers d'Entrée</a>
              <i class="fas fa-chevron-right"></i>
              <span>{{ fichierSelectionne.nom_fichier_excel }}</span>
            </div>
            <h1>Crédits En Cours</h1>
          </div>
          <div class="header-actions">
            <button class="btn btn-secondary" (click)="fermerCredits.emit()">
              <i class="fas fa-arrow-left"></i>
              <span>Retour</span>
            </button>
            <button class="btn btn-primary" (click)="ajouterNouveauCredit.emit()">
              <i class="fas fa-plus"></i>
              <span>Nouveau</span>
            </button>
          </div>
        </div>
        <div class="filters">
          <div class="search-box">
            <i class="fas fa-search"></i>
            <input type="text" placeholder="Rechercher un crédit..." [(ngModel)]="creditSearchTerm" (input)="creditSearch.emit()">
          </div>
          <div class="date-filters">
            <div class="date-select">
              <label>Date de Déclaration:</label>
              <select [(ngModel)]="selectedDate" (change)="filtrerCreditParDate.emit()">
                <option value="">Toutes les dates</option>
                <option *ngFor="let date of datesDeclaration" [value]="date">{{date}}</option>
              </select>
            </div>
          </div>
        </div>
        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th class="collante">N° Contrat</th>
                <th>Date Déclaration</th>
                <th>Situation</th>
                <th>Type</th>
                <th>Activité</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let credit of creditsPagines"
                  (click)="selectionnerCredit.emit(credit)"
                  [class.selected]="creditSelectionne?.num_contrat_credit === credit.num_contrat_credit">
                <td class="collante">{{credit.num_contrat_credit}}</td>
                <td>{{credit.date_declaration |date:'dd/MM/yyyy'}}</td>
                <td>{{credit.libelle_situation}}</td>
                <td>{{credit.libelle_type_credit}}</td>
                <td>{{credit.libelle_activite}}</td>
              </tr>
              <tr *ngIf="creditsPagines.length === 0">
                <td colspan="5" class="no-data">Aucun crédit trouvé</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="pagination-container">
          <app-pagination
            [lignesTotales]="creditsFiltres.length"
            [pageActuelle]="creditPageActuelle"
            (changeurPage)="changerCreditPage.emit($event)">
          </app-pagination>
        </div>
      </div>
      <div class="details-panel" *ngIf="creditSelectionne">
        <app-pret-details 
          [pret]="creditSelectionne" 
          (close)="fermerDetails.emit()">
        </app-pret-details>
      </div>
    </div>
  `,
  styles: [`
    .prets-container {
      display: flex;
      height: 100%;
      transition: all 0.3s ease;

      &.details-open {
        .prets-list {
          width: 40%;
          min-width: 600px;
        }

        .details-panel {
          width: 60%;
        }
      }
    }

    .prets-list {
      width: 100%;
      transition: width 0.3s ease;
      overflow: auto;
      padding: 1rem;
    }

    .details-panel {
      width: 0;
      overflow: auto;
      background-color: var(--background-color);
      border-left: 1px solid var(--border-color);
      transition: width 0.3s ease;
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
            background-color: #ff1d00;
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

        .date-input, .date-select {
          display: flex;
          align-items: center;
          gap: 0.5rem;

          label {
            color: var(--text-color);
            font-size: 0.875rem;
          }

          input[type="date"], select {
            padding: 0.5rem;
            border: 1px solid var(--border-color);
            border-radius: 4px;
            font-size: 0.875rem;
            color: var(--text-color);
            background-color: white;
            min-width: 200px;

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
          background-color: #ffffff !important;
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
        &.selected {
          td {
            background-color: var(--primary-color-light) !important;
          }
        }
        
        &.highlight-excel {
          td {
            background-color: #ff1744 !important;
            color: #fff !important;
            font-weight: bold;
          }
        }
        
        &:hover {
          td {
            background-color: var(--hover-color);
          }
        }
      }
    }

    .no-data {
      text-align: center;
      color: var(--text-color-light);
    }

    .pagination-container {
      display: flex;
      justify-content: center;
      padding: 1rem;
    }

    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      color: var(--text-color-light);
    }

    .breadcrumb a {
      color: var(--primary-color);
      text-decoration: none;
      cursor: pointer;
    }

    .breadcrumb a:hover {
      text-decoration: underline;
    }
  `]
})
export class CreditsListComponent {
  @Input() fichierSelectionne: any;
  @Input() creditsPagines: any[] = [];
  @Input() creditSelectionne: any;
  @Input() creditSearchTerm: string = '';
  @Input() selectedDate: string = '';
  @Input() datesDeclaration: string[] = [];
  @Input() creditsFiltres: any[] = [];
  @Input() creditPageActuelle: number = 1;

  @Output() fermerCredits = new EventEmitter<void>();
  @Output() ajouterNouveauCredit = new EventEmitter<void>();
  @Output() creditSearch = new EventEmitter<void>();
  @Output() filtrerCreditParDate = new EventEmitter<void>();
  @Output() selectionnerCredit = new EventEmitter<any>();
  @Output() fermerDetails = new EventEmitter<void>();
  @Output() changerCreditPage = new EventEmitter<number>();
} 