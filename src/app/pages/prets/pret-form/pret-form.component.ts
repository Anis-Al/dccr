import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, forkJoin, of } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import { CreditDto, GarantieDto, IntervenantDto } from '../../../core/dtos/Credits/credits';
import { CreditStateService } from '../../../core/services/credits/credit-state.service';
import { CreditsService } from '../../../core/services/credits/credits.service';

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
        <span class="contract-number" *ngIf="isEditMode">{{ pret.num_contrat_credit || 'Chargement...' }}</span>
      </h1>
      <div class="actions">
        <button class="btn btn-secondary" (click)="onCancel()" [disabled]="isLoading">
          <i class="fas fa-times"></i> Annuler
        </button>
        <button class="btn btn-primary" (click)="onSave()" [disabled]="isLoading">
          <span *ngIf="!isLoading"><i class="fas fa-save"></i> Enregistrer</span>
          <span *ngIf="isLoading">Enregistrement...</span>
        </button>
      </div>
    </div>

     <div *ngIf="isLoading && isEditMode" class="loading-indicator">Chargement des détails du crédit...</div>
     <div *ngIf="errorMessage" class="alert alert-danger">Erreur: {{errorMessage}}</div>


    <div class="form-container" *ngIf="!isLoading"> 

        <div class="form-section">
          <h2><i class="fas fa-info-circle"></i> Informations Générales</h2>
          
          <div class="form-row">
            <div class="form-group">
              <label for="numContrat">N° Contrat</label>
              <input id="numContrat" type="text" [(ngModel)]="pret.num_contrat_credit" [disabled]="isEditMode" name="numContrat">
            </div>
            <div class="form-group"> 
              <label for="dateDeclaration">Date de Déclaration</label>
              <input id="dateDeclaration" type="date" [(ngModel)]="pret.date_declaration" name="dateDeclaration">
            </div>
          </div>
          
          <div class="form-grid">
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
                   <label for="situation">Situation</label>
                   <select id="situation" [(ngModel)]="pret.situation" name="situation">
                     <option [ngValue]="null" disabled>-- Sélectionner --</option>
                     <option *ngFor="let sit of lookupSituations" [value]="sit.code">
                         {{sit.libelle}}
                      </option>
                   </select>
              </div>
               <div class="form-group">
                 <label for="activite">Activité</label>
                 <select id="activite" [(ngModel)]="pret.code_activite" name="codeActivite">
                   <option [ngValue]="" >vide</option>
                   <option *ngFor="let act of lookupActivites" [value]="act.code">
                      {{act.libelle}}
                    </option>
                  </select>
                </div>
                <div class="form-group">
                   <label for="motif">Motif</label>
                   <input id="motif" type="text" [(ngModel)]="pret.motif" name="motif">
                 </div>
             <div class="form-group">
                <label>Plafond Accordé</label>
                <div class="radio-group">
                   <label><input type="radio" name="plafondAccorde" [(ngModel)]="pret.est_plafond_accorde" [value]="true"> Oui</label>
                   <label><input type="radio" name="plafondAccorde" [(ngModel)]="pret.est_plafond_accorde" [value]="false"> Non</label>
                 </div>
             </div>
             <div class="form-group" *ngIf="pret.est_plafond_accorde">
                <label for="numPlafond">N° Plafond</label>
                <input id="numPlafond" type="text" [(ngModel)]="pret.id_plafond" name="numPlafond">
              </div>
                
                 
                 
             </div>
        </div>


       <div class="form-section">
         <h2>
           <i class="fas fa-users"></i> Débiteurs
           <button type="button" class="btn btn-danger btn-add" (click)="addIntervenant()">
             <i class="fas fa-plus"></i> Ajouter Débiteur
           </button>
         </h2>
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
               <input id="intervenantCle_{{i}}" type="text" [(ngModel)]="intervenant.cle" name="intervenantCle_{{i}}">
             </div>
             <div class="form-group">
               <label for="intervenantTypeCle_{{i}}">Type de Clé</label>
               <select id="intervenantTypeCle_{{i}}" [(ngModel)]="intervenant.type_cle" name="intervenantTypeCle_{{i}}">
                  <option [ngValue]="null" disabled>-- Sélectionner --</option>
                  <option *ngFor="let type of lookupTypesCle" [value]="type.code">{{type.libelle}}</option>
                </select>
             </div>
             <div class="form-group">
               <label for="intervenantNiveau_{{i}}">Niveau de Responsabilité</label>
               <select id="intervenantNiveau_{{i}}" [(ngModel)]="intervenant.niveau_responsabilite" name="intervenantNiveau_{{i}}">
                 <option [ngValue]="null" disabled>-- Sélectionner --</option>
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
           <hr *ngIf="i < pret.intervenants.length - 1">
         </div>
         <div *ngIf="pret.intervenants.length === 0">
            Aucun débiteur ajouté.
         </div>
       </div>


        <div class="form-section">
          <h2><i class="fas fa-map-marker-alt"></i> Localisation</h2>
          <div class="form-grid">

           <div class="form-group">
              <label for="pays">Pays</label>
              <select id="pays" [(ngModel)]="pret.code_pays" name="pays" (change)="onPaysChange()">
                <option [ngValue]="null" disabled>-- Sélectionner un pays --</option>
                <option *ngFor="let pays of lookupPays" [value]="pays.code">
                  {{ pays.libelle }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label for="wilaya">Wilaya</label>
              <select id="wilaya" [(ngModel)]="pret.code_wilaya" name="wilaya" (change)="onWilayaChange()">
                <option [ngValue]="" >vide</option>
                <option *ngFor="let wilaya of lookupWilayas" [value]="wilaya.code">
                  {{ wilaya.libelle }}
                </option>
              </select>
            </div>
          <div class="form-group">
              <label for="agence">Agence</label>
              <select id="agence" [(ngModel)]="pret.code_agence" name="agence" (change)="onAgenceChange()">
                <option [ngValue]="null" disabled>-- Sélectionner une agence --</option>
                <option *ngFor="let agence of lookupAgences" [value]="agence.code">
                  {{ agence.libelle }}
                </option>
              </select>
            </div>

          </div>
        </div>


         <div class="form-section">
            <h2><i class="fas fa-euro-sign"></i> Conditions Financières</h2>
            <div class="form-grid">

              <div class="form-group">
                 <label for="creditsAccorde">Crédit Accordé</label>
                  <input id="creditsAccorde" type="number" [(ngModel)]="pret.credit_accorde" name="creditsAccorde" step="any">
              </div>

              <div class="form-group">
                 <label for="devise">Devise</label>
                 <select id="devise" [(ngModel)]="pret.monnaie" name="devise">
                   <option [ngValue]="null" disabled>-- Sélectionner --</option>
                    <option *ngFor="let dev of lookupDevises" [value]="dev.code">{{dev.libelle}}</option>
                  </select>
               </div>

               <div class="form-group">
                  <label for="tauxInterets">Taux d'Intérêts (%)</label>
                   <input id="tauxInterets" type="number" [(ngModel)]="pret.taux_interets" name="tauxInterets" step="0.01">
                </div>
                <div class="form-group">
                    <label for="coutCredits">Coût Total Crédit</label>
                    <input id="coutCredits" type="number" [(ngModel)]="pret.cout_total_credit" name="coutCredits" step="any">
                 </div>
                 <div class="form-group">
                    <label for="soldeRestant">Solde Restant Dû</label>
                    <input id="soldeRestant" type="number" [(ngModel)]="pret.solde_restant" name="soldeRestant" step="any">
                 </div>
              </div>
          </div>


       <div class="form-section">
         <h2><i class="fas fa-calendar-check"></i> Remboursement</h2>
         <div class="form-grid">
           
         <div class="form-group">
             <label for="mensualite">Mensualité</label>
              <input id="mensualite" type="number" [(ngModel)]="pret.mensualite" name="mensualite" step="any">
           </div>

           <div class="form-group">
             <label for="dureeInit">Durée Initiale</label>
             <select id="dureeInit" [(ngModel)]="pret.duree_initiale" name="dureeInit" (change)="onDureeInitialeChange()">
               <option [ngValue]="null" disabled>-- Sélectionner --</option>
               <option *ngFor="let duree of lookupDureesCredit" [value]="duree.code"> {{duree.libelle}} </option>
             </select>
           </div>

           <div class="form-group">
             <label for="dureeRestante">Durée Restante</label>
             <select id="dureeRestante" [(ngModel)]="pret.duree_restante" name="dureeRestante" (change)="onDureeRestanteChange()">
               <option [ngValue]="null" disabled>-- Sélectionner --</option>
               <option *ngFor="let duree of lookupDureesCredit" [value]="duree.code">{{duree.libelle}}</option>
             </select>
           </div>

          </div>
       </div>


        <div class="form-section">
          <h2><i class="fas fa-exclamation-triangle"></i> Retard</h2>
          <div class="form-grid">
             <div class="form-group">
                <label for="classeRetard">Classe de Retard</label>
               <select id="classeRetard" [(ngModel)]="pret.classe_retard" name="classeRetard" (change)="onClasseRetardChange()">
                  <option [ngValue]="null">-- Sélectionner --</option> 
                  <option *ngFor="let cl of lookupClassesRetard" [value]="cl.code">{{cl.libelle}}</option>
                </select>
              </div>
              <div class="form-group">
                 <label for="nbEcheances">Nombre d'Échéances Impayées</label>
                 <input id="nbEcheances" type="number" [(ngModel)]="pret.nombre_echeances_impayes" name="nbEcheances" step="1" min="0">
              </div>
              <div class="form-group">
                 <label for="dateConstat">Date de Constatation</label>
                 <input id="dateConstat" type="date" [(ngModel)]="pret.date_constatation_echeances_impayes" name="dateConstat">
              </div>
              <div class="form-group">
                  <label for="montantCapRetard">Montant Capital en Retard</label>
                  <input id="montantCapRetard" type="number" [(ngModel)]="pret.montant_capital_retard" name="montantCapRetard" step="any">
              </div>
              <div class="form-group">
                  <label for="montantIntRetard">Montant Intérêts en Retard</label>
                 <input id="montantIntRetard" type="number" [(ngModel)]="pret.montant_interets_retard" name="montantIntRetard" step="any">
              </div>
              <div class="form-group">
                  <label for="montantIntCourus">Montant Intérêts Courus</label>
                  <input id="montantIntCourus" type="number" [(ngModel)]="pret.montant_interets_courus" name="montantIntCourus" step="any">
               </div>
           </div>
        </div>


       <div class="form-section">
          <h2><i class="fas fa-calendar-alt"></i> Dates</h2>
          <div class="form-grid">
             <div class="form-group">
               <label for="dateOctroi">Date d'Octroi</label>
               <input id="dateOctroi" type="date" [(ngModel)]="pret.date_octroi" name="dateOctroi">
             </div>
             <div class="form-group">
               <label for="dateExpiration">Date d'Expiration</label>
               <input id="dateExpiration" type="date" [(ngModel)]="pret.date_expiration" name="dateExpiration">
             </div>
             <div class="form-group">
                 <label for="dateExecution">Date Exécution</label>
                 <input id="dateExecution" type="date" [(ngModel)]="pret.date_execution" name="dateExecution">
             </div>
             <div class="form-group">
                 <label for="dateRejet">Date de Rejet</label>
                 <input id="dateRejet" type="date" [(ngModel)]="pret.date_rejet" name="dateRejet">
             </div>
           </div>
       </div>


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
                  <select id="garantieIntervenant_{{i}}" [(ngModel)]="garantie.cle_intervenant" name="garantieIntervenant_{{i}}">
                    <option [ngValue]="null">-- Sélectionner Intervenant --</option>
                     <option *ngFor="let intervenant of pret.intervenants" [value]="intervenant.cle">
                        {{intervenant.cle}} - {{intervenant.libelle_niveau_responsabilite || intervenant.niveau_responsabilite}}
                      </option>
                    </select>
               </div>
               <div class="form-group">
                 <label for="garantieType_{{i}}">Type</label>
                 <select id="garantieType_{{i}}" [(ngModel)]="garantie.type_garantie" name="garantieType_{{i}}">
                   <option [ngValue]="null" disabled>-- Sélectionner --</option>
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

    .form-row {
      display: flex;
      gap: 1.5rem;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #e9ecef;
    }
    
    .form-row .form-group {
      flex: 1;
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
export class PretFormComponent implements OnInit, OnDestroy {

  pret: CreditDto = {
    intervenants: [],
    garanties: [],
    num_contrat_credit: '',
    date_declaration: new Date().toISOString().split('T')[0],
    type_credit: '',
    libelle_type_credit: '',
    est_plafond_accorde: false,
    id_plafond: '',
    code_activite: '',
    libelle_activite: '',
    situation: '',
    libelle_situation: '',
    motif: '',
    id_excel: 0,
    code_agence: '',
    libelle_agence: '',
    code_wilaya: '',
    libelle_wilaya: '',
    code_pays: '',
    libelle_pays: '',
    credit_accorde: 0,
    monnaie: '',
    libelle_monnaie: '',
    taux_interets: 0,
    cout_total_credit: 0,
    solde_restant: 0,
    mensualite: 0,
    duree_initiale: '',
    libelle_duree_initiale: '',
    duree_restante: '',
    libelle_duree_restante: '',
    classe_retard: '',
    libelle_classe_retard: '',
    nombre_echeances_impayes: 0,
    date_constatation_echeances_impayes: '',
    montant_capital_retard: 0,
    montant_interets_retard: 0,
    montant_interets_courus: 0,
    date_octroi: '',
    date_expiration: '',
    date_execution: '',
    date_rejet: ''
  };
  isLoading = false;
  errorMessage: string | null = null;
  isEditMode = false;
  private destroy$ = new Subject<void>();
  
  lookupTypesCredit: any[] = [];
  lookupActivites: any[] = [];
  lookupSituations: any[] = [];
  lookupTypesCle: any[] = [];
  lookupNiveauxResponsabilite: any[] = [];
  lookupDevises: any[] = [];
  lookupTypesGarantie: any[] = [];
  lookupClassesRetard: any[] = [];
  lookupDureesCredit: any[] = [];
  lookupAgences: any[] = [];
  lookupWilayas: any[] = [];
  lookupPays: any[] = [];
  
  selectedAgence: any;
  selectedWilaya: any;
  selectedPays: any;
  selectedTypeCredit: any;
  selectedActivite: any;
  selectedSituation: any;
  selectedDevise: any;
  selectedClasseRetard: any = null;

  constructor(private router: Router, 
    private route: ActivatedRoute,
    private creditStateService: CreditStateService,
    private creditsService: CreditsService
  ){} 

  loadLookupData() {
    forkJoin([
      this.creditsService.getDomaineByNomTable('types_credit'),
      this.creditsService.getDomaineByNomTable('activites_credit'),
      this.creditsService.getDomaineByNomTable('situations_credit'),
      this.creditsService.getDomaineByNomTable('niveaux_responsabilite'),
      this.creditsService.getDomaineByNomTable('monnaies'),
      this.creditsService.getDomaineByNomTable('types_garantie'),
      this.creditsService.getDomaineByNomTable('classes_retard'),
      this.creditsService.getDomaineByNomTable('durees_credit'),
      this.creditsService.getDomaineByNomTable('agences'),
      this.creditsService.getDomaineByNomTable('wilayas'),
      this.creditsService.getDomaineByNomTable('pays')
    ]).pipe(
      catchError(error => {
        console.error('Error loading lookup data:', error);
        return of([[], [], [], [], [], [], [], [], [], [], []]);
      })
    ).subscribe(([
      typesCredit, 
      activites, 
      situations, 
      niveauxResponsabilite, 
      devises, 
      typesGarantie, 
      classesRetard,
      dureesCredit,
      agences,
      wilayas,
      pays
    ]) => {
      this.lookupTypesCredit = typesCredit.map((item: any) => ({
        code: item.code,
        libelle: item.domaine
      }));
      this.lookupActivites = activites.map((item: any) => ({
        code: item.code,
        libelle: item.domaine
      }));
      this.lookupSituations = situations.map((item: any) => ({
        code: item.code,
        libelle: item.domaine
      }));
      this.lookupNiveauxResponsabilite = niveauxResponsabilite.map((item: any) => ({
        code: item.code,
        libelle: item.domaine
      }));
      this.lookupDevises = devises.map((item: any) => ({
        code: item.code,
        libelle: item.domaine
      }));
      this.lookupTypesGarantie = typesGarantie.map((item: any) => ({
        code: item.code,
        libelle: item.domaine
      }));
      this.lookupClassesRetard = classesRetard.map((item: any) => ({
        code: item.code,
        libelle: item.domaine
      }));
      
      this.lookupDureesCredit = dureesCredit.map((item: any) => ({
        code: item.code,
        libelle: item.domaine
      }));
      
      this.lookupAgences = agences.map((item: any) => ({
        code: item.code,
        libelle: item.domaine
      }));
      
      this.lookupWilayas = wilayas.map((item: any) => ({
        code: item.code,
        libelle: item.domaine
      }));
      
      this.lookupPays = pays.map((item: any) => ({
        code: item.code,
        libelle: item.domaine
      }));
    });
  }

  ngOnInit() {
    this.pret.intervenants = [];
    this.pret.garanties = [];
    
    this.loadLookupData();
    
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const excelId = params['id_excel'];
        if (excelId) {
          this.pret.id_excel = +excelId; 
        }
      });
    
    this.creditStateService.selectedCredit$
      .pipe(takeUntil(this.destroy$))
      .subscribe(credit => {
        if (credit) {
          this.pret = { ...credit };
          this.isEditMode = true;
          this.pret.intervenants = credit.intervenants || [];
          this.pret.garanties = credit.garanties || [];
          console.log('Loaded credit data from state:', this.pret);
          
          // Set default values after loading credit data
          this.setValeursParDefault();
        }
      });
      
    this.creditStateService.isEditMode$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isEdit => {
        this.isEditMode = isEdit;
      });
      
    this.creditStateService.isLoading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isLoading => {
        this.isLoading = isLoading;
      });
      
    this.creditStateService.error$
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        this.errorMessage = error;
      });
    
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras?.state as { pret: CreditDto };
    if (state?.pret) {
      this.creditStateService.setLoading(true);
      try {
        this.creditStateService.setSelectedCredit(state.pret);
        // Set default values after setting the credit
        this.setValeursParDefault();
      } catch (error) {
        this.creditStateService.setError('Erreur lors du chargement des données du crédit');
        console.error('Error initializing credit data:', error);
      } finally {
        this.creditStateService.setLoading(false);
      }
    }
  }

  onCancel() {
    this.creditStateService.clearSelectedCredit();
    this.router.navigate(['/credits']);
  }

  onSave() {
    this.creditStateService.setLoading(true);
    console.log('Saving credit:', this.pret);
    
    setTimeout(() => {
      this.creditStateService.setSelectedCredit(this.pret);
      this.creditStateService.setLoading(false);
      
      if (!this.isEditMode) {
        this.creditStateService.clearSelectedCredit();
        this.router.navigate(['/credits']);
      }
    }, 1000); 
    
    // Error handling would look like this:
    // this.creditStateService.setError('Erreur lors de l\'enregistrement');
    // this.creditStateService.setLoading(false);
  }

  addIntervenant() {
    this.pret.intervenants = this.pret.intervenants || [];
    this.pret.intervenants.push({} as IntervenantDto);
  }

  removeIntervenant(index: number) {
    this.pret.intervenants.splice(index, 1);
  }

  addGarantie() {
    this.pret.garanties = this.pret.garanties || [];
    this.pret.garanties.push({} as GarantieDto);
  }

  removeGarantie(index: number) {
    this.pret.garanties.splice(index, 1);
  }

  trackByIndex(index: number): number {
    return index;
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onAgenceChange() {
    if (this.pret.code_agence) {
      this.selectedAgence = this.lookupAgences.find(a => a.code === this.pret.code_agence);
    } else {
      this.selectedAgence = null;
    }
  }

  onWilayaChange() {
    if (this.pret.code_wilaya) {
      this.selectedWilaya = this.lookupWilayas.find(w => w.code === this.pret.code_wilaya);
    } else {
      this.selectedWilaya = null;
    }
  }

  onPaysChange() {
    if (this.pret.code_pays) {
      this.selectedPays = this.lookupPays.find(p => p.code === this.pret.code_pays);
    } else {
      this.selectedPays = null;
    }
  }

  onTypeCreditChange() {
    if (this.pret.type_credit) {
      this.selectedTypeCredit = this.lookupTypesCredit.find(tc => tc.code === this.pret.type_credit);
      this.pret.libelle_type_credit = this.selectedTypeCredit?.libelle || null;
    } else {
      this.selectedTypeCredit = null;
      this.pret.libelle_type_credit = null;
    }
  }

  onActiviteChange() {
    if (this.pret.code_activite) {
      this.selectedActivite = this.lookupActivites.find(a => a.code === this.pret.code_activite);
      this.pret.libelle_activite = this.selectedActivite?.libelle || null;
    } else {
      this.selectedActivite = null;
      this.pret.libelle_activite = null;
    }
  }

  onSituationChange() {
    if (this.pret.situation) {
      this.selectedSituation = this.lookupSituations.find(s => s.code === this.pret.situation);
      this.pret.libelle_situation = this.selectedSituation?.libelle || null;
    } else {
      this.selectedSituation = null;
      this.pret.libelle_situation = null;
    }
  }
  onMonnaieChange() {
    if (this.pret.monnaie) {
      this.selectedDevise = this.lookupDevises.find(d => d.code === this.pret.monnaie);
      this.pret.libelle_monnaie = this.selectedDevise?.libelle || null;
    } else {
      this.selectedDevise = null;
      this.pret.libelle_monnaie = null;
    }
  }

  onClasseRetardChange() {
    if (this.pret.classe_retard) {
      this.selectedClasseRetard = this.lookupClassesRetard.find(cr => cr.code === this.pret.classe_retard);
      this.pret.libelle_classe_retard = this.selectedClasseRetard?.libelle || null;
    } else {
      this.selectedClasseRetard = null;
      this.pret.libelle_classe_retard = null;
    }
  }

  onDureeInitialeChange() {
    if (this.pret.duree_initiale) {
      const dureeInitiale = this.lookupDureesCredit.find(d => d.code === this.pret.duree_initiale);
      this.pret.libelle_duree_initiale = dureeInitiale?.libelle || '';
    } else {
      this.pret.libelle_duree_initiale = '';
    }
  }

  onDureeRestanteChange() {
    if (this.pret.duree_restante) {
      const dureeRestante = this.lookupDureesCredit.find(d => d.code === this.pret.duree_restante);
      this.pret.libelle_duree_restante = dureeRestante?.libelle || '';
    } else {
      this.pret.libelle_duree_restante = '';
    }
  }

  private setValeursParDefault() {
    if (this.pret.type_credit) {
      this.onTypeCreditChange();
    }
    if (this.pret.code_activite) {
      this.onActiviteChange();
    }
    if (this.pret.situation) {
      this.onSituationChange();
    }
    if (this.pret.monnaie) {
      this.onMonnaieChange();
    }
    if (this.pret.classe_retard) {
      this.onClasseRetardChange();
    }
    if (this.pret.code_agence) {
      this.onAgenceChange();
    }
    if (this.pret.code_wilaya) {
      this.onWilayaChange();
    }
    if (this.pret.code_pays) {
      this.onPaysChange();
    }
  }
}