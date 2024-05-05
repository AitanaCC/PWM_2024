import {Injectable} from "@angular/core";
import {
  collection,
  doc,
  Firestore,
  getDocs,
  getFirestore,
  query,
  onSnapshot,
  getDoc,
  arrayUnion,
  updateDoc,
  setDoc,
  deleteDoc,
  arrayRemove,
  increment
} from "firebase/firestore";
import {Auth, getAuth, onAuthStateChanged} from "firebase/auth";
import {BehaviorSubject} from "rxjs";
import {initializeApp} from "firebase/app";
import {Product} from "../models/product.model";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  app: any;
  db: Firestore;
  auth: Auth;
  private currentUserUid = new BehaviorSubject<string | null>(null);
  private category$ = new  BehaviorSubject<any>({});
  selectedCategory$ = this.category$.asObservable();

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
      this.currentUserUid.next(user ? user.uid : null);
    });
  }
  setCategory(category: any){
    this.category$.next(category);
  }

  async getCategories(): Promise<{ categories: string[] }>{
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
   async getSubcollectionNames(categoryID: string): Promise<string[]> {
    const docRef = doc(this.db, `products/${categoryID}`);
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      const data = docSnapshot.data();
      return data['subcollections'] || [];
    } else {
      console.error('Document does not exist!');
      return [];
    }
  }

  /* ----------------- FUNCIÓN ÚTIL FUTURA PARA OBTENER LOS PRODUCTOS DEL CARRITO -----------------

  async getBasketProducts(uid: string){
    const basketRef = collection(this.db, `users/${uid}/basket`);
    const snapshot = await getDocs(basketRef);
    const basketList: any[] = [];
    snapshot.docs.map(doc=>({
      id: doc.id,
      data: doc.data()
    })).filter((doc)=> doc.id != "empty").forEach((doc)=>{
      getDoc(doc.data['ref']).then((doc)=>{
        basketList.push(doc.data());
      })
    });
    return basketList;
    /!*
    return snapshot.docs.map(doc =>({
      id: doc.id,
      data: doc.data()
    }));
    *!/
  }

  -----------------------------------------------------------------------------------------------*/

  async addProduct(product: any, category: string, productId: string): Promise<void> {
    try {
      const productRef = doc(this.db, `products/${category}/${productId}/${productId}`);
      await setDoc(productRef, product);
      console.log('Product added successfully in category:', category);

      const categoryRef = doc(this.db, `products/${category}`);
      await updateDoc(categoryRef, {
        subcollections: arrayUnion(productId)
      });
      console.log('ProductId added to subcollections array in category document');
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  }

  async addProduct2Basket(product: Product, category: string) {
    const uid = this.auth.currentUser?.uid;
    if (!uid) {
      alert("User must be logged in to add products to the basket.");
      return;
    }
    const documentReference = doc(this.db, `users/${uid}/basket/${product.id}`);
    const documentSnapshot = await getDoc(documentReference);
    if (documentSnapshot.exists()) {
      await updateDoc(documentReference, {
        quantity: increment(1)
      });
      console.log("Product quantity incremented in the basket.");
    } else {
      let quantity = 1;
      let ref = doc(this.db, `products/${category}/${product.id}/${product.id}`);
      await setDoc(documentReference, {
        quantity,
        ref
      });
      console.log("New product added to the basket.");
    }
  }

  async removeProduct(category: string, productId: string): Promise<void> {
    try {
      const productRef = doc(this.db, `products/${category}/${productId}/${productId}`);
      await deleteDoc(productRef);
      console.log('Product removed successfully from category:', category);

      const categoryRef = doc(this.db, `products/${category}`);
      await updateDoc(categoryRef, {
        subcollections: arrayRemove(productId)
      });
      console.log('ProductId removed from subcollections array in category document');
    } catch (error) {
      console.error('Error removing product:', error);
      throw error;
    }
  }

  async getProduct(category: string, productId: string): Promise<any> {
    const productRef = doc(this.db, `products/${category}/${productId}/${productId}`);
    const docSnap = await getDoc(productRef);
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      throw new Error('Product not found');
    }
  }
}
