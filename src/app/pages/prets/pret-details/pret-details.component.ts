import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Credit } from '../../../core/models/credits';
import { Garantie } from '../../../core/models/credits';
import { Intervenant } from '../../../core/models/credits';


@Component({
  selector: 'app-pret-details',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="pret-details">
      <div class="header">
        <h1>
          <i class="fas fa-file-invoice-dollar"></i>
          Détails du Crédit
          <span class="contract-number">{{pret.numContrat}}</span>
        </h1>
        <div class="actions">
          <button class="btn btn-secondary" (click)="onClose()">
            <i class="fas fa-times"></i>
            Fermer
          </button>
          <button class="btn btn-primary" (click)="onEdit()">
            <i class="fas fa-edit"></i>
            Modifier
          </button>
        </div>
      </div>

      <div class="details-grid">
        <!-- Informations Générales -->
        <div class="details-section card">
          <h2>
            <i class="fas fa-info-circle"></i>
            Informations Générales
          </h2>
          <div class="details-content">
            <div class="detail-item">
              <span class="label">N° Contrat</span>
              <span class="value">{{pret.numContrat}}</span>
            </div>
            <div class="detail-item">
              <span class="label">Type de Crédit</span>
              <span class="value">{{getTypeCreditLabel(pret.libelleTypeCredit)}}</span>
            </div>
            <div class="detail-item">
              <span class="label">Plafond Accordé</span>
              <span class="value">{{pret.plafondAccorde ? 'Oui' : 'Non'}}</span>
            </div>
            <div class="detail-item">
              <span class="label">N° Plafond</span>
              <span class="value">{{pret.numeroPlafond}}</span>
            </div>
            <div class="detail-item">
              <span class="label">Code Activité</span>
              <span class="value">{{pret.codeActivite}}</span>
            </div>
            <div class="detail-item">
              <span class="label">Situation</span>
              <span class="value">{{getSituationLabel(pret.situation)}}</span>
            </div>
            <div class="detail-item" *ngIf="pret.motif">
              <span class="label">Motif</span>
              <span class="value">{{pret.motif}}</span>
            </div>
          </div>
        </div>

        <!-- Intervenants -->
        <div class="details-section card">
          <h2>
            <i class="fas fa-users"></i>
            Intervenants
          </h2>
          <div class="details-content">
            <div class="intervenant-list">
              <div *ngFor="let intervenant of pret.intervenants" class="intervenant-item card">
                <div class="intervenant-header">
                  <h3>{{intervenant.niveauResponsabilite}}</h3>
                </div>
                <div class="intervenant-details">
                  <div class="detail-item">
                    <span class="label">Identifiant</span>
                    <span class="value">{{intervenant.cle}}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">Type</span>
                    <span class="value">{{intervenant.typeCle}}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">NIF</span>
                    <span class="value">{{intervenant.nif}}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">RIB</span>
                    <span class="value">{{intervenant.rib}}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">Client</span>
                    <span class="value">{{intervenant.cli}}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">Solde Restant</span>
                    <span class="value">{{intervenant.soldeRestant | currency:pret.libelleDev}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Localisation -->
        <div class="details-section card">
          <h2>
            <i class="fas fa-map-marker-alt"></i>
            Localisation
          </h2>
          <div class="details-content">
            <div class="detail-item">
              <span class="label">Agence</span>
              <span class="value">{{pret.codeAgence}}</span>
            </div>
            <div class="detail-item">
              <span class="label">Wilaya</span>
              <span class="value">{{pret.codeWilaya}}</span>
            </div>
            <div class="detail-item">
              <span class="label">Pays</span>
              <span class="value">{{pret.codePays}}</span>
            </div>
          </div>
        </div>

        <!-- Conditions Financières -->
        <div class="details-section card">
          <h2>
            <i class="fas fa-euro-sign"></i>
            Conditions Financières
          </h2>
          <div class="details-content">
            <div class="detail-item">
              <span class="label">Montant Accordé</span>
              <span class="value">{{pret.creditsAccorde}}</span>
            </div>
            <div class="detail-item">
              <span class="label">Devise</span>
              <span class="value">{{pret.libelleDev}}</span>
            </div>
            <div class="detail-item">
              <span class="label">Taux d'Intérêt</span>
              <span class="value">{{pret.tauxInterets}}%</span>
            </div>
            <div class="detail-item">
              <span class="label">Coût Total</span>
              <span class="value">{{pret.coutCredits | currency:pret.libelleDev}}</span>
            </div>
          </div>
        </div>

        <!-- Remboursement -->
        <div class="details-section card">
          <h2>
            <i class="fas fa-calendar-check"></i>
            Remboursement
          </h2>
          <div class="details-content">
            <div class="detail-item">
              <span class="label">Mensualité</span>
              <span class="value">{{pret.mensualite | currency:pret.libelleDev}}</span>
            </div>
            <div class="detail-item">
              <span class="label">Durée Initiale</span>
              <span class="value">{{pret.dureeInit}} mois</span>
            </div>
            <div class="detail-item">
              <span class="label">Durée Restante</span>
              <span class="value">{{pret.dureeRestante}} mois</span>
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
              <span class="value" [class.warning]="pret.classeRetard > 0">
                {{getClasseRetardLabel(pret.classeRetard)}}
              </span>
            </div>
            <div class="detail-item">
              <span class="label">Échéances Impayées</span>
              <span class="value" [class.warning]="pret.nombreEcheancesImpayes > 0">
                {{pret.nombreEcheancesImpayes}}
              </span>
            </div>
            <div class="detail-item">
              <span class="label">Date de Constatation</span>
              <span class="value">{{pret.dateConstatationEcheancesImpayes}}</span>
            </div>
            <div class="detail-item">
              <span class="label">Capital en Retard</span>
              <span class="value" [class.warning]="pret.montantCapitalRetard > 0">
                {{pret.montantCapitalRetard | currency:pret.libelleDev}}
              </span>
            </div>
            <div class="detail-item">
              <span class="label">Intérêts de Retard</span>
              <span class="value" [class.warning]="pret.montantInteretsRetard > 0">
                {{pret.montantInteretsRetard | currency:pret.libelleDev}}
              </span>
            </div>
          </div>
        </div>

        <!-- Dates -->
        <div class="details-section card">
          <h2>
            <i class="fas fa-calendar-alt"></i>
            Dates
          </h2>
          <div class="details-content">
            <div class="detail-item">
              <span class="label">Date d'Octroi</span>
              <span class="value">{{pret.dateOctroi}}</span>
            </div>
            <div class="detail-item">
              <span class="label">Date d'Expiration</span>
              <span class="value">{{pret.dateExpiration}}</span>
            </div>
            <div class="detail-item">
              <span class="label">Date de Déclaration</span>
              <span class="value">{{pret.dateDeclaration}}</span>
            </div>
            <div class="detail-item">
              <span class="label">Date de Rejet</span>
              <span class="value">{{pret.dateRejet}}</span>
            </div>
          </div>
        </div>

        <!-- Garanties -->
        <div class="details-section card">
          <h2>
            <i class="fas fa-shield-alt"></i>
            Garanties
          </h2>
          <div class="details-content">
            <div class="garantie-list">
              <div *ngFor="let garantie of pret.garanties" class="garantie-item card">
                <div class="garantie-header">
                  <h3>{{garantie.type}}</h3>
                </div>
                <div class="garantie-details">
                  <div class="detail-item">
                    <span class="label">Intervenant</span>
                    <span class="value">{{garantie.intervenant}}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">Montant</span>
                    <span class="value">{{garantie.montant | currency:pret.libelleDev}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- Source -->
        <div class="details-section card">
          <h2>
            <i class="fas fa-file-import"></i>
            Source
          </h2>
          <div class="details-content">
            <div class="detail-item">
              <span class="label">Type de Création</span>
              <span class="value source-badge" [class]="pret.source.type">
                {{pret.source.type === 'excel' ? 'Import Excel' : 'Création Manuel'}}
              </span>
            </div>
            <div class="detail-item" *ngIf="pret.source.type === 'excel'">
              <span class="label">Fichier Source</span>
              <span class="value">{{pret.source.fileName}}</span>
            </div>
            <div class="detail-item" *ngIf="pret.source.type === 'excel'">
              <span class="label">Date d'Import</span>
              <span class="value">{{pret.source.importDate}}</span>
            </div>
            <div class="detail-item" *ngIf="pret.source.type === 'manual'">
              <span class="label">Crée par</span>
              <span class="value">{{pret.source.createdBy}}</span>
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
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2.5rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid #e9ecef;
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

    .actions {
      display: flex;
      gap: 1rem;
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
      background-color: #e74c3c;
      color: white;
    }

    .btn-primary:hover {
      background-color: #c0392b;
    }

    .btn-secondary {
      background-color: #f8f9fa;
      color: #6c757d;
      border: 1px solid #dee2e6;
    }

    .btn-secondary:hover {
      background-color: #e9ecef;
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
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .details-section:hover {
      transform: translateY(-2px);
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
      transition: background-color 0.2s ease;
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
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .intervenant-item:hover,
    .garantie-item:hover {
      transform: translateY(-2px);
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
export class PretDetailsComponent {
  @Input() pret!: Credit;
  @Output() close = new EventEmitter<void>();

  constructor(private router: Router) {}

  getTypeCreditLabel(type: string): string {
    const types = {
      '1': 'Prêt Immobilier',
      '2': 'Prêt à la Consommation',
      '3': 'Prêt Professionnel',
      '4': 'Prêt Étudiant'
    };
    return types[type as keyof typeof types] || 'Inconnu';
  }

  getSituationLabel(situation: number): string {
    const situations = {
      1: 'En Cours',
      2: 'Terminé',
      3: 'En Retard',
      4: 'Rejeté'
    };
    return situations[situation as keyof typeof situations] || 'Inconnu';
  }

  getClasseRetardLabel(classe: number): string {
    const classes = {
      0: 'Aucun Retard',
      1: 'Retard < 30 jours',
      2: 'Retard 30-90 jours',
      3: 'Retard > 90 jours'
    };
    return classes[classe as keyof typeof classes] || 'Inconnu';
  }

  onClose() {
    this.close.emit();
  }

  onEdit() {
    console.log('Editing loan:', this.pret);
    this.router.navigate(['/credits/modifier', this.pret.numContrat], {
      state: { pret: this.pret }
    }).then(() => {
      console.log('Navigation successful');
    }).catch(error => {
      console.error('Navigation failed:', error);
    });
  }
} 
