import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DeclarationsBAService } from '../../../core/services/declarationsBA/declarations-ba.service';
import { ExcelCrudService } from '../../../core/services/excel/excel-crud.service';
import { ExcelMetadonneesDto } from '../../../core/dtos/Excel/excel-metadonnees-dto';

@Component({
  selector: 'app-fichiers-xml-generation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="generation-container">
      <div class="header">
        <h1>Génération de Fichiers XML</h1>
        <div class="header-actions">
          <button class="btn btn-secondary" (click)="retourListe()">
            <i class="fas fa-arrow-left"></i>
            <span>Retour</span>
          </button>
        </div>
      </div>

      <div class="content-section">
        <div class="selection-fichier">
          <h2>Sélection du fichier Excel source</h2>
          <div class="fichier-input-container">
            <div class="search-actions">
              <div class="search-box">
                <i class="fas fa-search"></i>
                <input type="text" placeholder="Rechercher un fichier Excel..." [(ngModel)]="searchTerm">
              </div>
              <button class="btn-refresh" title="Rafraîchir la liste" (click)="chargerFichiersExcel()" [disabled]="isChargementFichiers">
                <i class="fas fa-sync-alt" [class.fa-spin]="isChargementFichiers"></i>
              </button>
            </div>
            
            <div class="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Nom du fichier</th>
                    <th>Date d'intégration</th>
                    <th>Intégrateur</th>
                    <th>Sélection</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngIf="isChargementFichiers">
                    <td colspan="4" class="loading-data">
                      <i class="fas fa-spinner fa-spin"></i>
                      <span>Chargement des fichiers...</span>
                    </td>
                  </tr>
                  <tr *ngFor="let fichier of fichiersExcelFiltres">
                    <td>{{fichier.nom_fichier_excel || 'N/A'}}</td>
                    <td>{{fichier.date_heure_integration_excel | date:'dd/MM/yyyy HH:mm' || 'N/A'}}</td>
                    <td>{{fichier.integrateur || 'N/A'}}</td>
                    <td class="actions-cell">
                      <button 
                        class="btn-icon" 
                        [class.selected]="fichierSelectionne?.id_fichier_excel === fichier.id_fichier_excel"
                        (click)="selectionnerFichier(fichier)"
                      >
                        <i class="fas" [class.fa-check-circle]="fichierSelectionne?.id_fichier_excel === fichier.id_fichier_excel" [class.fa-circle]="fichierSelectionne?.id_fichier_excel !== fichier.id_fichier_excel"></i>
                      </button>
                    </td>
                  </tr>
                  <tr *ngIf="!isChargementFichiers && fichiersExcelFiltres.length === 0">
                    <td colspan="4" class="no-data">Aucun fichier Excel trouvé</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="message-container" *ngIf="messageSucces || messageErreur">
          <div class="alert alert-success" *ngIf="messageSucces">
            <i class="fas fa-check-circle"></i>
            <span>{{ messageSucces }}</span>
          </div>
          <div class="alert alert-danger" *ngIf="messageErreur">
            <i class="fas fa-exclamation-circle"></i>
            <span>{{ messageErreur }}</span>
          </div>
        </div>

        <div class="actions-container">
          <button class="btn btn-secondary" (click)="annuler()">
            <i class="fas fa-times"></i>
            <span>Annuler</span>
          </button>
          <button class="btn btn-primary" [disabled]="!fichierSelectionne || isLoading" (click)="genererXML()">
            <i class="fas" [class.fa-file-code]="!isLoading" [class.fa-spinner]="isLoading" [class.fa-spin]="isLoading"></i>
            <span>{{ isLoading ? 'Génération en cours...' : 'Générer le fichier XML' }}</span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .generation-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      padding: 1rem;
      background-color: var(--background-color);
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

    .content-section {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      flex: 1;
    }

    h2 {
      font-size: 1.2rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
      color: var(--text-color);
      border-bottom: 1px solid var(--border-color);
      padding-bottom: 0.5rem;
    }

    .description {
      margin-bottom: 1.5rem;
      color: var(--text-color-light);
      font-size: 0.9rem;
    }

    .selection-fichier {
      background-color: white;
      border-radius: 8px;
      padding: 1.5rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .search-actions {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .search-box {
      position: relative;
      flex: 1;

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

    .btn-refresh {
      background: none;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      width: 38px;
      height: 38px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-color);
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background-color: var(--hover-color);
        color: var(--primary-color);
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    .table-container {
      overflow-x: auto;
      margin-bottom: 1rem;
      max-height: 400px;
      overflow-y: auto;
      
      table {
        width: 100%;
        border-collapse: separate;
        border-spacing: 0;

        th, td {
          padding: 0.75rem;
          text-align: left;
          border-bottom: 1px solid var(--border-color);
        }

        th {
          font-weight: 600;
          background-color: #f8f9fa;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        tbody tr {
          &:hover {
            background-color: #f2f2f2;
          }
        }

        .actions-cell {
          text-align: center;
        }
      }
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
      width: 32px;
      height: 32px;

      &:hover {
        opacity: 1;
        background-color: rgba(0, 0, 0, 0.05);
      }

      &.selected {
        color: var(--primary-color);
        opacity: 1;
      }
    }

    .actions-container {
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
      margin-top: 2rem;
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

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
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

    .no-data, .loading-data {
      text-align: center;
      padding: 2rem;
      color: var(--text-color-light);
      font-style: italic;
    }
    
    .loading-data {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;
      
      i {
        color: var(--primary-color);
      }
    }

    .message-container {
      margin: 1rem 0;
    }

    .alert {
      padding: 1rem;
      border-radius: 4px;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-bottom: 1rem;

      i {
        font-size: 1.25rem;
      }

      &-success {
        background-color: rgba(25, 135, 84, 0.1);
        color: #198754;
        border-left: 4px solid #198754;
      }

      &-danger {
        background-color: rgba(220, 53, 69, 0.1);
        color: #dc3545;
        border-left: 4px solid #dc3545;
      }
    }
  `]
})
export class FichiersXmlGenerationComponent implements OnInit {

  searchTerm: string = '';  
  fichiersExcel: ExcelMetadonneesDto[] = [];
  isChargementFichiers: boolean = false;
  fichierSelectionne: ExcelMetadonneesDto | null = null;
  isLoading: boolean = false;
  messageErreur: string = '';
  messageSucces: string = '';
  
  constructor(
    private router: Router, 
    private declarationsService: DeclarationsBAService,
    private excelService: ExcelCrudService
  ) {}
  
  ngOnInit(): void {
    this.chargerFichiersExcel();
  }
  
  chargerFichiersExcel(): void {
    this.isChargementFichiers = true;
    this.excelService.actualiserMetadonnees()
      .subscribe({
        next: (fichiers) => {
          this.fichiersExcel = fichiers;
          this.isChargementFichiers = false;
        },
        error: (error) => {
          console.error('Erreur lors du chargement des fichiers Excel', error);
          this.isChargementFichiers = false;
          this.messageErreur = 'Impossible de charger la liste des fichiers Excel.';
        }
      });
  }
  
  get fichiersExcelFiltres(): ExcelMetadonneesDto[] {
    if (!this.searchTerm.trim()) {
      return this.fichiersExcel;
    }
    
    const searchTermLower = this.searchTerm.toLowerCase().trim();
    return this.fichiersExcel.filter(fichier => 
      fichier.nom_fichier_excel?.toLowerCase().includes(searchTermLower) ||
      fichier.integrateur?.toLowerCase().includes(searchTermLower)
    );
  }
  
  selectionnerFichier(fichier: ExcelMetadonneesDto): void {
    this.fichierSelectionne = fichier;
    this.messageErreur = '';
    this.messageSucces = '';
  }
  
  genererXML(): void {
    if (!this.fichierSelectionne) return;
    
    this.isLoading = true;
    this.messageErreur = '';
    this.messageSucces = '';
    
    this.declarationsService.genererDeclarations(this.fichierSelectionne.id_fichier_excel)
      .subscribe({
        next: (response) => {
          console.log('Fichier XML généré avec succès', response);
          this.isLoading = false;
          this.messageSucces = 'Le fichier XML a été généré avec succès.';
          
          setTimeout(() => {
            this.router.navigate(['/fichiers-xml']);
          }, 1500);
        },
        error: (error) => {
          console.error('Erreur lors de la génération du fichier XML', error);
          this.isLoading = false;
          this.messageErreur = 'Une erreur est survenue lors de la génération du fichier XML. Veuillez réessayer.';
        }
      });
  }
  
  getNomFichierSansExtension(nomFichier: string): string {
    if (!nomFichier) return '';
    return nomFichier.replace(/\.[^/.]+$/, '');
  }
  
  annuler(): void {
    this.fichierSelectionne = null;
    this.messageErreur = '';
    this.messageSucces = '';
  }
  
  retourListe(): void {
    this.router.navigate(['/fichiers-xml']);
  }
}
