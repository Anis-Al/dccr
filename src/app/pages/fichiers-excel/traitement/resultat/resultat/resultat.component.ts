import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreditDto } from '../../../../../core/models/credits';
import { Router } from '@angular/router';
import { ViewStateService } from '../../../../../core/services/view-state.service';
import { ActivatedRoute } from '@angular/router';
import { ReponseIntegrationDto } from '../../../../../core/dtos/integration-response.dto';
import { ApiService } from '../../../../../core/services/api.service';
import { HttpResponse } from '@angular/common/http';

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
       <h1>Résultats pour : <span class="file-name">{{ result.NomFichierExcel || fileName }}</span></h1>
     </div>

   <ng-container *ngIf="result?.contientErreurs; else noErrorCase">
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
      <button class="export-btn" (click)="telechargerFichierErreurs()">
        <i class="fas fa-file-export"></i> Exporter
      </button>
    </div>
    <div class="styled-table-container">
      <table class="table-invalid">
        <thead>
          <tr>
            <th>Ligne</th>
            <th>Erreurs</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let row of erreurs;">
            <td>{{ row.ligne }}</td>
            <td>
              <ol>
                <li *ngFor="let err of row.messages">{{ err }}</li>
              </ol>
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
                [disabled]="currentInvalidPage * itemsPerPage >= erreurs.length">
          Suivant
        </button>
      </div>
    </div>
  </ng-container>

  <ng-template #noErrorCase>
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
            <ng-container *ngFor="let credit of apercuDonnees; let i = index">
              <tr (click)="toggleRow(i)">
                <td>
                  <i class="fas" [class.fa-chevron-right]="!expandedRows[i]" [class.fa-chevron-down]="expandedRows[i]"></i>
                </td>
                <td>{{ i + 1 }}</td>
                <td>{{ credit.numeroContrat || 'vide' }}</td>
              </tr>
      
              <tr *ngIf="expandedRows[i]" class="expanded-row">
                <td colspan="3">
                  <div class="details-container">
                    <div class="detail-section">
                      <h4>Détails du crédit #{{i + 1}} - {{credit.numeroContrat}}</h4>
                      <div class="detail-grid">
                        <div><strong>Date déclaration:</strong> {{ credit.dateDeclaration || 'vide' }}</div>
                        <div><strong>Type:</strong> {{ credit.typeCredit || 'vide' }}</div>
                        <div><strong>Statut:</strong> {{ credit.situationCredit || 'vide' }}</div>
                        <div><strong>Montant accordé:</strong> {{ credit.creditAccorde || 'vide' }}</div>
                        <div><strong>Solde restant:</strong> {{ credit.soldeRestant || 'vide' }}</div>
                        <div><strong>Taux:</strong> {{ credit.taux || 'vide' }}</div>
                        <div><strong>Classe retard:</strong> {{ credit.classeRetard || 'vide' }}</div>
                        <div><strong>Nombre échéances impayées:</strong> {{ credit.nombreEcheancesImpayes || 'vide' }}</div>
                        <div><strong>Durée initiale:</strong> {{ credit.dureeInitiale || 'vide' }}</div>
                        <div><strong>Durée restante:</strong> {{ credit.dureeRestante || 'vide' }}</div>
                        <div><strong>Monnaie:</strong> {{ credit.monnaie || 'vide' }}</div>
                        <div><strong>Montant intérêts courus:</strong> {{ credit.montantInteretsCourus || 'vide' }}</div>
                        <div><strong>Montant intérêts retard:</strong> {{ credit.montantInteretsRetard || 'vide' }}</div>
                        <div><strong>Montant capital retard:</strong> {{ credit.montantCapitalRetard || 'vide' }}</div>
                        <div><strong>Mensualité:</strong> {{ credit.mensualite || 'vide' }}</div>
                        <div><strong>Motif:</strong> {{ credit.motif || 'vide' }}</div>
                        <div><strong>Date exécution:</strong> {{ credit.dateExecution || 'vide' }}</div>
                        <div><strong>Date constatation:</strong> {{ credit.dateConstatation || 'vide' }}</div>
                        <div><strong>Date rejet:</strong> {{ credit.dateRejet || 'vide' }}</div>
                        <div><strong>ID plafond:</strong> {{ credit.idPlafond || 'vide' }}</div>
                        <div><strong>Coût total crédit:</strong> {{ credit.coutTotalCredit || 'vide' }}</div>
                        <div><strong>Activité crédit:</strong> {{ credit.activiteCredit || 'vide' }}</div>
                      </div>
                    </div>
                    <div class="detail-section">
                      <h4>Lieu</h4>
                      <div class="detail-grid">
                        <div><strong>Agence:</strong> {{ credit.codeAgence || 'vide' }}</div>
                        <div><strong>Code pays:</strong> {{ credit.codePays || 'vide' }}</div>
                        <div><strong>Code wilaya:</strong> {{ credit.codeWilaya || 'vide' }}</div>
                      </div>
                    </div>
                    <div class="detail-section">
                      <h4>Participants</h4>
                      <table class="sub-table">
                        <thead>
                          <tr>
                            <th>Clé</th>
                            <th>CLI</th>
                            <th>NIF</th>
                            <th>RIB</th>
                            <th>Type</th>
                            <th>Rôle</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr *ngFor="let participant of credit.participants">
                            <td>{{ participant.participantCle || 'vide' }}</td>
                            <td>{{ participant.participantCli || 'vide' }}</td>
                            <td>{{ participant.participantNif || 'vide' }}</td>
                            <td>{{ participant.participantRib || 'vide' }}</td>
                            <td>{{ participant.participantType || 'vide' }}</td>
                            <td>{{ participant.roleNiveauResponsabilite || 'vide' }}</td>
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
                            <th>Montant</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr *ngFor="let garantie of credit.garanties">
                            <td>{{ garantie.typeGarantie || 'vide' }}</td>
                            <td>{{ garantie.montantGarantie || 'vide' }}</td>
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
        Total : {{ apercuDonnees.length }}
      </div>
      
      <div class="confirmation-actions">
        <button class="confirm-btn" (click)="confirmInsertion()">
          Confirmer l'intégration
        </button>
      </div>
    </div>
   
  </ng-template>
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

  .table-valid th, .sub-table th {
    background: #fff !important;
    color: #222;
    white-space: nowrap;
    padding: 8px 12px;
    font-size: 0.9rem;
    border-bottom: 1px solid #dee2e6;
  }

  .table-valid th:hover, .sub-table th:hover, .table-valid tr:hover, .sub-table tr:hover {
    background: inherit !important;
    cursor: default;
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
  
  .sub-table td {
    padding: 8px;
    border: 1px solid #dee2e6;
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
  result!: ReponseIntegrationDto;
  fileName: string = '';
  showErrorCase = true;
  apercuDonnees: any[] = [];
  idExcel=this.result?.idExcel;
  
  constructor(
    private route: ActivatedRoute,
    private viewState: ViewStateService,
    private router: Router,
    private aps:ApiService
  ) 
  {
  }


  get erreurs() {
    return this.result?.erreurs || [];
  }

  

  currentValidPage = 1;
  currentInvalidPage = 1;
  itemsPerPage = 10;
  showErrorPopup = true;
  showSuccess = false;
  successMessage = '';
  expandedRows: boolean[] = [];

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['result']) {
        this.result = JSON.parse(params['result']);
        this.apercuDonnees = this.result?.apercuDonnees || [];
      }
      if (params['fileName']) {
        this.fileName = params['fileName'];
      }
    });
    const lastView = sessionStorage.getItem('lastResultView');
    this.showErrorCase = lastView !== 'correct';
    sessionStorage.setItem('lastResultView', this.showErrorCase ? 'correct' : 'error');
  }

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

  telechargerFichierErreurs(): void {
    if (!this.idExcel) {
      return;
    }
    this.aps.telechargerFichierErreursExcel(this.idExcel).subscribe({
      next: (response: HttpResponse<Blob>) => {
        const blob = response.body;
        console.log(blob);

        if (!blob || blob.size === 0) {
          console.warn(`No error data found or empty file received for File ID: ${this.idExcel}.`);
          alert(`No errors found to download for File ID: ${this.idExcel}.`); // User feedback
          return;
        }

        const filename = this.extraireNomFichier(response) ?? `erreurs_${this.result.NomFichierExcel}.xlsx`;
        this.declencherTelechargement(blob, filename);
        console.log(`Download triggered for: ${filename}`);
      },
      error: (err) => {
        alert(err.status); 
      }
    });
  }
  private extraireNomFichier(reponse: HttpResponse<Blob>): string | null {
    const contentDisposition = reponse.headers.get('content-disposition');
    if (!contentDisposition) return null;

    const matches = /filename[^;=\n]*=(?:(['"])(.*?)\1|([^;\n]*))/i.exec(contentDisposition);
    let nomFichier = (matches && matches[3] ? matches[3].trim() : (matches && matches[2] ? matches[2].trim() : null));

    if (nomFichier) {
      try {
        return decodeURIComponent(nomFichier);
      } catch (e) {
        return nomFichier;
      }
    }
    return null; 
  }
  private declencherTelechargement(blob: Blob, nomFichier: string): void {
    const url = window.URL.createObjectURL(blob);
    const ancre = document.createElement('a');
    ancre.href = url;
    ancre.download = nomFichier;
    ancre.style.display = 'none';
    document.body.appendChild(ancre);
    ancre.click();
    document.body.removeChild(ancre);
    window.URL.revokeObjectURL(url);
  }
}
