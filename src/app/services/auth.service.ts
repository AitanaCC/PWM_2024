import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, deleteUser, sendPasswordResetEmail } from 'firebase/auth';
import { getFirestore, doc, setDoc, deleteDoc } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private app: any;
  private auth: any;
  private db: any;


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
    this.auth = getAuth(this.app);
    this.db = getFirestore(this.app);
  }
  async registerUser(email: string, password: string) {
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      console.log('User registered:', userCredential.user);

      // Crear el documento de usuario en Firestore
      const userDocRef = doc(this.db, `users/${userCredential.user.uid}`);
      await setDoc(userDocRef, {
        email: email,
        uid: userCredential.user.uid
      });

      // Inicializar la cesta de compras del usuario
      const basketDocRef = doc(this.db, `users/${userCredential.user.uid}/basket/empty`);
      await setDoc(basketDocRef, {});

      return userCredential;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  }

  async loginUser(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      console.log('User logged in:', userCredential.user);
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }

  async logoutUser() {
    try {
      await signOut(this.auth);
      console.log('User logged out');
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  }

  // Método para obtener el UID del usuario actualmente autenticado
  getCurrentUserUid(): string | null {
    const user = this.auth.currentUser;
    return user ? user.uid : null;
  }

  // Método para eliminar la cuenta del usuario y su documento en Firestore
  async deleteUserAccount() {
    const user = this.auth.currentUser;
    if (!user) {
      console.error("No user logged in.");
      throw new Error("No user logged in.");
    }

    try {
      // Primero intentamos eliminar el documento de Firestore
      await deleteDoc(doc(this.db, `users/${user.uid}`));
      console.log("User document deleted in Firestore.");

      // Si eso es exitoso, eliminamos el usuario de Authentication
      await deleteUser(user);
      console.log("User deleted from Firebase Authentication.");
    } catch (error) {
      console.error("Error deleting user account:", error);
      throw error;
    }
  }
  isLoggedIn(): boolean {
    const user = this.auth.currentUser;
    return user !== null;
  }

  // Añade el método de reseteo de contraseña aquí
  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.auth, email);
      console.log("Reset password email sent.");
    } catch (error) {
      console.error("Failed to send reset password email:", error);
      throw error;
    }
  }

}
