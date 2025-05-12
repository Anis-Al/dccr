import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CreditDto, GarantieDto, IntervenantDto } from '../../../core/dtos/Credits/credits';
import { CreditStateService } from '../../../core/services/credits/credit-state.service';

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
          <div class="form-grid">
            <div class="form-group">
              <label for="numContrat">N° Contrat</label>
              <input id="numContrat" type="text" [(ngModel)]="pret.num_contrat_credit" [disabled]="isEditMode" name="numContrat">
            </div>
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
                   <label><input type="radio" name="plafondAccorde" [(ngModel)]="pret.est_plafond_accorde" [value]="true"> Oui</label>
                   <label><input type="radio" name="plafondAccorde" [(ngModel)]="pret.est_plafond_accorde" [value]="false"> Non</label>
                 </div>
             </div>
             <div class="form-group" *ngIf="pret.est_plafond_accorde">
                <label for="numPlafond">N° Plafond</label>
                <input id="numPlafond" type="text" [(ngModel)]="pret.id_plafond" name="numPlafond">
              </div>
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

                 <div class="form-group"> 
                   <label for="dateDeclaration">Date de Déclaration</label>
                   <input id="dateDeclaration" type="date" [(ngModel)]="pret.date_declaration" name="dateDeclaration">
                 </div>
                 <div class="form-group"> 
                   <label for="idExcel">ID Import Excel</label>
                   <input id="idExcel" type="number" [(ngModel)]="pret.id_excel" name="idExcel" disabled>
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
export class PretFormComponent implements OnInit, OnDestroy {

  pret: CreditDto = {} as CreditDto;
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

  constructor(private router: Router, 
    private route: ActivatedRoute,
    private creditStateService: CreditStateService
  ){} 

  ngOnInit() {
    this.pret.intervenants = [];
    this.pret.garanties = [];
    
    this.creditStateService.selectedCredit$
      .pipe(takeUntil(this.destroy$))
      .subscribe(credit => {
        if (credit) {
          this.pret = { ...credit };
          this.isEditMode=true;
          this.pret.intervenants = credit.intervenants || [];
          this.pret.garanties = credit.garanties || [];
          console.log('Loaded credit data from state:', this.pret);
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
    // TODO: Implement save logic with API call
    console.log('Saving credit:', this.pret);
    
    // Simulate successful save for now
    setTimeout(() => {
      // Update the state with the saved credit
      this.creditStateService.setSelectedCredit(this.pret);
      this.creditStateService.setLoading(false);
      
      // Show success message or navigate away
      if (!this.isEditMode) {
        // If it was a new credit, navigate back to list
        this.creditStateService.clearSelectedCredit();
        this.router.navigate(['/credits']);
      }
    }, 1000); // Simulate API delay
    
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
    // Clean up subscriptions
    this.destroy$.next();
    this.destroy$.complete();
  }
}