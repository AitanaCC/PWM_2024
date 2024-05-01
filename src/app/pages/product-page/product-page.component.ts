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
export class ProductPageComponent {


}
