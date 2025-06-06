import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { JwtService } from '../../core/services/auth&utilisateurs/jwt.service';
import { AuthService } from '../../core/services/auth&utilisateurs/auth.service';


interface UserInfo {
  name: string;
  role: string;
}
interface NavItem {
  label: string;
  route?: string;
  icon: string;
  children?: NavItem[];
  expanded?: boolean;
  routerLinkActiveOptions?: { exact: boolean };
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent {
  sidebarCollapsed = false;
  userInfo: UserInfo | null = null;

  enCoursCollapsed = false;
  archivesCollapsed = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.userInfo = this.authService.getUserInfo();
  }

  navItems: NavItem[] = [
    { label: 'Tableau de Bord', route: '/tableau-de-bord', icon: 'fa-chart-line' },
    {
      label: 'Fichiers d\'Entrée',
      icon: 'fa-file-excel',
      expanded: false,
      children: [
        { label: 'Intégration', route: '/fichiers-excel/integration', icon: 'fa-file-import' },
        { label: 'Détails', route: '/fichiers-excel', icon: 'fa-spinner', routerLinkActiveOptions: { exact: true } }
      ]
    },
    {
      label: 'Crédits',
      icon: 'fa-money-bill-transfer',   
      expanded: false,
      route: '/credits'
    },
    {
      label: 'Déclarations BA',
      icon: 'fa-file',
      route: '/fichiers-xml'
    },
    { label: "Fichiers d'entrée", icon: 'fa-file-excel', route: '/archives/fichiers-entree' },
    { label: 'Crédits', icon: 'fa-money-bill-transfer', route: '/archives/credits' },
    { label: 'Déclarations BA', icon: 'fa-file', route: '/archives/declarations-ba' },
    { label: 'Journaux d\'audit', route: '/journaux-audit', icon: 'fa-eye' },
    { label: 'Utilisateurs', route: '/utilisateurs', icon: 'fa-users' }
  ];

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  toggleSubMenu(item: NavItem) {
    item.expanded = !item.expanded;
  }

  onLogout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  toggleGuide() {
  }
}