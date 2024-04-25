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

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  app: any;
  db: Firestore;
  auth: Auth;
  currentUserUid: string | null = null; // Almacena el UID del usuario actual

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
      if (user) {
        this.currentUserUid = user.uid; // Actualiza el UID cuando el usuario está loggeado
        console.log("Logged in as:", user.uid);
      } else {
        this.currentUserUid = null; // Limpia el UID cuando no hay usuario loggeado
        console.log("No user logged in.");
      }
    });
  }
// Función para añadir documentos
  async addDocument(collectionName: string, data: any): Promise<DocumentReference> {
    try {
      const docRef = await addDoc(collection(this.db, collectionName), data);
      console.log("Document written with ID: ", docRef.id);
      return docRef;  // Devuelve el DocumentReference
    } catch (e) {
      console.error("Error adding document: ", e);
      throw e;  // Lanza el error para manejo externo
    }
  }

  // Función para obtener documentos
  async getDocuments(collectionName: string): Promise<QuerySnapshot> {
    try {
      const querySnapshot = await getDocs(collection(this.db, collectionName));
      return querySnapshot;  // Devuelve el QuerySnapshot
    } catch (e) {
      console.error("Error getting documents: ", e);
      throw e;  // Lanza el error para manejo externo
    }
  }

  // Función para obtener un documento específico
  async getDocument(collectionName: string, docId: string): Promise<any> {
    try {
      const docRef = doc(this.db, collectionName, docId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data();  // Devuelve los datos del documento
      } else {
        console.log("No such document!");
        return null;  // Devuelve null si el documento no existe
      }
    } catch (e) {
      console.error("Error getting document: ", e);
      throw e;  // Lanza el error para manejo externo
    }
  }

  // Función para actualizar un documento
  async updateDocument(collectionName: string, docId: string, newData: any): Promise<void> {
    try {
      const docRef = doc(this.db, collectionName, docId);
      await updateDoc(docRef, newData);
    } catch (e) {
      console.error("Error updating document: ", e);
      throw e;  // Lanza el error para manejo externo
    }
  }

  // Función para eliminar un documento
  async deleteDocument(collectionName: string, docId: string): Promise<void> {
    try {
      const docRef = doc(this.db, collectionName, docId);
      await deleteDoc(docRef);
    } catch (e) {
      console.error("Error deleting document: ", e);
      throw e;  // Lanza el error para manejo externo
    }
  }

  getCurrentUserUid(): string | null {
    const user = this.auth.currentUser;
    return user ? user.uid : null;
  }

  async updateBasket(productId: string, quantity: number|null) {
    if (!this.currentUserUid) {
      throw new Error("No user is currently logged in.");
    }
    const basketRef = collection(this.db, `users/${this.currentUserUid}/basket`);

    // Si la cantidad es null, se debe eliminar el producto (excepto si es 'empty')
    if (quantity === null) {
      if (productId !== 'empty') {
        const productDocRef = doc(basketRef, productId);
        await deleteDoc(productDocRef);
        console.log(`Producto ${productId} eliminado de la cesta.`);
      }
      return;
    }

    // Actualizar o añadir un nuevo producto (incluyendo 'empty')
    const productDocRef = doc(basketRef, productId);
    await setDoc(productDocRef, { quantity }, { merge: true });
    console.log(`Producto ${productId} actualizado/añadido con cantidad ${quantity}.`);
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


}
