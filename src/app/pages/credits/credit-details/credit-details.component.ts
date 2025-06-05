import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CreditDto } from '../../../core/dtos/Credits/credits';
import { CreditStateService } from '../../../core/services/credits/credit-state.service';



@Component({
  selector: 'app-pret-details',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pret-details">
      <div class="header">
        <div class="header-main">
          <h1>
            <i class="fas fa-file-invoice-dollar"></i>
            Détails du Crédit
          </h1>
          <button class="btn btn-icon" (click)="onClose()" title="Fermer">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="action-group" *ngIf="!fromCreditsList">
          <button class="btn btn-primary" (click)="onEdit()">
            <i class="fas fa-edit"></i>
            Modifier
          </button>
          <button class="btn btn-danger" (click)="onDelete()">
            <i class="fas fa-trash-alt"></i>
            Supprimer
          </button>
        </div>
      </div>

      <div class="details-grid">
        <div class="details-section card">
          <h2>
            <i class="fas fa-info-circle"></i>
            Informations Générales
          </h2>
          <div class="details-content">
            <div class="detail-item">
              <span class="label">N° Contrat</span>
              <span class="value">{{pret.num_contrat_credit}}</span>
            </div>
            <div class="detail-item">
              <span class="label">Type de Crédit</span>
              <span class="value">{{pret.libelle_type_credit}}</span>
            </div>
            <div class="detail-item">
              <span class="label">Plafond Accordé</span>
              <span class="value">{{pret.est_plafond_accorde ? 'Oui' : 'Non'}}</span>
            </div>
            <div class="detail-item">
              <span class="label">N° Plafond</span>
              <span class="value">{{pret.id_plafond}}</span>
            </div>
            <div class="detail-item">
              <span class="label">Code Activité</span>
              <span class="value">{{pret.libelle_activite}}</span>
            </div>
            <div class="detail-item">
              <span class="label">Situation</span>
              <span class="value">{{pret.libelle_situation}}</span>
            </div>
            <div class="detail-item" *ngIf="pret.motif">
              <span class="label">Motif</span>
              <span class="value">{{pret.motif}}</span>
            </div>
          </div>
        </div>

        <div class="details-section card">
          <h2>
            <i class="fas fa-users"></i>
            Intervenants
          </h2>
          <div class="details-content">
            <div class="intervenant-list">
              <div *ngFor="let intervenant of pret.intervenants" class="intervenant-item card">
                <div class="intervenant-header">
                  <h3>{{intervenant.libelle_niveau_responsabilite}}</h3>
                </div>
                <div class="intervenant-details">
                  <div class="detail-item">
                    <span class="label">Client</span>
                    <span class="value">{{intervenant.cli}}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">Clé</span>
                    <span class="value">{{intervenant.cle}}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">Type</span>
                    <span class="value">{{intervenant.type_cle}}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">NIF</span>
                    <span class="value">{{intervenant.nif}}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">RIB</span>
                    <span class="value">{{intervenant.rib}}</span>
                  </div>
                  
                  
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="details-section card">
          <h2>
            <i class="fas fa-map-marker-alt"></i>
            Lieu
          </h2>
          <div class="details-content">
            <div class="detail-item">
              <span class="label">Agence</span>
              <span class="value">{{pret.libelle_agence}} ({{pret.code_agence}}) </span>
            </div>
            <div class="detail-item">
              <span class="label">Wilaya</span>
              <span class="value">{{pret.libelle_wilaya}} ({{pret.code_wilaya}}) </span>
            </div>
            <div class="detail-item">
              <span class="label">Pays</span>
              <span class="value">{{pret.libelle_pays}} ({{pret.code_pays}}) </span>
            </div>
          </div>
        </div>

        <div class="details-section card">
          <h2>
            <i class="fas fa-euro-sign"></i>
            Conditions Financières
          </h2>
          <div class="details-content">
            <div class="detail-item">
              <span class="label">Crédit Accordé</span>
              <span class="value">{{pret.credit_accorde ? (pret.credit_accorde | currency:(pret.monnaie || '')) : ''}}</span>
            </div>
            <div class="detail-item">
              <span class="label">Devise</span>
              <span class="value">{{pret.libelle_monnaie}} ({{pret.monnaie}})</span>
            </div>
            <div class="detail-item">
              <span class="label">Taux d'Intérêt</span>
              <span class="value">{{pret.taux_interets}}%</span>
            </div>
            <div class="detail-item">
              <span class="label">Coût Total</span>
              <span class="value">{{pret.cout_total_credit ? (pret.cout_total_credit | currency:(pret.monnaie || '')) : ''}}</span>
            </div>
            <div class="detail-item">
              <span class="label">Solde restant</span>
              <span class="value">{{pret.solde_restant ? (pret.solde_restant | currency:(pret.monnaie || '')) : ''}}</span>
            </div>
          </div>
        </div>

        <div class="details-section card">
          <h2>
            <i class="fas fa-calendar-check"></i>
            Remboursement
          </h2>
          <div class="details-content">
            <div class="detail-item">
              <span class="label">Mensualité</span>
              <span class="value">{{pret.mensualite !== null && pret.monnaie ? (pret.mensualite | currency:pret.monnaie) : ''}}</span>
            </div>
            <div class="detail-item">
              <span class="label">Durée Initiale</span>
              <span class="value">{{pret.libelle_duree_initiale}}</span>
            </div>
            <div class="detail-item">
              <span class="label">Durée Restante</span>
              <span class="value">{{pret.libelle_duree_restante}}</span>
            </div>
          </div>
        </div>

        <!-- Retard -->
        <div class="details-section card">
          <h2>
            <i class="fas fa-exclamation-triangle"></i>
            Retard
          </h2>
          <div class="details-content">
            <div class="detail-item">
              <span class="label">Classe de Retard</span>
              <span class="value" >
                {{pret.libelle_classe_retard}}
              </span>
            </div>
            <div class="detail-item">
              <span class="label">Échéances Impayées</span>
              <span class="value" >
                {{pret.nombre_echeances_impayes}}
              </span>
            </div>
            <div class="detail-item">
              <span class="label">Date de Constatation</span>
              <span class="value">{{pret.date_constatation_echeances_impayes}}</span>
            </div>
            <div class="detail-item">
              <span class="label">Capital en Retard</span>
              <span class="value">
                {{pret.montant_capital_retard !== null && pret.monnaie ? (pret.montant_capital_retard | currency:pret.monnaie) : ''}}
              </span>
            </div>
            <div class="detail-item">
              <span class="label">Intérêts En Retard</span>
              <span class="value" >
                {{pret.montant_interets_retard !== null && pret.monnaie ? (pret.montant_interets_retard | currency:pret.monnaie) : ''}}
              </span>
            </div>
            <div class="detail-item">
              <span class="label">Intérêts Courus</span>
              <span class="value" >
                {{pret.montant_interets_courus !== null && pret.monnaie ? (pret.montant_interets_courus | currency:pret.monnaie) : ''}}
              </span>
            </div>
          </div>
        </div>

        <div class="details-section card">
          <h2>
            <i class="fas fa-calendar-alt"></i>
            Dates
          </h2>
          <div class="details-content">
          <div class="detail-item">
              <span class="label">Date de Déclaration</span>
              <span class="value">{{pret.date_declaration}}</span>
            </div>
            <div class="detail-item">
              <span class="label">Date d'Octroi</span>
              <span class="value">{{pret.date_octroi}}</span>
            </div>
            <div class="detail-item">
              <span class="label">Date de Rejet</span>
              <span class="value">{{pret.date_rejet}}</span>
            </div>
            <div class="detail-item">
              <span class="label">Date d'Expiration</span>
              <span class="value">{{pret.date_expiration}}</span>
            </div>
            <div class="detail-item">
              <span class="label">Date d'execution</span>
              <span class="value">{{pret.date_execution}}</span>
            </div>
            
          </div>
        </div>

        <div class="details-section card">
          <h2>
            <i class="fas fa-shield-alt"></i>
            Garanties
          </h2>
          <div class="details-content">
            <div class="garantie-list">
              <div *ngFor="let garantie of pret.garanties" class="garantie-item card">
                <div class="garantie-header">
                  <h3>{{garantie.libelle_type_garantie}} ({{garantie.type_garantie}})</h3>
                </div>
                <div class="garantie-details">
                  <div class="detail-item">
                    <span class="label">Intervenant</span>
                    <span class="value">{{garantie.cle_intervenant}}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">Montant</span>
                    <span class="value">{{garantie.montant_garantie !== null && pret.monnaie ? (garantie.montant_garantie | currency:pret.monnaie) : ''}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

       
      </div>
    </div>
  `,
  styles: [`
    .pret-details {
      padding: 2rem;
      height: 100%;
      overflow-y: auto;
      background-color: #f8f9fa;
    }

    .header {
      margin-bottom: 2.5rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid #e9ecef;
    }

    .header-main {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .header h1 {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin: 0;
      font-size: 1.5rem;
      color: #e74c3c;
    }

    .contract-number {
      color: #e74c3c;
      font-weight: 600;
      background-color: #fdf0f0;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 1rem;
    }

    .action-group {
      display: flex;
      gap: 1rem;
      justify-content: flex-start;
    }

    .btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      font-weight: 500;
      transition: all 0.2s ease;
      cursor: pointer;
      border: none;
    }

    .btn-primary {
      background-color: #2196F3;
      color: white;
    }

    .btn-primary:hover {
      background-color: #1976D2;
      color: white;
    }

    .btn-secondary {
      background-color: #f8f9fa;
      color: #6c757d;
      border: 1px solid #dee2e6;
    }

    .btn-secondary:hover {
      background-color: #e9ecef;
    }

    .btn-danger {
      background-color: #dc3545;
      color: white;
    }

    .btn-danger:hover {
      background-color: #c82333;
    }

    .details-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 2rem;
    }

    .details-section {
      background: white;
      border-radius: 12px;
      padding: 1.75rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .details-section:hover {
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .details-section h2 {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin: 0 0 1.5rem 0;
      color: #e74c3c;
      font-size: 1.25rem;
    }

    .details-section h2 i {
      color: #e74c3c;
      font-size: 1.1em;
    }

    .details-content {
      display: grid;
      gap: 1.25rem;
    }

    .detail-item {
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 1rem;
      align-items: start;
      padding: 0.75rem;
      background-color: #f8f9fa;
      border-radius: 8px;
    }

    .detail-item:hover {
      background-color: #e9ecef;
    }

    .label {
      color: #6c757d;
      font-weight: 500;
      font-size: 0.9rem;
    }

    .value {
      color: #2c3e50;
      font-weight: 500;
    }

    .warning {
      color: #e74c3c;
      font-weight: 600;
    }

    .intervenant-list,
    .garantie-list {
      display: grid;
      gap: 1.25rem;
    }

    .intervenant-item,
    .garantie-item {
      background: #f8f9fa;
      border-radius: 10px;
      padding: 1.25rem;
    }

    .intervenant-item:hover,
    .garantie-item:hover {
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
    }

    .intervenant-header,
    .garantie-header {
      margin-bottom: 1.25rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid #e9ecef;
    }

    .intervenant-header h3,
    .garantie-header h3 {
      margin: 0;
      color: #e74c3c;
      font-size: 1.1rem;
    }

    .source-badge {
      display: inline-block;
      padding: 0.35rem 0.75rem;
      border-radius: 20px;
      font-size: 0.875rem;
      font-weight: 600;
      letter-spacing: 0.3px;

      &.excel {
        background-color: #fdf0f0;
        color: #e74c3c;
      }

      &.manual {
        background-color: #fdf0f0;
        color: #e74c3c;
      }
    }

    @media (max-width: 768px) {
      .pret-details {
        padding: 1rem;
      }

      .header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }

      .actions {
        width: 100%;
        justify-content: center;
      }

      .details-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class CreditDetailsComponent {
  @Input() pret!: CreditDto;
  @Input() fromCreditsList: boolean = false;
  @Output() close = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();

  constructor(
    private router: Router,
    private creditStateService: CreditStateService
  ) {}

  onClose() {
    this.close.emit();
  }

  onEdit() {
    this.creditStateService.setSelectedCredit(this.pret);
    this.creditStateService.setEditMode(true);
    this.router.navigate(['/credits/modifier', this.pret.num_contrat_credit])
      .catch(error => {
        console.error('Navigation error:', error);
      });
  }

  onDelete() {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce crédit ?')) {
      this.delete.emit();
    }
  }
}
