import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  deleteUser,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { getFirestore, doc, setDoc, deleteDoc } from 'firebase/firestore';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private app: any;
  private auth: any;
  private db: any;
  private adminUid: string = 'QNaiW8obd1UXEuc8CuPWC5Peadn1'; // Admin UID
  private userStatus = new BehaviorSubject<boolean>(false);
  private adminStatus = new BehaviorSubject<boolean>(false);
  private currentUserUid = new BehaviorSubject<string|null>(null);
  private currentUserSubject = new BehaviorSubject<User | null>(null);
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

    // Escuchar cambios de estado de autenticación
    onAuthStateChanged(this.auth, (user) => {
      const loggedIn = user !== null;
      this.currentUserUid.next(user ? user.uid : null);
      this.userStatus.next(loggedIn);
      this.adminStatus.next(loggedIn && user.uid === this.adminUid);
      this.currentUserSubject.next(user);
    });
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
  getCurrentUserUid(): Observable<string|null> {
    return this.currentUserUid.asObservable(); // Return the Observable from BehaviorSubject
  }

  getCurrentUser(): Observable<any> {
    return this.currentUserSubject.asObservable();
  }

  // Método para eliminar la cuenta del usuario y su documento en Firestore
  async deleteUserAccount() {
    const user = this.auth.currentUser;
    if (!user) {
      console.error("No user logged in.");
      throw new Error("No user logged in.");
    }

    if (user.uid === this.adminUid) {
      alert("You cannot delete the admin account: Attempt blocked.");
      return;
    }

    try {
      await deleteDoc(doc(this.db, `users/${user.uid}`));
      console.log("User document deleted in Firestore.");

      await deleteUser(user);
      console.log("User deleted from Firebase Authentication.");
    } catch (error) {
      console.error("Error deleting user account:", error);
      throw error;
    }
  }
  get isLoggedIn() {
    return this.userStatus.asObservable();
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
  get isAdmin() {
    return this.adminStatus.asObservable();
  }

}
