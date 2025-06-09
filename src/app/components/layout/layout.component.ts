import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../core/services/auth&utilisateurs/auth.service';
import { InfosUtilisateur } from '../../core/models/infos-utilisateur.model';
import { ROLES, RoleValue, Utilisateur } from '../../core/dtos/Utilisateurs/utilisateur-dto';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

interface NavItem {
  label: string;
  route?: string;
  icon: string;
  children?: NavItem[];
  expanded?: boolean;
  routerLinkActiveOptions?: { exact: boolean };
  roles?: string[]; // Roles that can see this menu item
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  sidebarCollapsed = false;
  userInfo: InfosUtilisateur | null = null;
  currentRoute = '';
  enCoursCollapsed = false;
  archivesCollapsed = false;
  navItems: NavItem[] = [];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadUserInfo();
    this.initializeNavItems();
    this.setupRouteTracking();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadUserInfo() {
    this.userInfo = this.authService.getUserInfo();
    if (!this.userInfo) {
      this.router.navigate(['/login']);
    }
  }

  private initializeNavItems() {
    const allNavItems = [
      { 
        label: 'Tableau de Bord', 
        route: '/tableau-de-bord', 
        icon: 'fa-chart-line',
        roles: ['admin', 'integrateurExcel', 'modificateurCredits', 'generateurDeclarations']
      },
      {
        label: 'Fichiers d\'Entrée',
        icon: 'fa-file-excel',
        expanded: false,
        roles: ['admin', 'integrateurExcel'],
        children: [
          { 
            label: 'Intégration', 
            route: '/fichiers-excel/integration', 
            icon: 'fa-file-import',
            roles: ['admin', 'integrateurExcel']
          },
          { 
            label: 'Détails', 
            route: '/fichiers-excel', 
            icon: 'fa-spinner', 
            routerLinkActiveOptions: { exact: true },
            roles: ['admin', 'integrateurExcel']
          }
        ]
      },
      {
        label: 'Crédits',
        icon: 'fa-money-bill-transfer',
        route: '/credits',
        expanded: false,
        roles: ['admin', 'modificateurCredits']
      },
      {
        label: 'Déclarations BA',
        icon: 'fa-file',
        route: '/fichiers-xml',
        roles: ['admin', 'generateurDeclarations']
      },
      { 
        label: 'Fichiers d\'entrée', 
        route: '/archives/fichiers-entree', 
        icon: 'fa-file-excel',
        roles: ['admin']
      },
      { 
        label: 'Crédits', 
        route: '/archives/credits', 
        icon: 'fa-money-bill-transfer',
        roles: ['admin']
      },
      { 
        label: 'Déclarations BA', 
        route: '/archives/declarations-ba', 
        icon: 'fa-file',
        roles: ['admin']
      },
      { 
        label: 'Journaux d\'audit', 
        route: '/journaux-audit', 
        icon: 'fa-eye',
        roles: ['admin']
      },
      { 
        label: 'Utilisateurs', 
        route: '/utilisateurs', 
        icon: 'fa-users',
        roles: ['admin']
      }
    ];

    // Filter navigation items based on user role
    this.navItems = allNavItems.filter(item => this.hasRequiredRole(item));
    
    // Filter children for items that have them
    this.navItems = this.navItems.map(item => {
      if (item.children) {
        return {
          ...item,
          children: item.children.filter(child => this.hasRequiredRole(child))
        };
      }
      return item;
    }).filter(item => !item.children || item.children.length > 0); // Remove parent items with no visible children
  }

  private setupRouteTracking() {
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe((event: NavigationEnd) => {
      this.currentRoute = event.url;
      this.updateNavItemsExpansion();
    });
  }

  private updateNavItemsExpansion() {
    this.navItems.forEach(item => {
      if (item.children) {
        item.expanded = this.currentRoute.startsWith(item.route || '');
      }
    });
  }

  hasRequiredRole(item: NavItem): boolean {
    if (!this.userInfo) return false;
    if (!item.roles || item.roles.length === 0) return true;
    return item.roles.includes(this.userInfo.role as RoleValue);
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  toggleSubMenu(item: NavItem) {
    item.expanded = !item.expanded;
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  roleClaire(roleValue: string | null | undefined): string {
    if (!roleValue) return 'Aucun rôle';
    const role = ROLES.find(r => r.value === roleValue);
    return role?.key || roleValue;
  }

  

  
}