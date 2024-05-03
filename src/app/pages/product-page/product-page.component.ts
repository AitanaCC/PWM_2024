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

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
  ) {}

  async ngOnInit() {
    const category = this.route.snapshot.paramMap.get('category');
    const id = this.route.snapshot.paramMap.get('id');
    let productData: Promise<string[]>; // Declare productData variable here

    if (category && id) {
      productData = this.productService.getProduct(category, id); // Assign productData here
    } else {
      console.error('Category or id undefined');
      return; // Exit ngOnInit if category or id is undefined
    }

    try {
      const array = await productData; // Use await within an async function
      this.product = {  id: id,
        description: array[0],
        imgRoute: "../../.." + array[1],
        name: array[2],
        price: parseFloat(array[3])};
    } catch (error) {
      console.error(error); // Handle errors that occur during promise resolution
    }

  }
}
