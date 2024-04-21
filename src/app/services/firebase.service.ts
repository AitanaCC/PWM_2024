// src/app/firebase.service.ts
import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getFirestore, Firestore, collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, DocumentReference, QuerySnapshot } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  app: any;
  db: Firestore;

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
}
