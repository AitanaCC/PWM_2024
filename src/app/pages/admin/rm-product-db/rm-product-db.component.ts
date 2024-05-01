import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../../services/auth.service";
import { FirebaseService } from "../../../services/firebase.service";
import {FormsModule} from "@angular/forms";
import {HeaderComponent} from "../../../components/header/header.component";
import {CurrencyPipe, NgIf} from "@angular/common";
import {PermissionDeniedComponent} from "../permission-denied/permission-denied.component";

@Component({
  selector: 'app-rm-product-db',
  templateUrl: './rm-product-db.component.html',
  standalone: true,
  styleUrls: ['./rm-product-db.component.css'],
  imports: [
    FormsModule,
    HeaderComponent,
    CurrencyPipe,
    NgIf,
    PermissionDeniedComponent
  ]
})
export class RmProductDbComponent implements OnInit {
  isAdmin: boolean = false;
  category: string = '';
  productId: string = '';
  productDetails: any = null;
  confirmDelete: boolean = false;

  constructor(private authService: AuthService, private firebaseService: FirebaseService) {}

  ngOnInit() {
    this.authService.isAdmin.subscribe(isAdmin => {
      this.isAdmin = isAdmin;
    });
  }

  fetchProduct() {
    if (this.category && this.productId) {
      this.firebaseService.getProduct(this.category, this.productId).then(product => {
        this.productDetails = product;
        this.confirmDelete = false; // Reset confirmation on new fetch
      }).catch(error => {
        console.error('Error retrieving product:', error);
        alert('Error retrieving product. Please verify the entered data.');
      });
    }
  }

  confirmDeletion() {
    this.confirmDelete = true;
  }

  removeProduct() {
    if (this.category && this.productId) {
      this.firebaseService.removeProduct(this.category, this.productId).then(() => {
        alert('Product deleted successfully.');
        this.productDetails = null;
        this.confirmDelete = false;
        this.resetForm();
      }).catch(error => {
        console.error('Error deleting product:', error);
        alert('Error deleting product.');
      });
    }
  }

  resetForm() {
    this.category = '';
    this.productId = '';
  }
}
