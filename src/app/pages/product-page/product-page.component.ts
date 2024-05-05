import { Component, OnInit } from '@angular/core';
import {HeaderComponent} from "../../components/header/header.component";
import {CommonModule} from "@angular/common";
import {RouterLink, ActivatedRoute} from "@angular/router";
import {Product} from "../../models/product.model";
import { ProductService } from '../../services/product.service';
import {DocumentReference} from 'firebase/firestore';
import {catchError} from "rxjs";

@Component({
  selector: 'app-product-page',
  standalone: true,
  imports: [HeaderComponent, CommonModule, RouterLink],
  templateUrl: './product-page.component.html',
  styleUrl: './product-page.component.css'
})
export class ProductPageComponent implements OnInit {

  product: Product = { id: "",
    description: "",
    imgRoute: "",
    name: "",
    price: 0 };

  constructor( private route: ActivatedRoute, private productService: ProductService) {
    const category = this.route.snapshot.paramMap.get('category');
    const id = this.route.snapshot.paramMap.get('id');
    if (category && id) {
      this.getProduct(category, id);
    } else {
      console.error('Category or id undefined');
    }
  }

  ngOnInit() {

  }

  async getProduct(category: string, id: string){
    this.product = await this.productService.getProduct(category, id);
  }
}
