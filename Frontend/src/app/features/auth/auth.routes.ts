import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/auth-page/auth-page.component').then(c => c.AuthPageComponent)
  }
];
