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
    const requiredRoles = Array.isArray(roles) ? roles : [roles];
    
    const userInfo = this.authService.getUserInfo();
    const userRole = userInfo?.role;
    

    
    const hasRequiredRole = userRole ? requiredRoles.includes(userRole) : false;
    
    
    if (hasRequiredRole && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!hasRequiredRole && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
}
