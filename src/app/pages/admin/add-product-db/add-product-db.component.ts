import { Component } from '@angular/core';
import { FirebaseService } from "../../../services/firebase.service";
import { FormsModule } from "@angular/forms";
import { HeaderComponent } from "../../../components/header/header.component";

@Component({
  selector: 'app-add-product-db',
  standalone: true,
  templateUrl: './add-product-db.component.html',
  imports: [
    FormsModule,
    HeaderComponent
  ],
  styleUrls: ['./add-product-db.component.css']
})
export class AddProductDbComponent {
  product = {
    name: '',
    price: 0,
    description: '',
    imgRoute: ''
  };
  category: string = '';
  productId: string = '';
  constructor(private firebaseService: FirebaseService) {}

  submitProduct() {
    if (this.product.name && this.product.price > 0 && this.productId && this.category) {
      this.firebaseService.addProduct(this.product, this.category, this.productId).then(() => {
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
