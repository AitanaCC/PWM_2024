import {Injectable} from "@angular/core";
import {collection, doc, Firestore, getDocs, getFirestore, query, onSnapshot} from "firebase/firestore";
import {Auth, getAuth, onAuthStateChanged} from "firebase/auth";
import {BehaviorSubject, Observable} from "rxjs";
import {initializeApp} from "firebase/app";


@Injectable({
  providedIn: 'root'
})
export class ProductService {
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


  async getCategories(): Promise<{ categories: string[] }>{
    console.log("Se cargan las categorías");
    return await new Promise<{categories:string[]}>((resolve, reject) => {
      const categories:string[]=[];
      const q = query(collection(this.db, "products"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          querySnapshot.forEach((doc) => {
            categories.push(doc.id.toString());
          });
          unsubscribe();
          resolve({categories});
      });
    });
   }
  getProductsByCat(category: string){
    const productsRef = collection(this.db, `products/${category}`);
  }
}
