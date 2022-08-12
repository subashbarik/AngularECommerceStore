import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IProduct } from 'src/app/shared/models/product';
import { BasketService } from '../../basket/basket.service';
import { ShopService } from '../shop.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit {
  product: IProduct;
  quantity = 1;
  constructor(
    private shopService: ShopService,
    private route: ActivatedRoute,
    private basketService: BasketService
  ) {}

  ngOnInit(): void {
    this.getProduct();
  }
  getProduct() {
    this.shopService
      .getProduct(+this.route.snapshot.paramMap.get('id'))
      .subscribe(
        (response) => {
          this.product = response;
        },
        (error) => {
          console.log(error);
        }
      );
  }
  addItemToBasket() {
    this.basketService.addItemToBasket(this.product, this.quantity);
  }
  increamentQuantity() {
    this.quantity++;
  }
  decreamentQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
}
