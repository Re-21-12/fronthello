import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./core/pages/purchase-page/purchase-page').then(m => m.PurchasePage) }
];
