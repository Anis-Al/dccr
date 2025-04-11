import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Credit } from '../../../core/models/credits';

@Component({
  selector: 'app-pret-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="pret-form">
      <div class="header">
        <h1>
          <i class="fas" [ngClass]="isEditMode ? 'fa-edit' : 'fa-plus'"></i>
          {{isEditMode ? 'Modifier' : 'Nouveau'}} Crédit
          <span class="contract-number" *ngIf="isEditMode">{{pret.numContrat}}?</span>
        </h1>
        <div class="actions">
          <button class="btn btn-secondary" (click)="onCancel()">
            <i class="fas fa-times"></i>
            Annuler
          </button>
          <button class="btn btn-primary" (click)="onSave()">
            <i class="fas fa-save"></i>
            Enregistrer
          </button>
        </div>
      </div>

      <div class="form-container">
        <!-- 1. Informations Générales -->
        <div class="form-section">
          <h2>
            <i class="fas fa-info-circle"></i>
            Informations Générales
          </h2>
          <div class="form-grid">
            <div class="form-group">
              <label>N° Contrat</label>
              <input type="text" [(ngModel)]="pret.numContrat" [disabled]="isEditMode">
            </div>
            <div class="form-group">
              <label>Type de Crédit</label>
              <select [(ngModel)]="pret.typeCredit">
                <option value="1">Credit automobile</option>
             
              </select>
            </div>
            <div class="form-group">
              <label>Plafond Accordé</label>
              <div class="radio-group">
                <label>
                  <input type="radio" name="plafondAccorde" [(ngModel)]="pret.plafondAccorde" [value]="true">
                  Oui
                </label>
                <label>
                  <input type="radio" name="plafondAccorde" [(ngModel)]="pret.plafondAccorde" [value]="false">
                  Non
                </label>
              </div>
            </div>
            <div class="form-group" *ngIf="pret.plafondAccorde">
              <label>N° Plafond</label>
              <input type="text" [(ngModel)]="pret.numeroPlafond">
            </div>
            <div class="form-group">
              <label>Activité</label>
              <select [(ngModel)]="pret.libelleActivite">
                <option [ngValue]="1">Agriculture, Chasse, Services Annexe</option>
                <option [ngValue]="2">Pêche, Aquaculture</option>
                <option [ngValue]="3">Industrie du Papier et du Carton</option>
                <option [ngValue]="4">Industrie Textile</option>
              </select>
            </div>
            <div class="form-group">
              <label>Situation</label>
              <select [(ngModel)]="pret.situation">
                <option [ngValue]="1">Crédit régulier</option>
                <option [ngValue]="2">Crédit rejeté</option>
                <option [ngValue]="3">Crédit impayé</option>
              </select>
            </div>
            <div class="form-group">
              <label>Motif</label>
              <input type="text" [(ngModel)]="pret.motif">
            </div>
          </div>
        </div>

        <!-- 2. Intervenants -->
        <div class="form-section">
          <h2>
            <i class="fas fa-users"></i>
            Débiteurs
            <button class="btn btn-danger" (click)="addIntervenant()">
              <i class="fas fa-plus"></i>
              Ajouter Débiteur
            </button>
          </h2>
          <div class="form-grid">
            <div class="form-group" *ngFor="let intervenant of pret.intervenants; let i = index">
              <h3>
                Débiteur {{i + 1}}
                <button class="btn btn-danger" (click)="removeIntervenant(i)" *ngIf="pret.intervenants.length > 1">
                  <i class="fas fa-trash"></i>
                  Supprimer
                </button>
              </h3>
              <div class="form-grid">
                <div class="form-group">
                  <label>Clé</label>
                  <input type="text" [(ngModel)]="intervenant.cle">
                </div>
                <div class="form-group">
                  <label>Type de Clé</label>
                  <select [(ngModel)]="intervenant.typeCle">
                    <option value="Personne Physique">Personne Physique</option>
                    <option value="Personne Morale">Personne Morale</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Niveau de Responsabilité</label>
                  <select [(ngModel)]="intervenant.niveauResponsabilite">
                    <option value="Emprunteur Principal">Emprunteur Principal</option>
                    <option value="Co-emprunteur">Co-emprunteur</option>
                    <option value="Garant">Garant</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>NIF</label>
                  <input type="text" [(ngModel)]="intervenant.nif">
                </div>
                <div class="form-group">
                  <label>RIB</label>
                  <input type="text" [(ngModel)]="intervenant.rib">
                </div>
                <div class="form-group">
                  <label>CLI</label>
                  <input type="text" [(ngModel)]="intervenant.cli">
                </div>
                
              </div>
            </div>
          </div>
        </div>

        <!-- 3. Localisation -->
        <div class="form-section">
          <h2>
            <i class="fas fa-map-marker-alt"></i>
            Localisation
          </h2>
          <div class="form-grid">
            <div class="form-group">
              <label>Code Agence</label>
              <input type="text" [(ngModel)]="pret.codeAgence">
            </div>
            <div class="form-group">
              <label>Code Wilaya</label>
              <input type="text" [(ngModel)]="pret.codeWilaya">
            </div>
            <div class="form-group">
              <label>Code Pays</label>
              <input type="text" [(ngModel)]="pret.codePays">
            </div>
          </div>
        </div>

        <!-- 4. Conditions Financières -->
        <div class="form-section">
          <h2>
            <i class="fas fa-euro-sign"></i>
            Conditions Financières
          </h2>
          <div class="form-grid">
            <div class="form-group">
              <label>Crédits Accordés</label>
              <input type="number" [(ngModel)]="pret.creditsAccorde">
            </div>
            <div class="form-group">
              <label>Devise</label>
              <select [(ngModel)]="pret.dev">
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
                <option value="DZD">DZD</option>
              </select>
            </div>
            <div class="form-group">
              <label>Taux d'Intérêts</label>
              <input type="number" [(ngModel)]="pret.tauxInterets" step="0.01">
            </div>
            <div class="form-group">
              <label>Coût des Crédits</label>
              <input type="number" [(ngModel)]="pret.coutCredits">
            </div>
          </div>
        </div>

        <!-- 5. Remboursement -->
        <div class="form-section">
          <h2>
            <i class="fas fa-calendar-check"></i>
            Remboursement
          </h2>
          <div class="form-grid">
            <div class="form-group">
              <label>Mensualité</label>
              <input type="number" [(ngModel)]="pret.mensualite">
            </div>
            <div class="form-group">
              <label>Durée Initiale (mois)</label>
              <input type="number" [(ngModel)]="pret.dureeInit">
            </div>
            <div class="form-group">
              <label>Durée Restante (mois)</label>
              <input type="number" [(ngModel)]="pret.dureeRestante">
            </div>
          </div>
        </div>

        <!-- 6. Retard -->
        <div class="form-section">
          <h2>
            <i class="fas fa-exclamation-triangle"></i>
            Retard
          </h2>
          <div class="form-grid">
            <div class="form-group">
              <label>Classe de Retard</label>
              <select [(ngModel)]="pret.classeRetard">
                <option [ngValue]="0">Aucun Retard</option>
                <option [ngValue]="1">Retard < 30 jours</option>
                <option [ngValue]="2">Retard 30-90 jours</option>
                <option [ngValue]="3">Retard > 90 jours</option>
              </select>
            </div>
            <div class="form-group">
              <label>Nombre d'Échéances Impayées</label>
              <input type="number" [(ngModel)]="pret.nombreEcheancesImpayes">
            </div>
            <div class="form-group">
              <label>Date de Constatation</label>
              <input type="date" [(ngModel)]="pret.dateConstatationEcheancesImpayes">
            </div>
            <div class="form-group">
              <label>Montant Capital en Retard</label>
              <input type="number" [(ngModel)]="pret.montantCapitalRetard">
            </div>
            <div class="form-group">
              <label>Montant Intérêts en Retard</label>
              <input type="number" [(ngModel)]="pret.montantInteretsRetard">
            </div>
            <div class="form-group">
              <label>Montant Intérêts Courus</label>
              <input type="number" [(ngModel)]="pret.montantInteretsCourus">
            </div>
          </div>
        </div>

        <!-- 7. Dates -->
        <div class="form-section">
          <h2>
            <i class="fas fa-calendar-alt"></i>
            Dates
          </h2>
          <div class="form-grid">
            <div class="form-group">
              <label>Date d'Octroi</label>
              <input type="date" [(ngModel)]="pret.dateOctroi">
            </div>
            <div class="form-group">
              <label>Date d'Expiration</label>
              <input type="date" [(ngModel)]="pret.dateExpiration">
            </div>
            <div class="form-group">
              <label>Date de Déclaration</label>
              <input type="date" [(ngModel)]="pret.dateDeclaration">
            </div>
            <div class="form-group">
              <label>Date de Rejet</label>
              <input type="date" [(ngModel)]="pret.dateRejet">
            </div>
          </div>
        </div>

        <!-- 8. Garanties -->
        <div class="form-section">
          <h2>
            <i class="fas fa-shield-alt"></i>
            Garanties
            <button class="btn btn-danger" (click)="addGarantie()">
              <i class="fas fa-plus"></i>
              Ajouter Garantie
            </button>
          </h2>
          <div class="form-grid">
            <div class="form-group" *ngFor="let garantie of pret.garanties; let i = index">
              <h3>
                Garantie {{i + 1}}
                <button class="btn btn-danger" (click)="removeGarantie(i)" *ngIf="pret.garanties.length > 1">
                  <i class="fas fa-trash"></i>
                  Supprimer
                </button>
              </h3>
              <div class="form-grid">
                <div class="form-group">
                  <label>Intervenant</label>
                  <select [(ngModel)]="garantie.intervenant">
                    <option *ngFor="let intervenant of pret.intervenants" [value]="intervenant.cli">
                      {{intervenant.cli}} - {{intervenant.niveauResponsabilite}}
                    </option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Type</label>
                  <select [(ngModel)]="garantie.type">
                    <option value="Hypothèque">Hypothèque</option>
                    <option value="Caution Personnelle">Caution Personnelle</option>
                    <option value="Caution Institutionnelle">Caution Institutionnelle</option>
                    <option value="Nantissement">Nantissement</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>Montant</label>
                  <input type="number" [(ngModel)]="garantie.montant">
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 9. Source -->
        <div class="form-section">
          <h2>
            <i class="fas fa-database"></i>
            Source
          </h2>
          <div class="form-grid">
            <div class="form-group">
              <label>Type</label>
              <select [(ngModel)]="pret.source.type">
                <option value="excel">Import Excel</option>
                <option value="manual">Saisie Manuel</option>
              </select>
            </div>
            <div class="form-group" *ngIf="pret.source.type === 'excel'">
              <label>ID Fichier</label>
              <input type="text" [(ngModel)]="pret.source.fileId">
            </div>
            <div class="form-group" *ngIf="pret.source.type === 'excel'">
              <label>Nom Fichier</label>
              <input type="text" [(ngModel)]="pret.source.fileName">
            </div>
            <div class="form-group" *ngIf="pret.source.type === 'excel'">
              <label>Date d'Import</label>
              <input type="date" [(ngModel)]="pret.source.importDate">
            </div>
            <div class="form-group">
              <label>Créé par</label>
              <input type="text" [(ngModel)]="pret.source.createdBy">
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .pret-form {
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
      font-size: 1.75rem;
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

    .form-container {
      display: grid;
      gap: 2rem;
    }

    .form-section {
      background: white;
      border-radius: 12px;
      padding: 1.75rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .form-section h2 {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin: 0 0 1.5rem 0;
      color: #e74c3c;
      font-size: 1.25rem;
    }

    .form-section h2 i {
      color: #e74c3c;
      font-size: 1.1em;
    }

    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.25rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-group label {
      color: #6c757d;
      font-weight: 500;
      font-size: 0.9rem;
    }

    .form-group input,
    .form-group select {
      padding: 0.5rem;
      border: 1px solid #dee2e6;
      border-radius: 6px;
      font-size: 0.9rem;
      transition: border-color 0.2s ease;
    }

    .form-group input:focus,
    .form-group select:focus {
      outline: none;
      border-color: #e74c3c;
    }

    .form-group input:disabled {
      background-color: #f8f9fa;
      cursor: not-allowed;
    }

    .radio-group {
      display: flex;
      gap: 1rem;
    }

    @media (max-width: 768px) {
      .pret-form {
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

      .form-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class PretFormComponent implements OnInit {
  pret: Credit = {
    numContrat: '',
    typeCredit: 1,
    libelleTypeCredit: '',
    plafondAccorde: false,
    numeroPlafond: '',
    codeActivite: 0,
    libelleActivite: '',
    situation: 1,
    libelleSituation: '',
    motif: '',
    intervenants: [],
    codeAgence: 0,
    libelleAgence: '',
    codeWilaya: 0,
    libelleWilaya: '',
    codePays: 0,
    libellePays: '',
    creditsAccorde: 0,
    dev: 1,
    libelleDev: '',
    tauxInterets: 0,
    coutCredits: 0,
    mensualite: 0,
    dureeInit: 0,
    libelleDureeInitiale: '',
    dureeRestante: 0,
    libelleDureeRestante: '',
    classeRetard: 0,
    libelleClasseRetard: '',
    nombreEcheancesImpayes: 0,
    dateConstatationEcheancesImpayes: '',
    montantCapitalRetard: 0,
    montantInteretsRetard: 0,
    montantInteretsCourus: 0,
    dateOctroi: '',
    dateExpiration: '',
    dateDeclaration: '',
    dateRejet: '',
    garanties: [],
    source: {
      type: 'manual',
      createdBy: ''
    }
  };

  isEditMode = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      // Load pret data from service
    }
  }

  onSave() {
    // Save pret data
    this.router.navigate(['/credits']);
  }

  onCancel() {
    this.router.navigate(['/credits']);
  }

  addIntervenant() {
    const newIntervenant = {
      cle: '',
      typeCle: 'i1',
      niveauResponsabilite: 1,
      libelleNiveauResponsabilite: 'Emprunteur Principal',
      nif: '',
      rib: '',
      cli: '',
      soldeRestant: 0
    };
    this.pret.intervenants.push(newIntervenant);
  }

  removeIntervenant(index: number) {
    this.pret.intervenants.splice(index, 1);
  }

  addGarantie() {
    const newGarantie = {
      intervenant: '',
      type: 1,
      libelleType: 'Hypothèque',
      montant: 0
    };
    this.pret.garanties.push(newGarantie);
  }

  removeGarantie(index: number) {
    this.pret.garanties.splice(index, 1);
  }
} 