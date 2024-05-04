import {Component, Input, OnInit} from '@angular/core';
import {Product} from "../../models/product.model";
import {AsyncPipe, NgIf} from "@angular/common";
import {ProductService} from "../../services/product.service";

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

  imageLoaded: Promise<boolean> = Promise.resolve(false);
  constructor(private productService: ProductService) {}


  ngOnInit(){
  }
}
