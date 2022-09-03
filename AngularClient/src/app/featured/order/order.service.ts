import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { IOrder } from 'src/app/shared/models/order';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  baseUrl = environment.apiUrl;
  private orderSource = new BehaviorSubject<IOrder>(null);
  order$ = this.orderSource.asObservable();

  constructor(private http: HttpClient) {}

  getOrders() {
    return this.http.get(this.baseUrl + 'orders');
  }
  getOrderDetails(id: number) {
    return this.http.get<IOrder>(this.baseUrl + 'orders/' + id);
  }
  broadcastOrderDetail(order: IOrder) {
    if (order) {
      this.orderSource.next(order);
    }
  }
}
