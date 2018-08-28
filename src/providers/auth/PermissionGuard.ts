import * as nest from "@nestjs/common";
import * as db from "models";

class PermissionActivator implements nest.CanActivate {
    constructor(
        private readonly role: db.UserRole
    ) { }

    async canActivate(context: nest.ExecutionContext) {
        const user: db.User = context.switchToHttp().getRequest().user;
        return user && user.role >= this.role;
    }
}

export function PermissionGuard(role: db.UserRole): nest.Type<nest.CanActivate> {
    return class extends PermissionActivator {
        constructor() {
            super(role);
        }
    };
}
