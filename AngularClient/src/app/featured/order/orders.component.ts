import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { IOrder } from 'src/app/shared/models/order';
import { OrderService } from './order.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {
  myOrders: IOrder[];
  bFetchingOrder = true;
  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.getOrders();
  }
  getOrders() {
    this.orderService.getOrders().subscribe(
      (orders: IOrder[]) => {
        this.myOrders = orders;
        this.bFetchingOrder = false;
      },
      (error) => {
        console.log(error);
        this.bFetchingOrder = false;
      }
    );
  }
}
