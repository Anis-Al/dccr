import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { TableauDeBordComponent } from './pages/tableau-de-bord/tableau-de-bord.component';
import { PretsComponent } from './pages/prets/prets.component';
import { PretFormComponent } from './pages/prets/pret-form/pret-form.component';
import { PretDetailsComponent } from './pages/prets/pret-details/pret-details.component';
import { FichiersExcelComponent } from './pages/fichiers-excel/fichiers-excel.component';
import { FichiersXMLComponent } from './pages/fichiers-xml/fichiers-xml.component';
import { JournauxAuditComponent } from './pages/journaux-audit/journaux-audit.component';
import { UtilisateursComponent } from './pages/utilisateurs/utilisateurs.component';
import { LoginComponent } from './pages/login/login.component';
import { ChargementComponent } from './pages/fichiers-excel/traitement/chargement/chargement.component';
import { ResultatComponent } from './pages/fichiers-excel/traitement/resultat/resultat/resultat.component';
import { UserFormComponent } from './pages/utilisateurs/user-form/user-form.component';
import { ArchivesComponent } from './pages/archives/archives.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'tableau-de-bord', pathMatch: 'full' },
      { path: 'tableau-de-bord', component: TableauDeBordComponent },
      { 
        path: 'credits',
        children: [
          { path: '', component: PretsComponent },
          { path: 'nouveau', component: PretFormComponent },
          { path: 'modifier/:id', component: PretFormComponent },
          { path: ':id', component: PretDetailsComponent }
        ]
      },
      { 
        path: 'fichiers-excel',
        children: [
          { path: '', component: FichiersExcelComponent },
          { path: 'integration', component: ChargementComponent },
          { path: 'resultat', component: ResultatComponent }
        ]
      },
      { path: 'declarations-ba', component: FichiersXMLComponent },
      { path: 'archives', component: ArchivesComponent },
      { path: 'journaux-audit', component: JournauxAuditComponent },
      { path: 'utilisateurs',
        children:[
          {path:'',component:UtilisateursComponent},
          {path: 'nouveau',component:UserFormComponent}
        ]
      }
    ]
  },
  { path: '**', redirectTo: 'tableau-de-bord' }
];
