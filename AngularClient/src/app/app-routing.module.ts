import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './core/components/not-found/not-found.component';
import { ServerErrorComponent } from './core/components/server-error/server-error.component';
import { TestErrorComponent } from './core/components/test-error/test-error.component';
import { AuthGuard } from './core/guards/auth.guard';
import { HomeComponent } from './featured/home/home.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: { breadcrumb: 'Home' },
  },
  {
    path: 'not-found',
    component: NotFoundComponent,
    data: { breadcrumb: 'Not Found' },
  },
  {
    path: 'server-error',
    component: ServerErrorComponent,
    data: { breadcrumb: 'Server Error' },
  },
  {
    path: 'test-error',
    component: TestErrorComponent,
    data: { breadcrumb: 'Test Error' },
  },
  // lazy loading shop module
  {
    path: 'shop',
    loadChildren: () =>
      import('./featured/shop/shop.module').then((mod) => mod.ShopModule),
    data: { breadcrumb: 'Shop' },
  },
  // lazy loading basket module
  {
    path: 'basket',
    loadChildren: () =>
      import('./featured/basket/basket.module').then((mod) => mod.BasketModule),
    data: { breadcrumb: 'Basket' },
  },
  // lazy loading checkout module
  // {
  //   path: 'checkout',
  //   canActivate: [AuthGuard],
  //   loadChildren: () =>
  //     import('./featured/checkout/checkout.module').then(
  //       (mod) => mod.CheckoutModule
  //     ),
  //   data: { breadcrumb: 'Checkout' },
  // },
  // lazy loading account module
  {
    path: 'account',
    loadChildren: () =>
      import('./featured/account/account.module').then(
        (mod) => mod.AccountModule
      ),
    data: { breadcrumb: { skip: true } },
  },
  // lazy loading order module
  {
    path: 'orders',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./featured/order/order.module').then((mod) => mod.OrderModule),
    data: { breadcrumb: 'Orders' },
  },
  { path: '**', redirectTo: 'not-found', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
