// src/app/firebase.service.ts
import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  Firestore,
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  DocumentReference,
  QuerySnapshot,
  setDoc
} from 'firebase/firestore';

import { getAuth, onAuthStateChanged, Auth } from 'firebase/auth';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  app: any;
  db: Firestore;
  auth: Auth;
  private currentUserUid = new BehaviorSubject<string | null>(null);

  constructor() {
    const firebaseConfig = {
      apiKey: "AIzaSyC8MhVZ6CcVdQvzl3nR3gdHb8koT1D6gCM",
      authDomain: "pwmapp-a480f.firebaseapp.com",
      projectId: "pwmapp-a480f",
      storageBucket: "pwmapp-a480f.appspot.com",
      messagingSenderId: "154383405024",
      appId: "1:154383405024:web:eb24682aee94f055616585"
    };

    this.app = initializeApp(firebaseConfig);
    this.db = getFirestore(this.app);
    this.auth = getAuth(this.app);

    onAuthStateChanged(this.auth, (user) => {
      this.currentUserUid.next(user ? user.uid : null); // Actualiza el BehaviorSubject
    });
  }

  async getDocuments(collectionName: string): Promise<QuerySnapshot> {
    try {
      const querySnapshot = await getDocs(collection(this.db, collectionName));
      return querySnapshot;  // Devuelve el QuerySnapshot
    } catch (e) {
      console.error("Error getting documents: ", e);
      throw e;  // Lanza el error para manejo externo
    }
  }

  getCurrentUserUid() {
    return this.currentUserUid.asObservable(); // Devuelve un Observable
  }

  async updateBasket(productId: string, quantity: number|null) {
    if (!this.currentUserUid) {
      throw new Error("No user is currently logged in.");
    }
    const basketRef = collection(this.db, `users/${this.currentUserUid}/basket`);

    // If the quantity is null, the product should be deleted (except if it's 'empty')
    if (quantity === null) {
      if (productId !== 'empty') {
        const productDocRef = doc(basketRef, productId);
        await deleteDoc(productDocRef);
        console.log(`Product ${productId} removed from the basket.`);
      }
      return;
    }

    // Update or add a new product (including 'empty')
    const productDocRef = doc(basketRef, productId);
    await setDoc(productDocRef, { quantity }, { merge: true });
    console.log(`Product ${productId} updated/added with quantity ${quantity}.`);
  }


  // Método para comprobar si la cesta del usuario está vacía
  async isEmptyBasket(userId: string): Promise<boolean> {
    const basketRef = collection(this.db, `users/${userId}/basket`);
    const snapshot = await getDocs(basketRef);
    const docs = snapshot.docs.map(doc => doc.id);

    // Comprobar si la única entrada es 'empty'
    return docs.length === 1 && docs.includes('empty');
  }

  /**
   * Método para obtener los detalles de un producto o documento específico
   * desde una ruta dinámica construida con parámetros de colección y documento.
   *
   * @param pathSegments Array de strings que representa la ruta al documento, por ejemplo:
   * ["products", "drinks", "00001", "00001", "productId"]
   *
   * @returns Promise con los datos del documento o null si no existe.
   */
  async getDocumentDetails(pathSegments: string[]): Promise<any> {
    const path = pathSegments.join('/');
    const docRef = doc(this.db, path);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log(`Document found at path: ${path}`);
      return docSnap.data();
    } else {
      console.log(`No document found at path: ${path}`);
      return null;
    }
  }
  async getDocumentByRef(ref: DocumentReference): Promise<any> {
    const docSnap = await getDoc(ref);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.error("Document not found!");
      return null;
    }
  }

  async getBasketItemsWithDetails(): Promise<any[]> {
    if (!this.currentUserUid) {
      console.error("No user is currently logged in.");
      return [];
    }

    const basketRef = collection(this.db, `users/${this.currentUserUid}/basket`);
    const snapshot = await getDocs(basketRef);
    const basketItems = [];

    for (const doc of snapshot.docs) {
      const itemData = doc.data();
      // Using bracket notation to access 'ref' and checking if it exists
      if (itemData['ref'] && typeof itemData['ref'] === 'object' && 'id' in itemData['ref']) {
        const productDetails = await this.getDocumentByRef(itemData['ref']);
        if (productDetails) {
          basketItems.push({
            ...itemData,
            productId: doc.id,
            productDetails
          });
        }
      } else {
        // Handle items without a product reference or log them
        console.log("Item in basket without product reference:", doc.id);
      }
    }
    return basketItems;
  }

  async addProduct(product: any, category: string, productId: string): Promise<void> {
    try {
      const productRef = doc(this.db, `products/${category}/${productId}/${productId}`);
      await setDoc(productRef, product);
      console.log('Product added successfully in category:', category);
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  }

  async removeProduct(category: string, productId: string): Promise<void> {
    try {
      const productRef = doc(this.db, `products/${category}/${productId}/${productId}`);
      await deleteDoc(productRef);
      console.log('Product removed successfully in category:', category);
    } catch (error) {
      console.error('Error removing product:', error);
      throw error;
    }
  }

  async getProduct(category: string, productId: string): Promise<any> {
    const productRef = doc(this.db, `products/${category}/${productId}/${productId}`);
    const docSnap = await getDoc(productRef);
    if (docSnap.exists()) {
      return docSnap.data(); // Returns the product details
    } else {
      throw new Error('Product not found');
    }
  }

}
