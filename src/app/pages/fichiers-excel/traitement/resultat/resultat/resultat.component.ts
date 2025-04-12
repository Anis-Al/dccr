import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Credit } from '../../../../../core/models/credits';
import { Router } from '@angular/router';
import { GenererDonneesFictivesService } from '../../../../../core/services/generer-donnees-fictives.service';
import { ViewStateService } from '../../../../../core/services/view-state.service';

@Component({
  selector: 'app-resultat',
  standalone:true,
  imports: [CommonModule],
  template: `
   <div class="validation-result-container">
     <div class="header-actions">
       <button class="back-btn" (click)="goBack()" title="Retour à l'intégration">
         <i class="fas fa-arrow-left"></i>
       </button>
       <h1>Résultats pour : <span class="file-name">PeuImporte.xlsx</span></h1>
     </div>

   <ng-template #errorCase>
    <div class="error-modal-overlay" *ngIf="showErrorPopup">
      <div class="error-modal">
        <div class="modal-content">
          <i class="fas fa-exclamation-triangle"></i>
          <h3>Erreurs détectées</h3>
          <p>Ce fichier contient des erreurs.</p>
          <p>Veuillez les corriger, puis rechargez le fichier.</p>
          <button class="close-btn" (click)="closePopup()">
            Fermer
          </button>
        </div>
      </div>
    </div>
    
    <div class="error-table-header">
      <h2 class="section-title rouge">Tableau des erreurs</h2>
      <button class="export-btn" (click)="exportErrors()">
        <i class="fas fa-file-export"></i> Exporter
      </button>
    </div>
    <div class="styled-table-container">
      <table class="table-invalid">
        <thead>
          <tr>
            <th>#</th>
            <th>Ligne</th>
            <th>Erreurs</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let row of invalidRows | slice: (currentInvalidPage - 1) * itemsPerPage : currentInvalidPage * itemsPerPage; let i = index">
            <td>{{ i + 1 }}</td>
            <td>{{ row.rowIndex }}</td>
            <td>
              <ul>
                <li *ngFor="let err of row.errors">{{ err }}</li>
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="pagination-controls">
        <button class="page-button" 
                (click)="changeInvalidPage(currentInvalidPage - 1)"
                [disabled]="currentInvalidPage === 1">
          Précédent
        </button>
        <span>Page {{ currentInvalidPage }}</span>
        <button class="page-button" 
                (click)="changeInvalidPage(currentInvalidPage + 1)"
                [disabled]="currentInvalidPage * itemsPerPage >= invalidRows.length">
          Suivant
        </button>
      </div>
    </div>
  </ng-template>

  <ng-template #correctCase>
    <div class="valid-credits-container">
      <h2 class="section-title vert">Contenu de ce fichier</h2>

      <div class="error-modal-overlay" *ngIf="showErrorPopup">
        <div class="error-modal">
          <div class="modal-content">
            <i class="fas fa-check-circle"></i>
            <h3 style="color: #28a745;">Fichier Correct</h3>
            <button class="close-btn" (click)="closePopup()" style="background-color: #28a745;"s>
              Fermer
            </button>
        </div>
      </div>
     </div>
      
      <div class="styled-table-container">
        <table class="table-valid">
          <thead>
            <tr>
              <th></th>
              <th>#</th>
              <th>Contrat</th>
            </tr>
          </thead>
          <tbody>
            <ng-container *ngFor="let credit of mockCredits; let i = index">
              <tr (click)="toggleRow(i)">
                <td>
                  <i class="fas" [class.fa-chevron-right]="!expandedRows[i]" [class.fa-chevron-down]="expandedRows[i]"></i>
                </td>
                <td>{{ i + 1 }}</td>
                <td>{{ credit.numContrat }}</td>
              </tr>
              
              <tr *ngIf="expandedRows[i]" class="expanded-row">
                <td colspan="3">
                  <div class="details-container">
                    <div class="detail-section">
                      <h4>Détails du crédit #{{i + 1}} - {{credit.numContrat}}</h4>
                      <div class="detail-grid">
                        <div><strong>Type:</strong> {{ credit.libelleTypeCredit }}</div>
                        <div><strong>Statut:</strong> {{ credit.libelleSituation }}</div>
                        <div><strong>Montant:</strong> {{ credit.creditsAccorde }}</div>
                        <div><strong>Agence:</strong> {{ credit.libelleAgence }}</div>
                        <div><strong>Date octroi:</strong> {{ credit.dateOctroi | date:'dd/MM/yyyy' }}</div>
                        <div><strong>Date expiration:</strong> {{ credit.dateExpiration | date:'dd/MM/yyyy' }}</div>
                        <div><strong>Mensualité:</strong> {{ credit.mensualite }}</div>
                        <div><strong>Activité:</strong> {{ credit.libelleActivite }}</div>
                        <div><strong>Taux:</strong> {{ credit.tauxInterets | number:'1.2-2' }}%</div>
                        <div><strong>Durée initiale:</strong> {{ credit.libelleDureeInitiale }}</div>
                        <div><strong>Durée restante:</strong> {{ credit.libelleDureeRestante }}</div>
                        <div><strong>Retard:</strong> {{ credit.libelleClasseRetard || 'Aucun' }}</div>
                        <div><strong>Plafond:</strong> {{ credit.plafondAccorde ? 'Oui' : 'Non' }}</div>
                        <div><strong>Numéro plafond:</strong> {{ credit.numeroPlafond || '-' }}</div>
                      </div>
                    </div>
                    
                    <div class="detail-section">
                      <h4>Debiteurs</h4>
                      <table class="sub-table">
                        <thead>
                          <tr>
                            <th>Rôle</th>
                            <th>Cle</th>
                            <th>Type</th>
                            <th>NIF</th>
                            <th>RIB</th>
                            <th>Solde</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr *ngFor="let intervenant of credit.intervenants">
                            <td>{{ intervenant.libelleNiveauResponsabilite }}</td>
                            <td>{{ intervenant.cle }}</td>
                            <td>{{ intervenant.typeCle }}</td>
                            <td>{{ intervenant.nif }}</td>
                            <td>{{ intervenant.rib }}</td>
                            <td>{{ intervenant.soldeRestant }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    
                    <div class="detail-section">
                      <h4>Garanties</h4>
                      <table class="sub-table">
                        <thead>
                          <tr>
                            <th>Type</th>
                            <th>Debiteur</th>
                            <th>Montant</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr *ngFor="let garantie of credit.garanties">
                            <td>{{ garantie.libelleType }}</td>
                            <td>{{ garantie.intervenant }}</td>
                            <td>{{ garantie.montant }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </td>
              </tr>
            </ng-container>
          </tbody>
        </table>
      </div>
      
      <div class="credit-count">
        Total : {{ mockCredits.length }}
      </div>
      
      <div class="confirmation-actions">
        <button class="confirm-btn" (click)="confirmInsertion()">
          Confirmer l'intégration
        </button>
      </div>
    </div>
   
  </ng-template>
  
  <ng-container *ngIf="showErrorCase; then errorCase; else correctCase"></ng-container>
</div>

  `,
  styles: `
  .validation-result-container {
    padding: 25px 30px; 
    background-color: #f9fafb; 
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; 
  }

  h1 {
    font-size: 1.8rem; 
    color: #333;
    margin-bottom: 25px; 
    font-weight: 600;
  }

  .file-name {
    font-weight: normal; 
    color: #555;
    font-size: 1.6rem;
  }

  .section-title {
    font-size: 1.5rem; 
    margin-bottom: 15px;
    font-weight: 500;
    padding-bottom: 5px;
    border-bottom: 2px solid;
    display: inline-block; 
  }

  .vert {
    color: #28a745; 
    border-bottom-color: #28a745;
  }

  .rouge {
    color: #dc3545; 
    border-bottom-color: #dc3545;
  }

  .styled-table-container {
    width: 100%;
    margin-bottom: 20px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    min-width: 800px;
  }

  th, td {
    padding: 12px 16px;
    border-bottom: 1px solid #ddd;
    text-align: left;
    vertical-align: top;
  }

  thead {
    background-color: #f7f7f7;
  }

  tr:hover {
    background-color: #f2f2f2;
  }

  .table-invalid tr:hover {
    background-color: #fff1f1;
  }

  .table-invalid td {
    background-color: #ffecec;
  }

  ul {
    margin: 0;
    padding-left: 20px;
  }

  li {
    list-style-type: disc;
  }

  .pagination-controls {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 0.8rem 1rem;
    background: #ffffff;
    border-top: 1px solid #eee;
  }

  .pagination-controls span {
    margin: 0 1rem;
    color: #555;
    font-size: 0.9rem;
  }

  .page-button {
    padding: 0.4rem 0.8rem;
    border: 1px solid #ccc;
    background-color: #fff;
    color: #337ab7;
    cursor: pointer;
    border-radius: 4px;
    margin: 0 0.2rem;
    transition: background-color 0.2s, color 0.2s;
  
    &:hover:not([disabled]) {
      background-color: #eef4ff;
      border-color: #b3c8e3;
    }
  
    &[disabled] {
      background: #f9f9f9;
      color: #aaa;
      cursor: not-allowed;
      border-color: #eee;
    }
  }

  .error-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0,0,0,0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    backdrop-filter: blur(2px);
  }
  
  .error-modal {
    background-color: white;
    border-radius: 12px;
    width: 500px;
    max-width: 90vw;
    padding: 30px;
    box-shadow: 0 5px 30px rgba(0,0,0,0.3);
    text-align: center;
    animation: modalFadeIn 0.3s ease-out;
  }
  
  @keyframes modalFadeIn {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .error-modal i.fa-exclamation-triangle {
    color: #dc3545;
    font-size: 48px;
    margin-bottom: 20px;
  }
  .error-modal i.fa-check-circle {
    color: #28a745;
    font-size: 48px;
    margin-bottom: 20px;
  }
  .error-modal h3 {
    font-size: 24px;
    margin-bottom: 15px;
    color: #dc3545;
  }
  
  .error-modal p {
    font-size: 16px;
    margin-bottom: 25px;
    color: #495057;
    line-height: 1.6;
  }
  
  .error-modal .close-btn {
    padding: 10px 25px;
    background-color: #dc3545;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 16px;
    font-weight: 500;
    transition: all 0.2s;
  }
  
  .error-modal .close-btn:hover {
    background-color: #c82333;
    transform: translateY(-1px);
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 20px;
  }
  
  .back-btn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #f8f9fa;
    color: #495057;
    border: 1px solid #dee2e6;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }
  
  .back-btn:hover {
    background-color: #e9ecef;
    transform: translateX(-2px);
  }
  
  .back-btn i {
    font-size: 16px;
  }

  .export-btn {
    margin-left: 15px;
    padding: 8px 16px;
    background-color: #dc3545;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  
  
  
  .export-btn i {
    font-size: 14px;
  }

  .error-table-header {
    display: flex;
    align-items: center;
    gap: 15px;
    margin-bottom: 15px;
  }

  .valid-credits-container {
    margin-top: 20px;
  }

  .confirmation-actions {
    margin: 25px 0;
    text-align: center;
  }

  .confirm-btn {
    padding: 10px 25px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 16px;
    font-weight: 500;
    transition: all 0.2s;
  }

  .confirm-btn:hover {
    background-color: #1f7e36;
    transform: translateY(-1px);
  }

  .details-container {
    max-height: 500px;
    overflow-y: auto;
    padding-right: 10px;
  }

  .table-valid th {
    white-space: nowrap;
    padding: 8px 12px;
    font-size: 0.9rem;
  }

  .table-valid td {
    padding: 6px 10px;
    font-size: 0.85rem;
  }

  .expanded-row {
    background-color: #f8f9fa;
  }
  
  .detail-section {
    margin-bottom: 20px;
  }
  
  .detail-section h4 {
    color: #28a745;
    margin-bottom: 10px;
  }
  
  .detail-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 10px;
    margin-bottom: 15px;
  }
  
  .sub-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 15px;
  }
  
  .sub-table th, .sub-table td {
    padding: 8px;
    border: 1px solid #dee2e6;
  }
  
  .sub-table th {
    background-color: #e9ecef;
  }
  
  .credit-count {
    text-align: right;
    margin: 10px 0;
    font-size: 14px;
    color: #666;
  }
  
  .success-popup {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1000;
  }
  
  .popup-content.success {
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  }
  
  .popup-content.success i.fa-check-circle {
    color: #28a745;
  }
  `
})
export class ResultatComponent implements OnInit {
  showErrorCase = true;
  
  constructor(
    private viewState: ViewStateService,
    private router: Router,
    private mockDataService: GenererDonneesFictivesService
  ) {
    this.mockCredits = this.mockDataService.getMockCredits(5);
  }

  mockCredits: Credit[];

  invalidRows: { rowIndex: number, errors: string[] }[] = [
    { rowIndex: 2, errors: ['Champ "typeCredit" manquant', 'Code activité invalide'] },
    { rowIndex: 4, errors: ['Date d\'expiration antérieure à la date d\'octroi'] }
  ];

  currentValidPage = 1;
  currentInvalidPage = 1;
  itemsPerPage = 10;
  showErrorPopup = true;
  showSuccess = false;
  successMessage = '';
  expandedRows: boolean[] = [];

  changeValidPage(page: number) {
    this.currentValidPage = page;
  }

  changeInvalidPage(page: number) {
    this.currentInvalidPage = page;
  }

  closePopup() {
    this.showErrorPopup = false;
  }

  goBack() {
    this.router.navigate(['/fichiers-excel/integration']);
  }

  exportErrors() {
    // TO DO: implement export errors functionality
  }

  confirmInsertion() {
    // Your existing insertion logic
    this.showSuccessPopup('Les crédits ont été insérés avec succès!');
  }

  showSuccessPopup(message: string) {
    this.successMessage = message;
    this.showSuccess = true;
    setTimeout(() => this.showSuccess = false, 5000);
  }

  toggleRow(index: number) {
    this.expandedRows[index] = !this.expandedRows[index];
  }

  ngOnInit() {
    const lastView = sessionStorage.getItem('lastResultView');
    this.showErrorCase = lastView !== 'correct';
    sessionStorage.setItem('lastResultView', this.showErrorCase ? 'correct' : 'error');
  }
}
