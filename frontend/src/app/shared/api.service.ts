import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import {environment} from '../../environments/environment'
import {cloneDeep} from 'loadsh';

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  constructor(private http: HttpClient) { }

  getProducts(config, filter) {
    const sendData = {
      page: config.page,
      limit: 12,
      filter,
      sortKey: 'createdAt',
      sortOrder: -1
    };
    return this.http.post(environment.apiBaseUrl+'/getproducts',sendData)
    .pipe(
      map((res: any) => res.data),
      catchError(this.errorMgmt)
    )
  }


  formateProduct(data, cartList) {
    const products = cloneDeep(data);
    return products.map( m => {
      const cart = cartList.find( c => c._id === m._id);
      if(cart) m = {...m, ...cart};
      m['cartQty'] = m['cartQty'] || 0;
      return m;
    });
  }

  getDetailsFromUploadedxls(formdata): Observable<any> {
    return this.http.post<any>(environment.apiBaseUrl + '/addproduct',formdata)
      .pipe(

      );
  }

  getProductsById(id) {
    debugger
    return this.http.get<any>(environment.apiBaseUrl + '/getproductbyid/' + id).pipe(

      );
  }


  // Error handling 
  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }

}