// src/app/firebase.service.ts
import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  Firestore,
  collection,
  getDocs,
  doc,
  getDoc,
  deleteDoc,
  DocumentReference,
  QuerySnapshot,
  setDoc, onSnapshot
} from 'firebase/firestore';

import { getAuth, onAuthStateChanged, Auth } from 'firebase/auth';
import {BehaviorSubject, Observable} from "rxjs";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  app: any;
  db: Firestore;
  auth: Auth;
  private currentUserUid = new BehaviorSubject<string | null>(null);

  constructor(private authService: AuthService) {
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
      this.currentUserUid.next(user ? user.uid : null);
    });
  }

  getCurrentUserUid() {
    return this.currentUserUid.asObservable();
  }

  updateBasket(productId: string, quantity: number|null) {
    this.authService.getCurrentUserUid().subscribe({
      next: (uid) => {
        if (!uid) {
          console.error("No user is currently logged in.");
          return;
        }

        const basketRef = collection(this.db, `users/${uid}/basket`);
        const productDocRef = doc(basketRef, productId);

        if (quantity === null) {
          if (productId !== 'empty') {
            deleteDoc(productDocRef)
              .then(() => console.log(`Product ${productId} removed from the basket.`))
              .catch(error => console.error("Failed to remove product: ", error));
          }
        } else {
          setDoc(productDocRef, { quantity }, { merge: true })
            .then(() => console.log(`Product ${productId} updated/added with quantity ${quantity}.`))
            .catch(error => console.error("Failed to update/add product: ", error));
        }
      },
      error: (error) => console.error("Failed to retrieve user UID: ", error)
    });
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

  getBasketItemsRealtime(userId: string): Observable<any[]> {
    return new Observable(subscriber => {
      const basketRef = collection(this.db, `users/${userId}/basket`);
      const unsubscribe = onSnapshot(basketRef, async (snapshot) => {
        const items = [];
        for (const doc of snapshot.docs) {
          const itemData = doc.data();
          if (itemData['ref']) {
            const productDetails = await this.getDocumentByRef(itemData['ref']);
            items.push({ id: doc.id, ...itemData, ...productDetails });
          }
        }
        subscriber.next(items);
      }, error => subscriber.error(error));

      return () => unsubscribe();
    });
  }
  async clearBasketExceptEmpty(userId: string): Promise<void> {
    console.log("Attempting to clear basket for user:", userId);
    const basketRef = collection(this.db, `users/${userId}/basket`);
    const snapshot = await getDocs(basketRef);

    for (const doc of snapshot.docs) {
      if (doc.id !== "empty") {
        console.log(`Deleting document: ${doc.id}`);
        await deleteDoc(doc.ref);
        console.log(`Document ${doc.id} deleted.`);
      }
    }
    console.log("Basket cleared, except for the 'empty' document.");
  }
}
