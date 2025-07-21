import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserType } from '@/common/enums';

@Injectable()
export class CompanyContextGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
            throw new ForbiddenException('User not authenticated');
        }

        // Admin users can access all data
        if (user.user_type === UserType.ADMIN) {
            return true;
        }

        // For B2B and Affiliate users, ensure they have a company_id
        if ((user.user_type === UserType.B2B || user.user_type === UserType.AFFILIATE)) {
            if (!user.company_id) {
                throw new ForbiddenException('Company context required but not found');
            }
            
            // Add company_id to request for controllers to use
            request.company_id = user.company_id;
            return true;
        }

        // Customer users don't need company context
        if (user.user_type === UserType.CUSTOMER) {
            return true;
        }

        throw new ForbiddenException('Invalid user type');
    }
}