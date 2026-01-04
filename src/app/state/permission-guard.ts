// permission.guard.ts
import { Injectable } from '@angular/core';
import { Router, UrlTree, ActivatedRouteSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { StateService } from './state-service';

@Injectable({
  providedIn: 'root'
})
export class PermissionGuard {
  constructor(
    private stateService: StateService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
    const requiredPermissions = route.data['permissions'] as string[];
    
    return this.stateService.select('user').pipe(
      take(1),
      map(user => {
        if (!user) {
          return this.router.createUrlTree(['/login']);
        }
        
        if (requiredPermissions) {
          const hasPermission = requiredPermissions.every(
            permission => user.permissions.includes(permission)
          );
          
          if (!hasPermission) {
            return this.router.createUrlTree(['/unauthorized']);
          }
        }
        
        return true;
      })
    );
  }
}