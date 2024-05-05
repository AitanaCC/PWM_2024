import {Component, Input, OnInit} from '@angular/core';
import {Product} from "../../models/product.model";
import {AsyncPipe, NgIf} from "@angular/common";
import {ProductService} from "../../services/product.service";
import {FirebaseService} from "../../services/firebase.service";

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit {
  @Input()
  product: Product = {id: "", description: "", imgRoute: "", name: "", price: 0}
  @Input()
  category: string= "";

  imageLoaded: Promise<boolean> = Promise.resolve(false);
  constructor(private productService: ProductService, private firebaseService: FirebaseService) {}


  ngOnInit(){
  }

  add2Basket() {
    this.productService.addProduct2Basket(this.product, this.category).then(r => console.log("Añadido el producto: "));
    //this.firebaseService.updateBasket(this.product.id, 1).then(r => console.log("Añadido: ", r));
  }
}
