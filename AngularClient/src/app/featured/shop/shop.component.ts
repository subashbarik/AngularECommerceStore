import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IProduct } from 'src/app/shared/models/product';
import { IProductBrand } from 'src/app/shared/models/productbrand';
import { IProductType } from 'src/app/shared/models/producttype';
import { ShopParams } from 'src/app/shared/models/shopparams';
import { ShopService } from './shop.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss'],
})
export class ShopComponent implements OnInit {
  @ViewChild('search', { static: false }) searchOption: ElementRef;
  products: IProduct[];
  productTypes: IProductType[];
  productBrands: IProductBrand[];
  shopParams: ShopParams;
  totalCount = 0;

  sortOptions = [
    { name: 'Alphabetical', value: 'name' },
    { name: 'Price: Low to High', value: 'priceAsc' },
    { name: 'Price: High to Low', value: 'priceDesc' },
  ];
  constructor(private shopService: ShopService) {
    this.shopParams = this.shopService.getShopParams();
  }

  ngOnInit(): void {
    this.getProducts(true);
    this.getProductTypes();
    this.getProductBrands();
  }
  getProducts(useCache = false) {
    this.shopService.getProducts(useCache).subscribe(
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
    this.shopService.getProductTypes().subscribe(
      (response) => {
        this.productTypes = [{ id: 0, name: 'All' }, ...response];
      },
      (error) => {
        console.log(error);
      }
    );
  }
  getProductBrands() {
    this.shopService.getProductBrands().subscribe(
      (response) => {
        this.productBrands = [{ id: 0, name: 'All' }, ...response];
      },
      (error) => {
        console.log(error);
      }
    );
  }
  onBrandIdSelected(brandId: number) {
    const params = this.shopService.getShopParams();
    params.pageNumber = 1;
    params.brandId = brandId;
    this.shopService.setShopParams(params);
    this.getProducts();
  }
  onTypeIdSelected(typeId: number) {
    const params = this.shopService.getShopParams();
    params.pageNumber = 1;
    params.typeId = typeId;
    this.shopService.setShopParams(params);
    this.getProducts();
  }
  onSortSelected(event: any) {
    const params = this.shopService.getShopParams();
    params.pageNumber = 1;
    params.sort = event.target.value;
    this.shopService.setShopParams(params);
    this.getProducts();
  }
  onPageChanged(page: number) {
    const params = this.shopService.getShopParams();
    params.pageNumber = page;
    this.shopService.setShopParams(params);
    this.getProducts(true);
  }
  onSearch() {
    const params = this.shopService.getShopParams();
    params.pageNumber = 1;
    params.search = this.searchOption.nativeElement.value;
    this.shopService.setShopParams(params);
    this.getProducts();
  }
  onReset() {
    this.searchOption.nativeElement.value = '';
    this.shopParams = new ShopParams();
    this.shopParams.pageNumber = 1;
    this.shopService.setShopParams(this.shopParams);
    this.getProducts();
  }
}
