
export interface kpi<T> {
  id_kpi: number;
  description_kpi: string;
  resultats: T[];
}

export interface kpi_nom_valeur {
  nom: string;
  valeur: number;
}

export interface kpi_time_series {
  periode: string;
  [cle: string]: any; 
}

export interface kpi_resume {
  [cle: string]: number; 
}