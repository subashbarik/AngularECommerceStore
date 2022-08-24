import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './core/components/not-found/not-found.component';
import { ServerErrorComponent } from './core/components/server-error/server-error.component';
import { TestErrorComponent } from './core/components/test-error/test-error.component';
import { AuthGuard } from './core/guards/auth.guard';
import { HomeComponent } from './featured/home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: 'server-error', component: ServerErrorComponent },
  { path: 'test-error', component: TestErrorComponent },
  // lazy loading shop module
  {
    path: 'shop',
    loadChildren: () =>
      import('./featured/shop/shop.module').then((mod) => mod.ShopModule),
  },
  // lazy loading basket module
  {
    path: 'basket',
    loadChildren: () =>
      import('./featured/basket/basket.module').then((mod) => mod.BasketModule),
  },
  // lazy loading checkout module
  {
    path: 'checkout',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./featured/checkout/checkout.module').then(
        (mod) => mod.CheckoutModule
      ),
  },
  // lazy loading account module
  {
    path: 'account',
    loadChildren: () =>
      import('./featured/account/account.module').then(
        (mod) => mod.AccountModule
      ),
  },
  // lazy loading order module
  {
    path: 'orders',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./featured/order/order.module').then((mod) => mod.OrderModule),
  },
  { path: '**', redirectTo: 'not-found', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
