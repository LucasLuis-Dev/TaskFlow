import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthFacade } from '../../features/auth/facades/auth.facade';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const facade = inject(AuthFacade);

  if (facade.isAdmin()) {
    return true;
  }

  router.navigate(['/tasks']);
  return false;
};
