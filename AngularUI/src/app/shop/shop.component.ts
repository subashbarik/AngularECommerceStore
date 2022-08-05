import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IProduct } from '../shared/models/product';
import { IProductBrand } from '../shared/models/productbrand';
import { IProductType } from '../shared/models/producttype';
import { ShopParams } from '../shared/models/shopparams';
import { ShopService } from './shop.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
})
export class ShopComponent implements OnInit {
  @ViewChild('search', { static: true }) searchOption: ElementRef;
  products: IProduct[];
  productTypes: IProductType[];
  productBrands: IProductBrand[];
  shopParams = new ShopParams();
  totalCount = 0;

  sortOptions = [
    { name: 'Alphabetical', value: 'name' },
    { name: 'Price: Low to High', value: 'priceAsc' },
    { name: 'Price: High to Low', value: 'priceDesc' },
  ];

  constructor(private shopSerive: ShopService) {}

  ngOnInit(): void {
    this.getProducts();
    this.getProductTypes();
    this.getProductBrands();
  }
  getProducts() {
    this.shopSerive.getProducts(this.shopParams).subscribe(
      (response) => {
        this.products = response.data;
        this.totalCount = response.count;
      },
      (error) => {
        console.log(error);
      }
    );
  }
  getProductTypes() {
    this.shopSerive.getProductTypes().subscribe(
      (response) => {
        this.productTypes = [{ id: 0, name: 'All' }, ...response];
      },
      (error) => {
        console.log(error);
      }
    );
  }
  getProductBrands() {
    this.shopSerive.getProductBrands().subscribe(
      (response) => {
        this.productBrands = [{ id: 0, name: 'All' }, ...response];
      },
      (error) => {
        console.log(error);
      }
    );
  }
  onBrandIdSelected(brandId: number) {
    this.shopParams.pageNumber = 1;
    this.shopParams.brandId = brandId;
    this.getProducts();
  }
  onTypeIdSelected(typeId: number) {
    this.shopParams.pageNumber = 1;
    this.shopParams.typeId = typeId;
    this.getProducts();
  }
  onSortSelected(event: any) {
    this.shopParams.pageNumber = 1;
    this.shopParams.sort = event.target.value;
    this.getProducts();
  }
  onPageChanged(page: number) {
    this.shopParams.pageNumber = page;
    this.getProducts();
  }
  onSearch() {
    this.shopParams.pageNumber = 1;
    this.shopParams.search = this.searchOption.nativeElement.value;
    this.getProducts();
  }
  onReset() {
    this.searchOption.nativeElement.value = '';
    this.shopParams = new ShopParams();
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }
}
