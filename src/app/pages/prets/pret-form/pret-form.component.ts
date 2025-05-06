import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CreditDto, GarantieDto, IntervenantDto } from '../../../core/models/credits';
import { CreditsService } from '../../../core/services/credits/credits.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-pret-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <!-- src/app/components/pret-form/pret-form.component.html -->

<div class="pret-form">
    <div class="header">
      <h1>
        <i class="fas" [ngClass]="isEditMode ? 'fa-edit' : 'fa-plus'"></i>
        {{isEditMode ? 'Modifier' : 'Nouveau'}} Crédit
         <!-- Display num_contrat_credit when editing -->
        <span class="contract-number" *ngIf="isEditMode">{{ pret.num_contrat_credit || 'Chargement...' }}</span>
      </h1>
      <div class="actions">
         <!-- Cancel Button -->
        <button class="btn btn-secondary" (click)="onCancel()" [disabled]="isLoading">
          <i class="fas fa-times"></i> Annuler
        </button>
         <!-- Save Button -->
        <button class="btn btn-primary" (click)="onSave()" [disabled]="isLoading">
          <span *ngIf="!isLoading"><i class="fas fa-save"></i> Enregistrer</span>
          <span *ngIf="isLoading">Enregistrement...</span> <!-- Loading state -->
        </button>
      </div>
    </div>

    <!-- Loading Indicator -->
     <div *ngIf="isLoading && isEditMode" class="loading-indicator">Chargement des détails du crédit...</div>
     <!-- Error Display -->
     <div *ngIf="errorMessage" class="alert alert-danger">Erreur: {{errorMessage}}</div>


    <div class="form-container" *ngIf="!isLoading"> <!-- Hide form while loading details -->

        <!-- 1. Informations Générales -->
        <div class="form-section">
          <h2><i class="fas fa-info-circle"></i> Informations Générales</h2>
          <div class="form-grid">
             <!-- Bind to snake_case properties -->
            <div class="form-group">
              <label for="numContrat">N° Contrat</label>
              <input id="numContrat" type="text" [(ngModel)]="pret.num_contrat_credit" [disabled]="isEditMode" name="numContrat">
            </div>
             <!-- Use lookups for Select -->
             <div class="form-group">
                <label for="typeCredit">Type de Crédit</label>
                <select id="typeCredit" [(ngModel)]="pret.type_credit" name="typeCredit">
                   <option [ngValue]="null" disabled>-- Sélectionner --</option>
                   <option *ngFor="let type of lookupTypesCredit" [value]="type.code">
                     {{type.libelle}}
                   </option>
                 </select>
             </div>
             <div class="form-group">
                <label>Plafond Accordé</label>
                <div class="radio-group">
                  <!-- Note: Value bindings are boolean -->
                   <label><input type="radio" name="plafondAccorde" [(ngModel)]="pret.est_plafond_accorde" [value]="true"> Oui</label>
                   <label><input type="radio" name="plafondAccorde" [(ngModel)]="pret.est_plafond_accorde" [value]="false"> Non</label>
                 </div>
             </div>
             <!-- Bind id_plafond -->
             <div class="form-group" *ngIf="pret.est_plafond_accorde">
                <label for="numPlafond">N° Plafond</label>
                <input id="numPlafond" type="text" [(ngModel)]="pret.id_plafond" name="numPlafond">
              </div>
              <!-- More bindings... -->
               <div class="form-group">
                 <label for="activite">Activité</label>
                 <select id="activite" [(ngModel)]="pret.code_activite" name="codeActivite">
                   <option [ngValue]="null" disabled>-- Sélectionner --</option>
                   <option *ngFor="let act of lookupActivites" [value]="act.code">
                      {{act.libelle}}
                    </option>
                  </select>
                </div>
                <div class="form-group">
                   <label for="situation">Situation</label>
                   <select id="situation" [(ngModel)]="pret.situation" name="situation">
                     <option [ngValue]="null" disabled>-- Sélectionner --</option>
                     <option *ngFor="let sit of lookupSituations" [value]="sit.code">
                         {{sit.libelle}}
                      </option>
                   </select>
                 </div>
                 <div class="form-group">
                   <label for="motif">Motif</label>
                   <input id="motif" type="text" [(ngModel)]="pret.motif" name="motif">
                 </div>

                 <div class="form-group"> <!-- Date Declaration -->
                   <label for="dateDeclaration">Date de Déclaration</label>
                   <input id="dateDeclaration" type="date" [(ngModel)]="pret.date_declaration" name="dateDeclaration">
                 </div>
                 <div class="form-group"> <!-- ID Excel -->
                   <label for="idExcel">ID Import Excel</label>
                   <!-- Might be display-only or set by system, often disabled -->
                   <input id="idExcel" type="number" [(ngModel)]="pret.id_excel" name="idExcel" disabled>
                 </div>
             </div>
        </div>


       <!-- 2. Débiteurs (Intervenants) -->
       <div class="form-section">
         <h2>
           <i class="fas fa-users"></i> Débiteurs
            <!-- Use button type="button" to prevent accidental form submission -->
           <button type="button" class="btn btn-danger btn-add" (click)="addIntervenant()">
             <i class="fas fa-plus"></i> Ajouter Débiteur
           </button>
         </h2>
          <!-- Removed extra div around loop -->
         <div class="intervenant-item" *ngFor="let intervenant of pret.intervenants; let i = index; trackBy: trackByIndex"> <!-- Added trackBy -->
           <h3>
             Débiteur {{i + 1}}
             <button type="button" class="btn btn-danger btn-delete" (click)="removeIntervenant(i)" *ngIf="pret.intervenants.length > 0"> <!-- Allow removing the last one -->
               <i class="fas fa-trash"></i> Supprimer
             </button>
           </h3>
           <div class="form-grid">
             <div class="form-group">
               <label for="intervenantCle_{{i}}">Clé</label>
                <!-- Unique names using index -->
               <input id="intervenantCle_{{i}}" type="text" [(ngModel)]="intervenant.cle" name="intervenantCle_{{i}}">
             </div>
             <div class="form-group">
               <label for="intervenantTypeCle_{{i}}">Type de Clé</label>
               <select id="intervenantTypeCle_{{i}}" [(ngModel)]="intervenant.type_cle" name="intervenantTypeCle_{{i}}">
                  <option [ngValue]="null" disabled>-- Sélectionner --</option>
                   <!-- Use lookupTypesCle -->
                  <option *ngFor="let type of lookupTypesCle" [value]="type.code">{{type.libelle}}</option>
                </select>
             </div>
             <div class="form-group">
               <label for="intervenantNiveau_{{i}}">Niveau de Responsabilité</label>
               <select id="intervenantNiveau_{{i}}" [(ngModel)]="intervenant.niveau_responsabilite" name="intervenantNiveau_{{i}}">
                 <option [ngValue]="null" disabled>-- Sélectionner --</option>
                  <!-- Use lookupNiveauxResponsabilite -->
                  <option *ngFor="let niv of lookupNiveauxResponsabilite" [value]="niv.code">{{niv.libelle}}</option>
                </select>
             </div>
             <div class="form-group">
               <label for="intervenantNif_{{i}}">NIF</label>
               <input id="intervenantNif_{{i}}" type="text" [(ngModel)]="intervenant.nif" name="intervenantNif_{{i}}">
             </div>
             <div class="form-group">
               <label for="intervenantRib_{{i}}">RIB</label>
               <input id="intervenantRib_{{i}}" type="text" [(ngModel)]="intervenant.rib" name="intervenantRib_{{i}}">
             </div>
             <div class="form-group">
               <label for="intervenantCli_{{i}}">CLI</label>
               <input id="intervenantCli_{{i}}" type="text" [(ngModel)]="intervenant.cli" name="intervenantCli_{{i}}">
             </div>
           </div>
           <!-- Add separator for clarity -->
           <hr *ngIf="i < pret.intervenants.length - 1">
         </div>
         <!-- Message if no intervenants -->
         <div *ngIf="pret.intervenants.length === 0">
            Aucun débiteur ajouté.
         </div>
       </div>


        <!-- 3. Localisation -->
        <div class="form-section">
          <h2><i class="fas fa-map-marker-alt"></i> Localisation</h2>
          <div class="form-grid">
            <div class="form-group">
              <label for="codeAgence">Code Agence</label>
              <!-- Bind code_agence -->
              <input id="codeAgence" type="text" [(ngModel)]="pret.code_agence" name="codeAgence">
            </div>
             <!-- Add readonly display for Libelle (assuming fetched elsewhere or based on code) -->
             <div class="form-group readonly-display" *ngIf="pret.libelle_agence">
                <label>Agence</label>
                <span>{{pret.libelle_agence}}</span>
              </div>

             <!-- Repeat for Wilaya -->
            <div class="form-group">
              <label for="codeWilaya">Code Wilaya</label>
              <input id="codeWilaya" type="text" [(ngModel)]="pret.code_wilaya" name="codeWilaya">
            </div>
             <div class="form-group readonly-display" *ngIf="pret.libelle_wilaya">
                <label>Wilaya</label>
                <span>{{pret.libelle_wilaya}}</span>
              </div>

             <!-- Repeat for Pays -->
            <div class="form-group">
              <label for="codePays">Code Pays</label>
              <input id="codePays" type="text" [(ngModel)]="pret.code_pays" name="codePays">
            </div>
             <div class="form-group readonly-display" *ngIf="pret.libelle_pays">
                <label>Pays</label>
                <span>{{pret.libelle_pays}}</span>
              </div>
          </div>
        </div>


         <!-- 4. Conditions Financières -->
         <div class="form-section">
            <h2><i class="fas fa-euro-sign"></i> Conditions Financières</h2>
            <div class="form-grid">
              <div class="form-group">
                 <label for="creditsAccorde">Crédit Accordé</label>
                  <!-- Bind credit_accorde -->
                  <input id="creditsAccorde" type="number" [(ngModel)]="pret.credit_accorde" name="creditsAccorde" step="any">
              </div>
              <div class="form-group">
                 <label for="devise">Devise</label>
                  <!-- Bind monnaie -->
                 <select id="devise" [(ngModel)]="pret.monnaie" name="devise">
                   <option [ngValue]="null" disabled>-- Sélectionner --</option>
                    <!-- Use lookupDevises -->
                    <option *ngFor="let dev of lookupDevises" [value]="dev.code">{{dev.libelle}}</option>
                  </select>
               </div>
               <div class="form-group">
                  <label for="tauxInterets">Taux d'Intérêts (%)</label>
                   <!-- Bind taux_interets -->
                   <input id="tauxInterets" type="number" [(ngModel)]="pret.taux_interets" name="tauxInterets" step="0.01">
                </div>
                <div class="form-group">
                    <label for="coutCredits">Coût Total Crédit</label>
                    <!-- Bind cout_total_credit -->
                    <input id="coutCredits" type="number" [(ngModel)]="pret.cout_total_credit" name="coutCredits" step="any">
                 </div>
                 <div class="form-group">
                    <label for="soldeRestant">Solde Restant Dû</label>
                    <!-- Bind solde_restant -->
                    <input id="soldeRestant" type="number" [(ngModel)]="pret.solde_restant" name="soldeRestant" step="any">
                 </div>
              </div>
          </div>


       <!-- 5. Remboursement -->
       <div class="form-section">
         <h2><i class="fas fa-calendar-check"></i> Remboursement</h2>
         <div class="form-grid">
           <div class="form-group">
             <label for="mensualite">Mensualité</label>
              <!-- Bind mensualite -->
              <input id="mensualite" type="number" [(ngModel)]="pret.mensualite" name="mensualite" step="any">
           </div>
           <div class="form-group">
             <label for="dureeInit">Durée Initiale</label>
             <!-- Bind duree_initiale (assuming code input) -->
             <input id="dureeInit" type="text" [(ngModel)]="pret.duree_initiale" name="dureeInit">
           </div>
            <div class="form-group readonly-display" *ngIf="pret.libelle_duree_initiale">
                <label>Format Durée Initiale</label>
                <span>{{pret.libelle_duree_initiale}}</span>
             </div>

           <div class="form-group">
             <label for="dureeRestante">Durée Restante</label>
              <!-- Bind duree_restante (assuming code input) -->
              <input id="dureeRestante" type="text" [(ngModel)]="pret.duree_restante" name="dureeRestante">
           </div>
            <div class="form-group readonly-display" *ngIf="pret.libelle_duree_restante">
               <label>Format Durée Restante</label>
               <span>{{pret.libelle_duree_restante}}</span>
            </div>
          </div>
       </div>


        <!-- 6. Retard -->
        <div class="form-section">
          <h2><i class="fas fa-exclamation-triangle"></i> Retard</h2>
          <div class="form-grid">
             <div class="form-group">
                <label for="classeRetard">Classe de Retard</label>
                <!-- Bind classe_retard -->
               <select id="classeRetard" [(ngModel)]="pret.classe_retard" name="classeRetard">
                  <option [ngValue]="null">-- Sélectionner --</option> <!-- Allow empty/null -->
                  <!-- Use lookupClassesRetard -->
                  <option *ngFor="let cl of lookupClassesRetard" [value]="cl.code">{{cl.libelle}}</option>
                </select>
              </div>
              <div class="form-group">
                 <label for="nbEcheances">Nombre d'Échéances Impayées</label>
                  <!-- Bind nombre_echeances_impayes -->
                 <input id="nbEcheances" type="number" [(ngModel)]="pret.nombre_echeances_impayes" name="nbEcheances" step="1" min="0">
              </div>
              <div class="form-group">
                 <label for="dateConstat">Date de Constatation</label>
                  <!-- Bind date_constatation_echeances_impayes -->
                 <input id="dateConstat" type="date" [(ngModel)]="pret.date_constatation_echeances_impayes" name="dateConstat">
              </div>
              <div class="form-group">
                  <label for="montantCapRetard">Montant Capital en Retard</label>
                  <!-- Bind montant_capital_retard -->
                  <input id="montantCapRetard" type="number" [(ngModel)]="pret.montant_capital_retard" name="montantCapRetard" step="any">
              </div>
              <div class="form-group">
                  <label for="montantIntRetard">Montant Intérêts en Retard</label>
                  <!-- Bind montant_interets_retard -->
                 <input id="montantIntRetard" type="number" [(ngModel)]="pret.montant_interets_retard" name="montantIntRetard" step="any">
              </div>
              <div class="form-group">
                  <label for="montantIntCourus">Montant Intérêts Courus</label>
                  <!-- Bind montant_interets_courus -->
                  <input id="montantIntCourus" type="number" [(ngModel)]="pret.montant_interets_courus" name="montantIntCourus" step="any">
               </div>
           </div>
        </div>


       <!-- 7. Dates -->
       <div class="form-section">
          <h2><i class="fas fa-calendar-alt"></i> Dates</h2>
          <div class="form-grid">
             <div class="form-group">
               <label for="dateOctroi">Date d'Octroi</label>
               <!-- Bind date_octroi -->
               <input id="dateOctroi" type="date" [(ngModel)]="pret.date_octroi" name="dateOctroi">
             </div>
             <div class="form-group">
               <label for="dateExpiration">Date d'Expiration</label>
                <!-- Bind date_expiration -->
               <input id="dateExpiration" type="date" [(ngModel)]="pret.date_expiration" name="dateExpiration">
             </div>
             <div class="form-group">
                 <label for="dateExecution">Date Exécution</label>
                 <!-- Bind date_execution -->
                 <input id="dateExecution" type="date" [(ngModel)]="pret.date_execution" name="dateExecution">
             </div>
             <div class="form-group">
                 <label for="dateRejet">Date de Rejet</label>
                 <!-- Bind date_rejet -->
                 <input id="dateRejet" type="date" [(ngModel)]="pret.date_rejet" name="dateRejet">
             </div>
           </div>
       </div>


       <!-- 8. Garanties -->
        <div class="form-section">
          <h2>
            <i class="fas fa-shield-alt"></i> Garanties
             <button type="button" class="btn btn-danger btn-add" (click)="addGarantie()">
               <i class="fas fa-plus"></i> Ajouter Garantie
             </button>
          </h2>
          <div class="intervenant-item" *ngFor="let garantie of pret.garanties; let i = index; trackBy: trackByIndex">
             <h3>
               Garantie {{i + 1}}
               <button type="button" class="btn btn-danger btn-delete" (click)="removeGarantie(i)" *ngIf="pret.garanties.length > 0">
                  <i class="fas fa-trash"></i> Supprimer
                </button>
             </h3>
             <div class="form-grid">
               <div class="form-group">
                 <label for="garantieIntervenant_{{i}}">Clé Intervenant (Garant)</label>
                  <!-- Select from available intervenants -->
                  <select id="garantieIntervenant_{{i}}" [(ngModel)]="garantie.cle_intervenant" name="garantieIntervenant_{{i}}">
                    <option [ngValue]="null">-- Sélectionner Intervenant --</option>
                     <option *ngFor="let intervenant of pret.intervenants" [value]="intervenant.cle">
                        {{intervenant.cle}} - {{intervenant.libelle_niveau_responsabilite || intervenant.niveau_responsabilite}}
                      </option>
                    </select>
               </div>
               <div class="form-group">
                 <label for="garantieType_{{i}}">Type</label>
                  <!-- Bind type_garantie -->
                 <select id="garantieType_{{i}}" [(ngModel)]="garantie.type_garantie" name="garantieType_{{i}}">
                   <option [ngValue]="null" disabled>-- Sélectionner --</option>
                    <!-- Use lookupTypesGarantie -->
                   <option *ngFor="let type of lookupTypesGarantie" [value]="type.code">{{type.libelle}}</option>
                 </select>
               </div>
               <div class="form-group">
                 <label for="garantieMontant_{{i}}">Montant</label>
                 <input id="garantieMontant_{{i}}" type="number" [(ngModel)]="garantie.montant_garantie" name="garantieMontant_{{i}}" step="any">
               </div>
             </div>
              <hr *ngIf="i < pret.garanties.length - 1">
          </div>
            <div *ngIf="pret.garanties.length === 0">
              Aucune garantie ajoutée.
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

  pret: CreditDto = this.createEmptyCredit();
  isEditMode = false;
  isLoading = false;
  errorMessage = '';

  lookupTypesCredit = [ { code: 'AUT', libelle: 'Credit automobile' }, { code: 'IMM', libelle: 'Credit Immobilier' } ];
  lookupActivites = [ { code: 'AGR', libelle: 'Agriculture' }, { code: 'PCH', libelle: 'Pêche' } ];
  lookupSituations = [ { code: '1', libelle: 'Régulier' }, { code: '2', libelle: 'Rejeté' }, { code: '3', libelle: 'Impayé' } ];
  lookupTypesCle = [ { code:'NIF', libelle: 'NIF' }, { code:'RC', libelle: 'RC' }, { code: 'CLI', libelle:'N° Client'} ];
  lookupNiveauxResponsabilite = [ { code:'PPAL', libelle: 'Principal'}, { code:'COEM', libelle: 'Co-emprunteur'}, { code:'GARA', libelle: 'Garant'} ];
  lookupDevises = [ {code:'DZD', libelle:'DZD'}, {code:'EUR', libelle:'EUR'}, {code:'USD', libelle:'USD'} ];
  lookupClassesRetard = [ { code: '0', libelle: 'Aucun' }, { code: '1', libelle: '< 30j' } ];
  lookupTypesGarantie = [ {code:'HYPO', libelle: 'Hypothèque'}, {code:'CAUTP', libelle: 'Caution Personnelle'} ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private creditService: CreditsService
  ) {}

  ngOnInit(): void {
    const numContrat = this.route.snapshot.paramMap.get('numContrat');
    const dateDeclStr = this.route.snapshot.paramMap.get('dateDecl');

    if (numContrat && dateDeclStr) {
      this.isEditMode = true;
      this.loadCreditData(numContrat, dateDeclStr);
    } else {
      this.isEditMode = false;
    }
  }

  createEmptyCredit(): CreditDto {
    return {
        num_contrat_credit: null,
        date_declaration: this.getTodayDateString(),
        type_credit: null,
        libelle_type_credit: null,
        est_plafond_accorde: false,
        id_plafond: null,
        code_activite: null,
        libelle_activite: null,
        situation: null,
        libelle_situation: null,
        motif: null,
        code_agence: null,
        libelle_agence: null,
        code_wilaya: null,
        libelle_wilaya: null,
        code_pays: null,
        libelle_pays: null,
        credit_accorde: null,
        monnaie: null,
        libelle_monnaie: null,
        taux_interets: null,
        cout_total_credit: null,
        solde_restant: null,
        mensualite: null,
        duree_initiale: null,
        libelle_duree_initiale: null,
        duree_restante: null,
        libelle_duree_restante: null,
        classe_retard: null,
        libelle_classe_retard: null,
        nombre_echeances_impayes: null,
        date_constatation_echeances_impayes: null,
        montant_capital_retard: null,
        montant_interets_retard: null,
        montant_interets_courus: null,
        date_octroi: this.getTodayDateString(),
        date_expiration: null,
        date_execution: '',
        date_rejet: null,
        id_excel: null,
        intervenants: [],
        garanties: []
    };
  }

  loadCreditData(numContrat: string, dateDecl: string): void {
    this.isLoading = true;
    this.errorMessage = '';
    console.warn('Placeholder: Implement loadCreditData in service.');
    // Simulate loading existing data
    this.pret = this.createEmptyCredit();
    this.pret.num_contrat_credit = numContrat;
    this.pret.date_declaration = dateDecl;
    this.pret.type_credit = 'AUT';
    this.pret.libelle_type_credit = 'Credit automobile';
    this.pret.motif = 'Données de test chargées';
    this.pret.est_plafond_accorde = true;
    this.pret.id_plafond = 'PLAF123';
    this.pret.intervenants.push({
        cle: 'CLI-001', type_cle: 'CLI', niveau_responsabilite: 'PPAL',
        libelle_niveau_responsabilite: 'Principal', nif:'1234', rib:'5678', cli:'001'
       });
    this.isLoading = false;
    // Replace with actual service call:
    // this.creditService.getCreditByKeys(numContrat, dateDecl).subscribe({ ... });
  }


  onSave(): void {
    this.isLoading = true;
    this.errorMessage = '';
    const dataToSave: CreditDto = { ...this.pret };
    let saveObservable: Observable<any>;

    if (this.isEditMode) {
      console.warn('Placeholder: Implement updateCredit in service.');
      saveObservable = new Observable(subscriber => {
        const timeoutId = setTimeout(() => {
          subscriber.next({ success: true });
          subscriber.complete();
        }, 500);

        return () => clearTimeout(timeoutId);
      });
      // saveObservable = this.creditService.updateCredit(dataToSave);
    } else {
      console.warn('Placeholder: Implement createCredit in service.');
      saveObservable = new Observable(observer => {
        const timeoutId = setTimeout(() => {
          observer.next({ id: 'NEW_CONTRAT_123' });
          observer.complete();
        }, 500);

        return () => clearTimeout(timeoutId);
      });
      // saveObservable = this.creditService.createCredit(dataToSave);
    }

    saveObservable.subscribe({
        next: (response) => {
            console.log('Save successful:', response);
            this.isLoading = false;
            this.router.navigate(['/prets']);
        },
        error: (err) => {
            console.error('Error saving credit:', err);
            this.errorMessage = `Échec de l'enregistrement: ${err?.error?.message || err?.message || 'Erreur inconnue'}`;
            this.isLoading = false;
        }
    });
  }

  onCancel(): void {
    this.router.navigate(['/prets']);
  }

  addIntervenant(): void {
    const newIntervenant: IntervenantDto = {
      cle: null, type_cle: null, niveau_responsabilite: null,
      libelle_niveau_responsabilite: null, nif: null, rib: null, cli: null
    };
    this.pret.intervenants = this.pret.intervenants || [];
    this.pret.intervenants.push(newIntervenant);
  }

  removeIntervenant(index: number): void {
    if (index >= 0 && index < this.pret.intervenants?.length) {
      this.pret.intervenants.splice(index, 1);
    }
  }

  addGarantie(): void {
    const newGarantie: GarantieDto = {
      cle_intervenant: null, type_garantie: null,
      libelle_type_garantie: null, montant_garantie: null
    };
    this.pret.garanties = this.pret.garanties || [];
    this.pret.garanties.push(newGarantie);
  }

  removeGarantie(index: number): void {
    if (index >= 0 && index < this.pret.garanties?.length) {
      this.pret.garanties.splice(index, 1);
    }
  }

  getTodayDateString(): string {
      const today = new Date();
      const year = today.getFullYear();
      const month = (today.getMonth() + 1).toString().padStart(2, '0');
      const day = today.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
  }

  trackByIndex(index: number, item: any): number {
      return index;
  }
}