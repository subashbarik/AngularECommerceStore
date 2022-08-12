import { Component, OnInit } from '@angular/core';
import { BasketService } from './featured/basket/basket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'AngularClient';
  /**
   *
   */
  constructor(private basketService: BasketService) {}
  ngOnInit(): void {
    const basketId = localStorage.getItem('basket_id');
    if (basketId) {
      this.basketService.getBasket(basketId).subscribe(
        (response) => {
          console.log('initialized');
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }
}
