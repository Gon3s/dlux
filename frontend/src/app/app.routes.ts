import { Routes } from '@angular/router';
import { authGuard } from '#core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/login/login.component').then((m) => m.LoginComponent),
  },
  { path: '', redirectTo: 'search', pathMatch: 'full' },
  {
    path: 'search',
    canActivate: [authGuard],
    loadChildren: () => import('./features/search/search.routes'),
  },
  {
    path: 'downloads',
    canActivate: [authGuard],
    loadChildren: () => import('./features/downloads/downloads.routes'),
  },
  {
    path: 'history',
    canActivate: [authGuard],
    loadChildren: () => import('./features/history/history.routes'),
  },
  {
    path: 'favorites',
    canActivate: [authGuard],
    loadChildren: () => import('./features/favorites/favorites.routes'),
  },
  {
    path: 'notifications',
    canActivate: [authGuard],
    loadChildren: () => import('./features/notifications/notifications.routes'),
  },
  {
    path: 'settings',
    canActivate: [authGuard],
    loadChildren: () => import('./features/settings/settings.routes'),
  },
];
