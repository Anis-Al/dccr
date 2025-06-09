import { Directive, Input, TemplateRef, ViewContainerRef, inject } from '@angular/core';
import { AuthService } from '../services/auth&utilisateurs/auth.service';

@Directive({
  selector: '[siRole]',
  standalone: true
})
export class SiRoleDirective {
  private authService = inject(AuthService);
  private viewContainer = inject(ViewContainerRef);
  private templateRef = inject(TemplateRef<any>);
  private hasView = false;

  @Input() set siRole(roles: string | string[]) {
    // Convert single string to array for consistent handling
    const requiredRoles = Array.isArray(roles) ? roles : [roles];
    
    // Get current user info
    const userInfo = this.authService.getUserInfo();
    const userRole = userInfo?.role;
    
    // Debug logging
    console.log('User role from token:', userRole);
    console.log('Required roles:', requiredRoles);
    
    // Check if the user has any of the required roles
    const hasRequiredRole = userRole ? requiredRoles.includes(userRole) : false;
    
    console.log('Has required role?', hasRequiredRole);
    
    if (hasRequiredRole && !this.hasView) {
      console.log('Creating view for role:', userRole);
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!hasRequiredRole && this.hasView) {
      console.log('Clearing view for role:', userRole);
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
