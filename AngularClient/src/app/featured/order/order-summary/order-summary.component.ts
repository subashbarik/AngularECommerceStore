import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { IOrder } from 'src/app/shared/models/order';
import { OrderService } from '../order.service';

@Component({
  selector: 'app-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.scss'],
})
export class OrderSummaryComponent implements OnInit {
  order$: Observable<IOrder>;
  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.order$ = this.orderService.order$;
    this.getOrderDetails();
  }

  getOrderDetails() {
    this.orderService.getOrderDetails(+this.route.snapshot.paramMap.get('id'));
  }
}
