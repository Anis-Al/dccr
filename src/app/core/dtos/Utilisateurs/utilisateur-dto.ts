export interface Utilisateur {
  matricule: number; 
  email: string;
  fullName: string;
  role: 'Admin'|'Consultant' | 'Importateur' | 'Validateur'; 
}
