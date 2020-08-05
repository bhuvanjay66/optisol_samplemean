import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { of, BehaviorSubject } from 'rxjs';
import {environment} from '../../../environments/environment'
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItmesValue = [];
  cartItems: BehaviorSubject<any> = new BehaviorSubject(null);
  cartItemChange: EventEmitter<any> = new EventEmitter();

  constructor(
    private http: HttpClient,
    private _snackBar: MatSnackBar
  ) {
    this.cartItems.subscribe(val => {
      this.cartItmesValue = val || this.cartItmesValue;
    })
   }

  getCartList() {
    return this.http.get<any>(environment.apiBaseUrl + '/cart/' + this.cartId).
    pipe( map ( (res: any) => res.data), catchError( err => of([])));
  }

  addNewProductToCart(data) {
    let cartdata={
      cartId:this.cartId,
      data:data
    }
    return this.http.post<any>(environment.apiBaseUrl + '/createcart', cartdata).toPromise();
  }

  updateProductQtyToCart(data) {
    return this.http.post<any>(environment.apiBaseUrl + '/updatecart/'  + this.cartId, data).toPromise();
    
  }

  removeProductFromCart(data) {
    return this.http.post<any>(environment.apiBaseUrl + '/deletecart/'  + this.cartId, data).toPromise();
  }

  get cartId() {
    return localStorage.getItem('cartId');
  }

  addToCart(product) { 
    
      const sendData = {
        "ProductId": product._id,
        "Quantity": product.cartQty + 1
      };
      return this.addNewProductToCart(sendData).then(
        (res: any) => {
          localStorage.setItem('cartId', res.data._id);
          this.openSnackBar(res.message);
          return this.addCartResponse(product, 'cartQty', 'Quantity');
        }
      ).catch(
        err => {
          this.openSnackBar(err.error ? err.error.message : err.message);
          return this.promise(false);
        }
      );
  

  }

  private addCartResponse( product, incProp, decProp) {
    product[incProp] += 1;
    product[decProp] -= 1;
    this.cartItemChange.emit(product);
    return this.promise(false);
  }

  private promise (data) {
    return new Promise((resolve, reject) => {
      return resolve(data);
    });
  }

  cartQtyUpdate(product, prop) {
    const sendData = {
      "ProductId": product._id,
      "Quantity": (prop === 'cartQty' ? product['cartQty'] + 1 : product['cartQty'] -1)
    };
    if(sendData.Quantity > 0) {
      return this.updateProductQtyToCart(sendData).then(
        (res: any) => {
          // console.log(res);
          this.openSnackBar(res.message);
          const dec = prop === 'cartQty' ? 'Quantity' : 'cartQty';
          return this.addCartResponse(product, prop, dec);
        }
      ).catch(
        err => {
          this.openSnackBar(err.error ? err.error.message : err.message);
          return this.promise(false);
        }
      );
    } else {
      return this.removeCartItem(product);
    }
  }

  removeCartItem(product) {
    const data = {
      "ProductId": product._id
    };
    return this.removeProductFromCart(data).then(
      (res: any) => {
        this.openSnackBar(res.message);
        this.cartItmesValue = this.cartItmesValue.filter( f => f._id !== data.ProductId);
        this.cartItems.next(this.cartItmesValue);
        return this.promise(false);
      }
    ).catch(
      err => {
        this.openSnackBar(err.error ? err.error.message : err.message);
        return this.promise(false);
      }
    );
  }
  openSnackBar(message: string) {
    this._snackBar.open(message, '', {
      duration: 3000,
      verticalPosition: 'top',
      panelClass: 'custome-alert'
    });
  }
}
