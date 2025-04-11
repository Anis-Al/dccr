import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Credit } from '../../../../../core/models/credits';
import { Router } from '@angular/router';

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
  
  <ng-container *ngTemplateOutlet="errorCase"></ng-container>
</div>

  `,
  styles: `
  /* Base styles */
  .validation-result-container {
    padding: 25px 30px; /* Increase padding */
    background-color: #f9fafb; /* Light background for the page */
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; /* Modern font stack */
  }

  h1 {
    font-size: 1.8rem; /* Larger H1 */
    color: #333;
    margin-bottom: 25px; /* More space below H1 */
    font-weight: 600;
  }

  .file-name {
    font-weight: normal; /* Less emphasis on filename */
    color: #555;
    font-size: 1.6rem;
  }

  .section-title {
    font-size: 1.5rem; /* Slightly smaller section titles */
    margin-bottom: 15px;
    font-weight: 500;
    padding-bottom: 5px;
    border-bottom: 2px solid;
    display: inline-block; /* Fit border to text */
  }

  .vert {
    color: #28a745; /* Brighter green */
    border-bottom-color: #28a745;
  }

  .rouge {
    color: #dc3545; /* Standard danger red */
    border-bottom-color: #dc3545;
  }

  /* Keep existing table styles */
  .styled-table-container {
    overflow-x: auto;
    border: none; /* Remove table container border, rely on shadow */
    border-radius: 8px;
    margin: 1.5rem 0; /* Increased margin */
    background: white;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08); /* Softer shadow */
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
  `
})
export class ResultatComponent {
  constructor(private router: Router) {}

  invalidRows: { rowIndex: number, errors: string[] }[] = [
    { rowIndex: 2, errors: ['Champ "typeCredit" manquant', 'Code activité invalide'] },
    { rowIndex: 4, errors: ['Date d\'expiration antérieure à la date d\'octroi'] }
  ];

  currentValidPage = 1;
  currentInvalidPage = 1;
  itemsPerPage = 10;
  showErrorPopup = true;

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
}
