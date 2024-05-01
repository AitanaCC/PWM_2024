import { Component } from '@angular/core';
import {HeaderComponent} from "../../components/header/header.component";
import {CommonModule} from "@angular/common";
import {RouterLink} from "@angular/router";
import { OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import {DocumentReference} from 'firebase/firestore';

@Component({
  selector: 'app-basket',
  standalone: true,
  imports: [
    HeaderComponent, CommonModule, RouterLink
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
        this.loadBasketItems(uid);
      } else {
        this.isLoggedIn = false;
        this.basketItems = []; // Limpiar el carrito cuando no hay usuario loggeado
        this.total = 0;
      }
    });
  }

  async loadBasketItems(userId: string) {
    const basketSnapshot = await this.firebaseService.getDocuments(`users/${userId}/basket`);
    const productDetailsPromises = basketSnapshot.docs.map(async docItem => {
      const itemData = docItem.data();
      const itemRef = itemData['ref'] as DocumentReference;
      if (itemRef) {
        const productDetails = await this.firebaseService.getDocumentByRef(itemRef);
        return { ...itemData, ...productDetails };
      } else {
        console.error('No reference found for this item');
        return null;
      }
    });

    this.basketItems = await Promise.all(productDetailsPromises);
    this.basketItems = this.basketItems.filter(item => item !== null); // Filtrar nulls
    this.calculateTotal();
  }

  calculateTotal() {
    this.total = this.basketItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }
}
