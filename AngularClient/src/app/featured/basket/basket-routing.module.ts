import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BasketComponent } from './basket.component';
import { AuthGuard } from 'src/app/core/guards/auth.guard';

const route: Routes = [
  { path: '', component: BasketComponent },
  {
    path: 'checkout',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('../../featured/checkout/checkout.module').then(
        (mod) => mod.CheckoutModule
      ),
    data: { breadcrumb: 'Checkout' },
  },
];
@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(route)],
  exports: [RouterModule],
})
export class BasketRoutingModule {}
