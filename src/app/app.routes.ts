import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'holdings',
    loadComponent: () =>
      import('./holdings/holdings.component').then((m) => m.HoldingsComponent),
    canActivate: [authGuard],
  },
  {
    path: 'stocks',
    loadComponent: () =>
      import('./stocks/stocks.component').then((m) => m.StocksComponent),
    canActivate: [authGuard],
  },
  { path: '', redirectTo: 'holdings', pathMatch: 'full' },
];
