import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ModalFacade } from '../../shared/facades/modal.facade'; // Assuming we use this for now

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const facade = inject(ModalFacade);

  if (facade.isAdmin()) {
    return true;
  }

  router.navigate(['/tasks']);
  return false;
};
