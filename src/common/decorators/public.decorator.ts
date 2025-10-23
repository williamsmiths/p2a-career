import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Decorator để đánh dấu route là public (không cần auth)
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

