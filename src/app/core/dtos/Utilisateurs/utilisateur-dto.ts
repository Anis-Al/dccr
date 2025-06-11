export interface Utilisateur {
  matricule: number; 
  nom_complet: string;
  email: string;
  role: RoleValue;
}

export const ROLES = [
  { key: 'Intégrateur Excel', value: 'integrateurExcel' as const },
  { key: 'Modificateur Crédits', value: 'modificateurCredits' as const },
  { key: 'Générateur Déclarations', value: 'generateurDeclarations' as const },
  { key: 'Administrateur', value: 'admin' as const }
] as const;

export type RoleValue = typeof ROLES[number]['value'];
