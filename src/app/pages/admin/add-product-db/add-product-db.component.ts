import {Component, OnInit} from '@angular/core';
import { FirebaseService } from "../../../services/firebase.service";
import { FormsModule } from "@angular/forms";
import { HeaderComponent } from "../../../components/header/header.component";
import {AuthService} from "../../../services/auth.service";
import { Router } from '@angular/router';
import {NgIf} from "@angular/common";
import {PermissionDeniedComponent} from "../permission-denied/permission-denied.component";
import {ProductService} from "../../../services/product.service";

@Component({
  selector: 'app-add-product-db',
  standalone: true,
  templateUrl: './add-product-db.component.html',
  imports: [
    FormsModule,
    HeaderComponent,
    NgIf,
    PermissionDeniedComponent
  ],
  styleUrls: ['./add-product-db.component.css']
})
export class AddProductDbComponent implements OnInit {
  product = {
    name: '',
    price: 0,
    description: '',
    imgRoute: ''
  };
  category: string = '';
  productId: string = '';
  isAdmin: boolean = false;
  alertShown: boolean = false;  // Flag para controlar la alerta

  constructor(private authService: AuthService, private productService:ProductService, private router: Router) {}

  ngOnInit() {
    this.authService.isAdmin.subscribe(isAdmin => {
      this.isAdmin = isAdmin;
    });
  }
  submitProduct() {
    if (!this.isAdmin) {
      alert('You are not authorized to perform this action.');
      return;
    }
    if (this.product.name && this.product.price > 0 && this.productId && this.category) {
      this.productService.addProduct(this.product, this.category, this.productId).then(() => {
        alert('Product added successfully.');
        this.resetForm(); // Reset form
      }).catch(error => {
        console.error('Error adding product:', error);
        alert('Error adding product.');
      });
    } else {
      alert('Please fill out all fields correctly.');
    }
  }

  resetForm() {
    this.product = { name: '', price: 0, description: '', imgRoute: '' };
    this.category = '';
    this.productId = '';
  }

}
