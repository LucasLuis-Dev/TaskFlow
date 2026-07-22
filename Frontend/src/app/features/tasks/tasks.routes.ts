import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { adminGuard } from '../../core/guards/admin.guard';

export const TASKS_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/dashboard-page/dashboard-page.component').then(c => c.DashboardPageComponent)
  },
  {
    path: 'my-tasks',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/my-tasks-page/my-tasks-page.component').then(c => c.MyTasksPageComponent)
  },
  {
    path: 'calendar',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/calendar-page/calendar-page.component').then(c => c.CalendarPageComponent)
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadComponent: () => import('./pages/admin-page/admin-page.component').then(c => c.AdminPageComponent)
  }
];
