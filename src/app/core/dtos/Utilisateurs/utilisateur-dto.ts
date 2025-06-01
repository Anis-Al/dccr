export interface Utilisateur {
  matricule: number; 
  nom_complet: string;
  email: string;
  role: 'Admin'|'Consultant' | 'Importateur' | 'Validateur'; 
}
