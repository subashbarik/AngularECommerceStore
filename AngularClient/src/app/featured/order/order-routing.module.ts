import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { OrdersComponent } from './orders.component';
import { OrderSummaryComponent } from './order-summary/order-summary.component';
import { OrderResolver } from './order.resolver';

const route: Routes = [
  { path: '', component: OrdersComponent },
  {
    path: ':id',
    component: OrderSummaryComponent,
    data: {
      breadcrumb: (data: any) =>
        `${'Order# ' + data.order.id + ' - ' + data.order.status}`,
    },
    resolve: { order: OrderResolver },
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(route)],
  exports: [RouterModule],
})
export class OrderRoutingModule {}
