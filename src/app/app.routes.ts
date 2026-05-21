import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'holdings',
    loadComponent: () =>
      import('./holdings/holdings.component').then((m) => m.HoldingsComponent),
  },
  {
    path: 'stocks',
    loadComponent: () =>
      import('./stocks/stocks.component').then((m) => m.StocksComponent),
  },
  { path: '', redirectTo: 'holdings', pathMatch: 'full' },
];
