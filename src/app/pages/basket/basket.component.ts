import { Component } from '@angular/core';
import {HeaderComponent} from "../../components/header/header.component";
import {CommonModule} from "@angular/common";
import {RouterLink} from "@angular/router";
import { OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import {MoveCurrencySymbolPipe} from "../../move-currency-symbol.pipe";

@Component({
  selector: 'app-basket',
  standalone: true,
  imports: [
    HeaderComponent, CommonModule, RouterLink, MoveCurrencySymbolPipe
  ],
  templateUrl: './basket.component.html',
  styleUrls: ['./basket.component.css']
})
export class BasketComponent implements OnInit {
  isLoggedIn: boolean | undefined;
  basketItems: any[] = [];
  total: number = 0;

  constructor(private firebaseService: FirebaseService) {}

  ngOnInit(): void {
    this.firebaseService.getCurrentUserUid().subscribe(uid => {
      if (uid) {
        this.isLoggedIn = true;
        this.subscribeToBasketItems(uid);
      } else {
        this.isLoggedIn = false;
        this.basketItems = []; // Limpiar el carrito cuando no hay usuario loggeado
        this.total = 0;
      }
    });
  }

  subscribeToBasketItems(userId: string) {
    this.firebaseService.getBasketItemsRealtime(userId).subscribe({
      next: (items) => {
        this.basketItems = items;
        this.calculateTotal();
      },
      error: (error) => console.error('Error fetching basket items:', error)
    });
  }

  calculateTotal() {
    this.total = this.basketItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }

  updateQuantity(productId: string, newQuantity: number): void {
    if (newQuantity < 1) {
      // Si la cantidad es menor que 1, entonces eliminar el producto
      this.firebaseService.updateBasket(productId, null);
    } else {
      // Actualizar la cantidad del producto
      this.firebaseService.updateBasket(productId, newQuantity);
    }
  }

}
