import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { StateService } from '@/state/state-service';

export const permissionGuard: CanActivateFn = (route, state) => {
    const stateService = inject(StateService);
    const router = inject(Router);

    // Get required permission from route data
    const requiredPermission = route.data['permission'] as string;

    // Get user from state
    const user = stateService.getState().user;

    // Check if user exists and has permissions
    if (!user || !user.permissions) {
        router.navigate(['/unauthorized']); // or '/login'
        return false;
    }

    // Check if user has the required permission
    const hasPermission = user.permissions.includes(requiredPermission);

    if (!hasPermission) {
        router.navigate(['/unauthorized']);
        return false;
    }

    return true;
};
