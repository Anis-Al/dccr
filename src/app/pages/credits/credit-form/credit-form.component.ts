import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, forkJoin, of } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import { CreditDto, GarantieDto, IntervenantDto } from '../../../core/dtos/Credits/credits';
import { CreditStateService } from '../../../core/services/credits/credit-state.service';
import { CreditsService } from '../../../core/services/credits/credits.service';
import { PaginationComponent } from '../../../components/pagination/pagination.component';

@Component({
  selector: 'app-credit-form',
  standalone: true,
  imports: [CommonModule, FormsModule, PaginationComponent],
  templateUrl: './credit-form.component.html',
  styleUrls: ['./credit-form.component.scss']
})
export class CreditFormComponent implements OnInit, OnDestroy {

  constructor(private router: Router, 
    private route: ActivatedRoute,
    private creditStateService: CreditStateService,
    private creditsService: CreditsService
  ){} 
  
  credit: CreditDto = {
    intervenants: [{
      cle: null,
      type_cle: null,
      niveau_responsabilite: null,
      libelle_niveau_responsabilite: null,
      nif: null,
      rib: null,
      cli: null
    }],
    garanties: [{
      cle_intervenant: null,
      type_garantie: null,
      libelle_type_garantie: null,
      montant_garantie: null
    }],
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
  showModal= false;
  errors: string[] = [];
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

  pagedErrors: string[] = [];
  currentErrorPage: number = 1;
  errorsPerPage: number = 5;
  successMessage: string | null = null;

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
    if (!this.isEditMode) {
      this.credit.intervenants = [{} as IntervenantDto];
    } else {
      this.credit.intervenants = [];
    }
    this.credit.garanties = [];
    
    this.loadLookupData();
    
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        const excelId = params['id_excel'];
        if (excelId) {
          this.credit.id_excel = +excelId; 
        }
      });
    
    this.creditStateService.selectedCredit$
      .pipe(takeUntil(this.destroy$))
      .subscribe(credit => {
        if (credit) {
          this.credit = { ...credit };
          this.isEditMode = true;
          this.credit.intervenants = credit.intervenants || [];
          this.credit.garanties = credit.garanties || [];
          console.log('Loaded credit data from state:', this.credit);
          
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
    const state = navigation?.extras?.state as { credit: CreditDto };
    if (state?.credit) {
      this.creditStateService.setLoading(true);
      try {
        this.creditStateService.setSelectedCredit(state.credit);
        this.setValeursParDefault();
      } catch (error) {
        this.creditStateService.setError('Erreur lors du chargement des données du crédit');
      } finally {
        this.creditStateService.setLoading(false);
      }
    }

    this.updatePagedErrors();
  }

  onCancel() {
    this.creditStateService.clearSelectedCredit();
    this.router.navigate(['/credits']);
  }

  closeModal() {
    this.showModal = false;
    this.errors = [];
  }

  onSave() {
    console.log('Saving credit:', this.credit);
    this.isLoading = true;
    this.errorMessage = '';

    if (!this.isEditMode) {
      this.creditsService.ajouterCredit(this.credit)
        .pipe(
          takeUntil(this.destroy$)
        )
        .subscribe({
          next: (response) => {
            if (Array.isArray(response) && response.length > 0) {
              this.errors = response;
              this.showModal = true;
              this.isLoading = false;
            } else if (Array.isArray(response) && response.length === 0) {
              this.successMessage = 'Crédit créé avec succès!';
              this.showModal = true;
              this.isLoading = false;
              setTimeout(() => {
                this.showModal = false;
                this.successMessage = null;
                this.router.navigate(['/credits']);
              }, 3000);
            } 
          },
          error: (error) => {
            this.errorMessage = error.message || 'Une erreur est survenue lors de la création du crédit';
            this.isLoading = false;
          }
        });
    }
  }

  addIntervenant() {
    this.credit.intervenants = this.credit.intervenants || [];
    this.credit.intervenants.push({} as IntervenantDto);
  }

  removeIntervenant(index: number) {
    this.credit.intervenants.splice(index, 1);
  }

  addGarantie() {
    this.credit.garanties = this.credit.garanties || [];
    this.credit.garanties.push({} as GarantieDto);
  }

  removeGarantie(index: number) {
    this.credit.garanties.splice(index, 1);
  }

  trackByIndex(index: number): number {
    return index;
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onLookupChange<T>(
    code: string | null,
    lookupArray: T[],
    setSelected: (val: T | null) => void,
    setLabel?: (label: string | null) => void
  ) {
    if (code) {
      const found = lookupArray.find((item: any) => item.code === code) || null;
      setSelected(found);
      if (setLabel) {
        setLabel((found as any)?.libelle ?? null);
      }
    } else {
      setSelected(null);
      if (setLabel) {
        setLabel(null);
      }
    }
  }

  onAgenceChange() {
    this.onLookupChange(
      this.credit.code_agence,
      this.lookupAgences,
      val => this.selectedAgence = val,
      label => this.credit.libelle_agence = label
    );
  }

  onWilayaChange() {
    this.onLookupChange(
      this.credit.code_wilaya,
      this.lookupWilayas,
      val => this.selectedWilaya = val,
      label => this.credit.libelle_wilaya = label
    );
  }

  onPaysChange() {
    this.onLookupChange(
      this.credit.code_pays,
      this.lookupPays,
      val => this.selectedPays = val,
      label => this.credit.libelle_pays = label
    );
  }

  onTypeCreditChange() {
    this.onLookupChange(
      this.credit.type_credit,
      this.lookupTypesCredit,
      val => this.selectedTypeCredit = val,
      label => this.credit.libelle_type_credit = label
    );
  }

  onActiviteChange() {
    this.onLookupChange(
      this.credit.code_activite,
      this.lookupActivites,
      val => this.selectedActivite = val,
      label => this.credit.libelle_activite = label
    );
  }

  onSituationChange() {
    this.onLookupChange(
      this.credit.situation,
      this.lookupSituations,
      val => this.selectedSituation = val,
      label => this.credit.libelle_situation = label
    );
  }

  onMonnaieChange() {
    this.onLookupChange(
      this.credit.monnaie,
      this.lookupDevises,
      val => this.selectedDevise = val,
      label => this.credit.libelle_monnaie = label
    );
  }

  onClasseRetardChange() {
    this.onLookupChange(
      this.credit.classe_retard,
      this.lookupClassesRetard,
      val => this.selectedClasseRetard = val,
      label => this.credit.libelle_classe_retard = label
    );
  }

  onDureeInitialeChange() {
    if (this.credit.duree_initiale) {
      const dureeInitiale = this.lookupDureesCredit.find(d => d.code === this.credit.duree_initiale);
      this.credit.libelle_duree_initiale = dureeInitiale?.libelle || '';
    } else {
      this.credit.libelle_duree_initiale = '';
    }
  }

  onDureeRestanteChange() {
    if (this.credit.duree_restante) {
      const dureeRestante = this.lookupDureesCredit.find(d => d.code === this.credit.duree_restante);
      this.credit.libelle_duree_restante = dureeRestante?.libelle || '';
    } else {
      this.credit.libelle_duree_restante = '';
    }
  }

  private setValeursParDefault() {
    const configs = [
      { value: this.credit.type_credit, handler: () => this.onTypeCreditChange() },
      { value: this.credit.code_activite, handler: () => this.onActiviteChange() },
      { value: this.credit.situation, handler: () => this.onSituationChange() },
      { value: this.credit.monnaie, handler: () => this.onMonnaieChange() },
      { value: this.credit.classe_retard, handler: () => this.onClasseRetardChange() },
      { value: this.credit.code_agence, handler: () => this.onAgenceChange() },
      { value: this.credit.code_wilaya, handler: () => this.onWilayaChange() },
      { value: this.credit.code_pays, handler: () => this.onPaysChange() },
    ];
    configs.forEach(cfg => { if (cfg.value) cfg.handler(); });
  }

  updatePagedErrors() {
    const start = (this.currentErrorPage - 1) * this.errorsPerPage;
    this.pagedErrors = this.errors.slice(start, start + this.errorsPerPage);
  }

  onErrorPageChange(page: number) {
    this.currentErrorPage = page;
    this.updatePagedErrors();
  }
}