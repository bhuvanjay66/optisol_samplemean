import { Component, OnInit,ViewChild, Input } from '@angular/core';
import { ApiService } from '../../shared/api.service';
import { CartService } from '../../shared/service/cart.service';
import { Subscription } from 'rxjs';
import { Product } from '../../shared/model/data';
import { InfiniteScrollDirective } from 'ngx-infinite-scroll';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  config = {
    page: 0,
    totalCount: 0,
    products: []
  };
  filter: string;
  subs: Subscription[] = [];
  products: Product[] = [];

  cartItems = [];
  loading: boolean = false;
  cartComponent: boolean
  @Input('product') product: Product; 

  @ViewChild(InfiniteScrollDirective, {static: false}) infiniteScroll: InfiniteScrollDirective;

  constructor(
    private service: ApiService,
    private cartService: CartService
  ) { 
    this.getProducts();
  }

  ngOnInit() {
    debugger
    this.subs.push(
      this.cartService.cartItems.subscribe(
        val => {
          debugger
          if(val) {
            this.products = this.service.formateProduct(this.config.products, val);
            // console.log(this.config.products)
          }
        }
      )
    );
  }

  ngOnDestroy() {
    this.subs.forEach( f => f.unsubscribe());
  }

  private getProducts() {
    debugger
    this.loading = true;
    this.service.getProducts(this.config, this.filter || '').subscribe(
      res => {
        this.loading = false;
        this.config.totalCount = res.length;
        this.config.products = [...this.config.products, ...res];
        this.products = this.service.formateProduct(this.config.products, this.cartService.cartItmesValue);
      },
      err => {
        this.loading = false;
        this.config.page -= 1
      }
    );
  }

  cartQtyChange(type, product) {
    debugger
    this.loading = true;
    const prop = type === 'inc' ? 'cartQty' : 'Quantity';
    this.cartService.cartQtyUpdate(product, prop).then(
      res => this.loading = false
    ).catch(
      err => this.loading = false
    );
  }

  addToCart(product) {
    debugger
    this.loading = true;
    if(product.Quantity > 0) {
      this.cartService.addToCart(product).then(
        res => {this.loading = false
          }
      ).catch(
        err => this.loading = false
      );
    }
  }

  get decCheck() {
    if(this.cartComponent) return this.products['cartQty'] > 1;
    return this.products['cartQty'] > 0;
  }

  get incCheck() {
    return this.products['Quantity'] > 0;
  }

}
