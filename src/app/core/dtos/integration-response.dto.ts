export interface ErreurIntegration {
  ligne: number;
  messages: string[];
}

export interface ReponseIntegrationDto {
  contientErreurs: boolean;
  erreurs: ErreurIntegration[];
  apercuDonnees: any[];
  idExcel: number;
}
