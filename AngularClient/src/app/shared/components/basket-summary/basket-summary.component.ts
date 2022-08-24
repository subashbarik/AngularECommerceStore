import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Observable } from 'rxjs';
import { BasketService } from 'src/app/featured/basket/basket.service';
import { IBasket, IBasketItem } from '../../models/basket';
import { IOrderItem } from '../../models/order';

@Component({
  selector: 'app-basket-summary',
  templateUrl: './basket-summary.component.html',
  styleUrls: ['./basket-summary.component.scss'],
})
export class BasketSummaryComponent implements OnInit {
  // basket$: Observable<IBasket>;
  @Input() isBasket = true; //used to configure the basket related styles
  @Input() itemList: any;
  @Input() isOrder = false;

  @Output()
  increament: EventEmitter<IBasketItem> = new EventEmitter<IBasketItem>();
  @Output() decreament: EventEmitter<IBasketItem> =
    new EventEmitter<IBasketItem>();
  @Output() remove: EventEmitter<IBasketItem> = new EventEmitter<IBasketItem>();

  constructor(private basketService: BasketService) {}

  ngOnInit(): void {}
  incrementItemQuantity(item: IBasketItem) {
    this.increament.emit(item);
  }
  decrementItemQuantity(item: IBasketItem) {
    this.decreament.emit(item);
  }
  removeBasketItem(item: IBasketItem) {
    this.remove.emit(item);
  }
}
