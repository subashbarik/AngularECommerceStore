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
  private ordersSource = new BehaviorSubject<IOrder[]>(null);
  private orderSource = new BehaviorSubject<IOrder>(null);
  orders$ = this.ordersSource.asObservable();
  order$ = this.orderSource.asObservable();

  constructor(private http: HttpClient) {}

  getOrders() {
    return this.http.get(this.baseUrl + 'orders').subscribe(
      (response: IOrder[]) => {
        this.ordersSource.next(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }
  getOrderDetails(id: number) {
    return this.http.get(this.baseUrl + 'orders/' + id).subscribe(
      (response: IOrder) => {
        this.orderSource.next(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
