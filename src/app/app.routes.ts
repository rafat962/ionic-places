import { Routes } from '@angular/router';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'places',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadComponent: () => import('./auth/auth.page').then( m => m.AuthPage)
  },
  {
    path: 'places',
    loadChildren: () => import('./places/places-routing.module').then( m => m.routes),
    canActivate:[authGuard]
  },
  {
    path: 'discover',
    loadComponent: () => import('./places/discover/discover.page').then( m => m.DiscoverPage)
  },
  {
    path: 'bookings',
    loadComponent: () => import('./bookings/bookings.page').then( m => m.BookingsPage),
    canActivate:[authGuard]
  },
];
