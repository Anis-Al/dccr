import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../core/services/auth&utilisateurs/auth.service';
import { InfosUtilisateur } from '../../core/models/infos-utilisateur.model';
import { ROLES, RoleValue, Utilisateur } from '../../core/dtos/Utilisateurs/utilisateur-dto';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SiRoleDirective } from '../../core/directives/si-role.directive';

interface NavItem {
  label: string;
  route?: string;
  icon: string;
  children?: NavItem[];
  expanded?: boolean;
  routerLinkActiveOptions?: { exact: boolean };
  roles?: string[]; 
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule,SiRoleDirective],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  sidebarCollapsed = false;
  userInfo: InfosUtilisateur | null = null;
  currentRoute = '';
  enCoursCollapsed = false;
  archivesCollapsed = true;
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
      },
      {
        label: 'Fichiers d\'Entrée',
        icon: 'fa-file-excel',
        expanded: false,
        children: [
          { 
            label: 'Intégration', 
            route: '/fichiers-excel/integration', 
            icon: 'fa-file-import',
          },
          { 
            label: 'Détails', 
            route: '/fichiers-excel', 
            icon: 'fa-spinner', 
            routerLinkActiveOptions: { exact: true },
          }
        ]
      },
      {
        label: 'Crédits',
        icon: 'fa-money-bill-transfer',
        route: '/credits',
        expanded: false,
      },
      {
        label: 'Déclarations BA',
        icon: 'fa-file',
        route: '/fichiers-xml',
      },
      { 
        label: 'Fichiers d\'entrée', 
        route: '/archives/fichiers-entree', 
        icon: 'fa-file-excel',
      },
      { 
        label: 'Crédits', 
        route: '/archives/credits', 
        icon: 'fa-money-bill-transfer',
      },
      { 
        label: 'Déclarations BA', 
        route: '/archives/declarations-ba', 
        icon: 'fa-file',
      },
      { 
        label: 'Journaux d\'audit', 
        route: '/journaux-audit', 
        icon: 'fa-eye',
      },
      { 
        label: 'Utilisateurs', 
        route: '/utilisateurs', 
        icon: 'fa-users',
      }
    ];

    this.navItems = allNavItems.filter(item => this.hasRequiredRole(item));
    
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