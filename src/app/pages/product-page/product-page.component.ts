import { Component, OnInit } from '@angular/core';
import {HeaderComponent} from "../../components/header/header.component";
import {CommonModule} from "@angular/common";
import {RouterLink, ActivatedRoute} from "@angular/router";
import {Product} from "../../models/product.model";
import { ProductService } from '../../services/product.service';
import {FirebaseService} from "../../services/firebase.service";
import { Location } from '@angular/common';
@Component({
  selector: 'app-product-page',
  standalone: true,
  imports: [HeaderComponent, CommonModule, RouterLink],
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.css'
})
export class ProductPageComponent implements OnInit {

  product: Product = {
    id: "",
    description: "",
    imgRoute: "",
    name: "",
    price: 0
  };
  isLoggedIn: boolean | undefined;
  category: string | null = null;
  id: string | null = null;


  constructor(private firebaseService: FirebaseService, private route: ActivatedRoute, private productService: ProductService,     private location: Location) {
    this.category = this.route.snapshot.paramMap.get('category');
    this.id = this.route.snapshot.paramMap.get('id');
    if (this.category && this.id) {
      this.getProduct(this.category, this.id);
    } else {
      console.error('Category or id undefined');
    }
  }

  ngOnInit() {
    this.firebaseService.getCurrentUserUid().subscribe(uid => {
      this.isLoggedIn = !!uid;
    });
  }

  async getProduct(category: string, id: string){
    this.product = await this.productService.getProduct(category, id);
    if (this.id != null) {
      this.product.id = this.id;
    }
  }

  async addProductToBasketAndGoBack() {
    if (this.category) {
      await this.productService.addProduct2Basket(this.product, this.category);
      this.location.back();
    } else {
      console.error('Product category is not defined');
    }
  }
}
