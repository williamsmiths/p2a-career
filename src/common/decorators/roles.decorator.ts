import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../enums';

export const ROLES_KEY = 'roles';

/**
 * Decorator để phân quyền theo role
 */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

