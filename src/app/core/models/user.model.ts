export interface User {
  matricule: number; 
  email: string;
  fullName: string;
  role: 'Admin'|'Consultant' | 'Importateur' | 'Validateur'; 
}
