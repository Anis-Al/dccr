import { RoleValue } from "../dtos/Utilisateurs/utilisateur-dto";

export interface InfosUtilisateur {
    matricule: string;
    nom_complet: string;
    role : RoleValue;
}