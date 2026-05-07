import { Injectable } from '@angular/core';
import { Permission } from '../classes/other/permissions';
import { StateService } from '@/state/state-service';
import { initObjectPersonnel, Personnel } from '@/models/personnel';
import { TypePersonnel } from '../enums/type-personnel';
import { Role } from '../classes/role';

@Injectable({ providedIn: 'root' })
export class PermissionService {
    constructor(private stateService: StateService) {}
    /** Build the role information for the currently‑logged‑in user. */
    getCurrentUserRole(permissionAjouter?: Permission, permissionModifier?: Permission, permissionSupprimer?: Permission): { personnel: Personnel; role: Role } {
        const user = this.stateService.getState().user;
        const permissions = user?.permissions || [];
        const personnel = user?.personnel ?? initObjectPersonnel();

        const role: Role = {
            // ---- personnel type ----
            isAdmin: personnel.typePersonnel === TypePersonnel.ADMINISTRATEUR,
            isGerant: personnel.typePersonnel === TypePersonnel.GERANT,
            isComptable: personnel.typePersonnel === TypePersonnel.COMPATBLE,
            isMagasinier: personnel.typePersonnel === TypePersonnel.MAGASINIER,
            isCommercialInterne: personnel.typePersonnel === TypePersonnel.COMMERCIAL_INTERNE,
            isCommercialExterne: personnel.typePersonnel === TypePersonnel.COMMERCIAL_EXTERNE,
            // ---- permission flags ----
            canAdd: (permissionAjouter ? permissions.includes(permissionAjouter) : false) || permissions.includes(Permission.ALL),
            canModify: (permissionModifier ? permissions.includes(permissionModifier) : false) || permissions.includes(Permission.ALL),
            canDelete: (permissionSupprimer ? permissions.includes(permissionSupprimer) : false) || permissions.includes(Permission.ALL)
        };

        return { personnel, role };
    }
}
