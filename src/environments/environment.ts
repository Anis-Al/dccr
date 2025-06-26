export const environment = {
  production: false,
  apiBaseUrl: 'https://localhost:5001/api/',
  endpoints: {
    tableauDeBord:{
      kpis:'kpis'
    },
    excel: {
      integrationPart1: 'Excel/importer',
      integrationPart2:'Excel/confirmer-integration',
      exportationErreurs: 'Excel/exporter-erreurs-excel', 
      tousLesFichiersExcelEnCours: 'Excel/get-tous-metadonnes-excel',
      telechargerModele:'',
      supprimerFichierExcel:'Excel/supprimer-fichier-excel',
    },
    credits: {
      tousLesCreditsEnCours: 'credits',
      tableDomaines: 'credits/get-tables-domaines',
      ajouterCredit: 'credits/nouveau',
      modifierCredit: 'credits/modifier',
      supprimerCredit: 'credits/supprimer',
      creditDetails: 'credits/infos',
    },
    declarationsBA :{
     tousLesDeclarations:'declarationsBA',
     genererDeclarationsParExcel :'declarationsBA/generer-declarations',
     telechargerDeclarations:'declarationsBA/telecharger-declarations',
     supprimerDeclaration:'declarationsBA/supprimer',
     archiverDeclaration: 'declarationsBA/archiver',
    },
    utilisateurs: {
      tousLesUtilisateurs: 'utilisateurs',
      ajouterUtilisateur: 'utilisateurs/ajouter',
      majUtilisateur: 'utilisateurs/modifier',
      supprimerUtilisateur: 'utilisateurs/supprimer',
      unUtilisateur: 'utilisateurs/utilisateur', 

    },
    auth: {
      login: 'auth',
      changerMotDePasse: 'auth/changer-mdp',
    },
    archives: {
      fichiersExcel: 'archives/fichiers-excel',
      fichiersXml: 'archives/fichiers-xml',
      credits: 'archives/credits'
    }  
  }
};
