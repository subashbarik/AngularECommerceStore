import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { IPagination } from 'src/app/shared/models/pagination';
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
  constructor(private httpClient: HttpClient) {}

  getProducts(shopParams: ShopParams) {
    let params = new HttpParams();
    if (shopParams.brandId !== 0) {
      params = params.append('BrandId', shopParams.brandId.toString());
    }
    if (shopParams.typeId !== 0) {
      params = params.append('TypeId', shopParams.typeId.toString());
    }
    if (shopParams.search) {
      params = params.append('search', shopParams.search);
    }

    params = params.append('Sort', shopParams.sort);
    params = params.append('PageIndex', shopParams.pageNumber);
    params = params.append('PageSize', shopParams.pageSize);

    return this.httpClient
      .get<IPagination>(this.baseUrl + 'products', {
        observe: 'response',
        params,
      })
      .pipe(
        map((response) => {
          return response.body;
        })
      );
  }
  getProduct(id: number) {
    return this.httpClient.get<IProduct>(this.baseUrl + 'products/' + id);
  }

  getProductTypes() {
    return this.httpClient.get<IProductType[]>(this.baseUrl + 'products/types');
  }
  getProductBrands() {
    return this.httpClient.get<IProductType[]>(
      this.baseUrl + 'products/brands'
    );
  }
}
