export interface Utilisateur {
  matricule: number; 
  nom_complet: string;
  email: string;
  role: RoleValue;
}

export const ROLES = [
  { key: 'Intégrateur Excel', value: 'integrateurExcel' },
  { key: 'Modificateur Crédits', value: 'modificateurCredits' },
  { key: 'Générateur Déclarations', value: 'generateurDeclarations' },
  { key: 'Administrateur', value: 'admin' }
];

export type RoleValue = 'integrateurExcel' | 'modificateurCredits' | 'generateurDeclarations' | 'admin';
