import { Component } from '@angular/core';
import { FirebaseService } from "../../../services/firebase.service";
import { FormsModule } from "@angular/forms";
import { HeaderComponent } from "../../../components/header/header.component";
import { CurrencyPipe, NgIf } from "@angular/common";

@Component({
  selector: 'app-rm-product-db',
  templateUrl: './rm-product-db.component.html',
  standalone: true,
  imports: [
    FormsModule,
    HeaderComponent,
    CurrencyPipe,
    NgIf
  ],
  styleUrls: ['./rm-product-db.component.css']
})
export class RmProductDbComponent {
  category: string = '';
  productId: string = '';
  productDetails: any = null;
  confirmDelete: boolean = false;

  constructor(private firebaseService: FirebaseService) {}

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
    alert('Are you sure you want to delete the product? If yes, click confirm deletion.');
  }

  removeProduct() {
    if (this.confirmDelete && this.category && this.productId) {
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
