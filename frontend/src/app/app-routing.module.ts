import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import {MatProgressBarModule} from '@angular/material/progress-bar';

import {ProductsComponent} from './components/products/products.component';
import {ProductDetailsComponent} from './components/product-details/product-details.component';
import {ProductAddComponent} from './components/product-add/product-add.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', component: ProductsComponent },
  {path: 'product/:id', component: ProductDetailsComponent },
  { path: 'productlist', component: ProductAddComponent }
];

@NgModule({
  imports: [  CommonModule,
    MatProgressBarModule,
    RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }