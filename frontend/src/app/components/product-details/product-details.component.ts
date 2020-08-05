import { Component, OnInit, OnDestroy } from '@angular/core';
import{ApiService} from '../../shared/api.service'
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CartService } from '../../shared/service/cart.service';
import {cloneDeep} from 'loadsh';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  subscription: Subscription[] = [];
  productId: string;
  loading: boolean;
  product;
  loadingCart: boolean;
  actualProduct;
  cartItems = [];
  cartComponent: any;
  
  constructor(
    private service: ApiService,
    private activeRoute: ActivatedRoute,
    private cartService: CartService
  ) {
    this.subscription.push(
      this.activeRoute.paramMap.subscribe(
        val => {
          this.productId = val.get('id');
          this.getProduct();
        } 
      )
    );
   }

  ngOnInit() {
    this.subscription.push(
      this.cartService.cartItems.subscribe(
        val => {
          if(val && this.product) {
            const pro = val.find( f => f._id === this.product._id);
            if(pro) {
              this.product['cartQty'] = pro['cartQty'];
              this.product.Quantity = pro.Quantity;
            } else this.product = cloneDeep(this.actualProduct);
          } 
        }
      )
    );
  }

  ngOnDestroy() {
    this.subscription.forEach( f => f.unsubscribe());
  }

  private getProduct() {
    debugger
    this.loading = true;
    this.service.getProductsById(this.productId).subscribe(
      res => {
        debugger
        this.loading = false;
        if(res) {
          res["data"].cartQty=0
          this.actualProduct = cloneDeep(res);
          const pro = this.cartService.cartItmesValue.find( f => f._id === res.data._id);
          if(pro) {
            
            res["data"].cartQty= pro['cartQty'];
            res["data"].Quantity = pro.Quantity;
          }
          this.product = res["data"];
        }
      },
      err=>{
        console.log(err)
      }
    );
  }

  cartQtyChange(type, product) {
    this.loadingCart = true;
    const prop = type === 'inc' ? 'cartQty' : 'Quantity';
    this.cartService.cartQtyUpdate(product, prop).then(
      res => this.loadingCart = false
    ).catch(
      err => this.loadingCart = false
    );
  }

  addToCart(product) {
    debugger
    this.loadingCart = true;
    if(product.Quantity > 0) {
      this.cartService.addToCart(product).then(
        res => this.loadingCart = false
      ).catch(
        err => this.loadingCart = false
      );
    }
  }
}
