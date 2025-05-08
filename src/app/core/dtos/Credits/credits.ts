export interface CreditDto {
  num_contrat_credit: string | null;
  date_declaration: string | null;
  type_credit: string | null;
  libelle_type_credit: string | null;
  est_plafond_accorde: boolean | null;
  id_plafond: string | null;
  code_activite: string | null;
  libelle_activite: string | null;
  situation: string | null;
  libelle_situation: string | null;
  motif: string | null;
  code_agence: string | null;
  libelle_agence: string | null;
  code_wilaya: string | null;
  libelle_wilaya: string | null;
  code_pays: string | null;
  libelle_pays: string | null;
  credit_accorde: number | null;
  monnaie: string | null;
  libelle_monnaie: string | null;
  taux_interets: number | null;
  cout_total_credit: number | null;
  solde_restant: number | null;
  mensualite: number | null;
  duree_initiale: string | null;
  libelle_duree_initiale: string | null;
  duree_restante: string | null;
  libelle_duree_restante: string | null;
  classe_retard: string | null;
  libelle_classe_retard: string | null;
  nombre_echeances_impayes: number | null;
  date_constatation_echeances_impayes: string | null;
  montant_capital_retard: number | null;
  montant_interets_retard: number | null;
  montant_interets_courus: number | null;
  date_octroi: string | null;
  date_expiration: string | null;
  date_execution: string | null;
  date_rejet: string | null;
  id_excel: number | null;
  intervenants: IntervenantDto[];
  garanties: GarantieDto[];
}

export interface IntervenantDto {
  cle: string | null;
  type_cle: string | null;
  niveau_responsabilite: string | null;
  libelle_niveau_responsabilite: string | null;
  nif: string | null;
  rib: string | null;
  cli: string | null;
}

export interface GarantieDto {
  cle_intervenant: string | null;
  type_garantie: string | null;
  libelle_type_garantie: string | null;
  montant_garantie: number | null;
}