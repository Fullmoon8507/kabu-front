import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'holdings',
    loadComponent: () =>
      import('./holdings/holdings.component').then((m) => m.HoldingsComponent),
  },
  { path: '', redirectTo: 'holdings', pathMatch: 'full' },
];
