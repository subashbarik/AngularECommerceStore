import { Component, OnInit } from '@angular/core';
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
  products: IProduct[];
  productTypes: IProductType[];
  productBrands: IProductBrand[];
  shopParams = new ShopParams();

  //paging
  productCount = 0;
  pageIndex = 1; // Current page index default to first page
  pageSize = 0; // No of products per page
  pageCount = 0; // No of pages productCount/pageSize
  pageCounts: number[];
  bDisablePrev = false; //Whether to enable/disable the previous page button
  bDisableNext = false; //Whether to enable/disable the next page button
  bShowPaging = true; // Whether to show the paging control or not

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
        this.productCount = response.count;
        this.shopParams.pageNumber = response.pageIndex;
        this.shopParams.pageSize = response.pageSize;
        this.pageCount = Math.ceil(
          this.productCount / this.shopParams.pageSize
        );
        this.setPageCountArray();
        this.setEnableDisablePrimaryPageButtons();
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
  setPageCountArray() {
    this.pageCounts = new Array();
    this.pageCounts.length = this.pageCount;
    this.bShowPaging = this.pageCount > 1 ? true : false;
    for (let i = 0; i < this.pageCount; i++) {
      this.pageCounts[i] = i + 1;
    }
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
  onSortSelected(sort: string) {
    this.shopParams.pageNumber = 1;
    this.shopParams.sort = sort;
    this.getProducts();
  }
  onPageClicked(page: number) {
    this.shopParams.pageNumber = page;
    this.getProducts();
  }
  onPagePrimaryButtonClicked(type: string) {
    if (type == 'I') {
      if (this.shopParams.pageNumber < this.pageCount) {
        this.shopParams.pageNumber++;
      }
    }
    if (type == 'D') {
      if (this.shopParams.pageNumber >= 2) {
        this.shopParams.pageNumber--;
      }
    }
    this.getProducts();
  }
  setEnableDisablePrimaryPageButtons() {
    if (this.shopParams.pageNumber == 1) {
      this.bDisablePrev = true;
    } else {
      this.bDisablePrev = false;
    }
    if (this.shopParams.pageNumber == this.pageCount) {
      this.bDisableNext = true;
    } else {
      this.bDisableNext = false;
    }
  }
}
