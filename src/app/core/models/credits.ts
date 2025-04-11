export interface Credit {

  numContrat: string;
  typeCredit: number;
  libelleTypeCredit: string;
  plafondAccorde: boolean;
  numeroPlafond?: string;
  codeActivite: number;
  libelleActivite: string;
  situation: number;
  libelleSituation: string;
  motif?: string;

  intervenants: Intervenant[];

  codeAgence: number;
  libelleAgence: string;
  codeWilaya: number;
  libelleWilaya: string;
  codePays: number;
  libellePays: string;

  creditsAccorde: number;
  dev: number;
  libelleDev: string;
  tauxInterets: number;
  coutCredits: number;

  // 5. Remboursement
  mensualite: number;
  dureeInit: number;
  libelleDureeInitiale: string;
  dureeRestante: number;
  libelleDureeRestante: string;

  // 6. Retard
  classeRetard: number;
  libelleClasseRetard: string;
  nombreEcheancesImpayes: number;
  dateConstatationEcheancesImpayes: string;
  montantCapitalRetard: number;
  montantInteretsRetard: number;
  montantInteretsCourus: number;

  // 7. Dates
  dateOctroi: string;
  dateExpiration: string;
  dateDeclaration: string;
  dateRejet: string;

  // 8. Garanties
  garanties:Garantie[];

  // 9. Source
  source: {
    type: 'excel' | 'manual';
    fileId?: string;
    fileName?: string;
    importDate?: string;
    createdBy?: string;
  };
}
export interface Intervenant {
  cle: string;
  typeCle: string;
  niveauResponsabilite?: number;
  libelleNiveauResponsabilite: string;
  nif: string;
  rib: string;
  cli: string;
  soldeRestant: number;
}
export interface Garantie {
  intervenant: string;
  type: number;
  libelleType: string;
  montant: number;
}
