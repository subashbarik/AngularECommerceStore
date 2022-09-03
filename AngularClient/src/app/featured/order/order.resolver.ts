import { Injectable } from '@angular/core';
import {
  Router,
  Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { IOrder } from 'src/app/shared/models/order';
import { OrderService } from './order.service';

@Injectable({
  providedIn: 'root',
})
export class OrderResolver implements Resolve<IOrder> {
  constructor(private orderService: OrderService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<IOrder> {
    const id = route.params['id'];
    return this.orderService.getOrderDetails(+id);
  }
}
