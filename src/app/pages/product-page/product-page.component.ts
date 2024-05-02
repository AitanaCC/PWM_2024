import { Component, OnInit } from '@angular/core';
import {HeaderComponent} from "../../components/header/header.component";
import {CommonModule} from "@angular/common";
import {RouterLink} from "@angular/router";
import {Product} from "../../models/product.model";
import { FirebaseService } from '../../services/firebase.service';
import {DocumentReference} from 'firebase/firestore';

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

  ngOnInit() {
    //const id = Number(this.route.snapshot.paramMap.get('id'));
    this.product = {  id: "0001/0001",
      description: "Savor the crisp, effervescent delight of Coke. With its iconic flavor and refreshing fizz, it's a timeless classic that elevates any moment.",
      imgRoute: "../../../assets/img/drinks/coke.png",
      name: "Coke",
      price: 1.68};
      //this.product = this.productService.getProductById(id);
  }
}
