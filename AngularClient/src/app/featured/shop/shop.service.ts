import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, of } from 'rxjs';
import { IPagination, Pagination } from 'src/app/shared/models/pagination';
import { IProduct } from 'src/app/shared/models/product';
import { IProductBrand } from 'src/app/shared/models/productbrand';
import { IProductType } from 'src/app/shared/models/producttype';
import { ShopParams } from 'src/app/shared/models/shopparams';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  baseUrl = environment.apiUrl;
  products: IProduct[] = [];
  brands: IProductBrand[] = [];
  types: IProductType[] = [];
  pagination = new Pagination();
  shopParams = new ShopParams();
  productCache = new Map();

  constructor(private httpClient: HttpClient) {}

  getProducts(useCache: boolean) {
    if (useCache === false) {
      this.productCache = new Map();
    }
    if (this.productCache.size > 0 && useCache === true) {
      if (this.productCache.has(Object.values(this.shopParams).join('-'))) {
        this.pagination.data = this.productCache.get(
          Object.values(this.shopParams).join('-')
        );
        return of(this.pagination);
      }
    }

    let params = new HttpParams();
    if (this.shopParams.brandId !== 0) {
      params = params.append('BrandId', this.shopParams.brandId.toString());
    }
    if (this.shopParams.typeId !== 0) {
      params = params.append('TypeId', this.shopParams.typeId.toString());
    }
    if (this.shopParams.search) {
      params = params.append('search', this.shopParams.search);
    }

    params = params.append('Sort', this.shopParams.sort);
    params = params.append('PageIndex', this.shopParams.pageNumber);
    params = params.append('PageSize', this.shopParams.pageSize);

    return this.httpClient
      .get<IPagination>(this.baseUrl + 'products', {
        observe: 'response',
        params,
      })
      .pipe(
        map((response) => {
          this.productCache.set(
            Object.values(this.shopParams).join('-'),
            response.body.data
          );
          this.pagination = response.body;
          return this.pagination;
        })
      );
  }
  setShopParams(params: ShopParams) {
    this.shopParams = params;
  }

  getShopParams() {
    return this.shopParams;
  }

  getProduct(id: number) {
    let product: IProduct;

    let data = this.productCache.values();

    for (let products of data) {
      product = products.find((p: IProduct) => p.id === id);

      if (product) break;
    }

    // this.productCache.forEach((products: IProduct[]) => {
    //   console.log(product);
    //   product = products.find((p) => p.id === id);
    // });

    if (product) {
      return of(product);
    }

    return this.httpClient.get<IProduct>(this.baseUrl + 'products/' + id);
  }

  getProductTypes() {
    if (this.types.length > 0) {
      return of(this.types);
    }

    return this.httpClient
      .get<IProductType[]>(this.baseUrl + 'products/types')
      .pipe(
        map((response) => {
          this.types = response;
          return response;
        })
      );
  }
  getProductBrands() {
    if (this.brands.length > 0) {
      return of(this.brands);
    }
    return this.httpClient
      .get<IProductType[]>(this.baseUrl + 'products/brands')
      .pipe(
        map((response) => {
          this.brands = response;
          return response;
        })
      );
  }
}
