import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { IPagination } from '../shared/models/pagination';
import { IProductType } from '../shared/models/producttype';
import { ShopParams } from '../shared/models/shopparams';

@Injectable({
  providedIn: 'root',
})
export class ShopService {
  baseUrl = 'https://localhost:5001/api/';
  constructor(private http: HttpClient) {}

  getProducts(shopParams: ShopParams) {
    let params = new HttpParams();
    if (shopParams.brandId !== 0) {
      params = params.append('BrandId', shopParams.brandId.toString());
    }
    if (shopParams.typeId !== 0) {
      params = params.append('TypeId', shopParams.typeId.toString());
    }

    params = params.append('Sort', shopParams.sort);
    params = params.append('PageIndex', shopParams.pageNumber);
    params = params.append('PageSize', shopParams.pageSize);

    return this.http
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

  getProductTypes() {
    return this.http.get<IProductType[]>(this.baseUrl + 'products/types');
  }
  getProductBrands() {
    return this.http.get<IProductType[]>(this.baseUrl + 'products/brands');
  }
}