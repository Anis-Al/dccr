export interface loginDto {
    matricule: string;
    mot_de_passe: string;
}
export interface LoginReponseDto {
    token: string;
    message:string;
  }
export interface changerMotDePasseDto {
  matricule: string;
  ancienMotDePasse: string;
  nouveauMotDePasse: string;
}