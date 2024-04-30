import {Component, Inject, PLATFORM_ID} from '@angular/core';
import {AsyncPipe, NgIf} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {FooterComponent} from "./components/footer/footer.component";
import {HeaderComponent} from "./components/header/header.component";
import {NgOptimizedImage} from "@angular/common";
import {MapLeafletComponent} from "./components/map-leaflet/map-leaflet.component";
import {HomeComponent} from "./pages/home/home.component";
import {FirebaseService} from './services/firebase.service';
import {FormsModule} from "@angular/forms";
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    FooterComponent,
    HeaderComponent,
    NgOptimizedImage,
    MapLeafletComponent,
    HomeComponent,
    AsyncPipe,
    FormsModule,
    NgIf,
  ],
  templateUrl: './app.component.html',
  /*template: `
    <input type="email" [(ngModel)]="email" placeholder="Enter your email">
    <input type="password" [(ngModel)]="password" placeholder="Enter your password">
    <button (click)="register()">Register</button>

    <button (click)="updateProductInBasket('00003', 5)">Añadir/Actualizar Producto</button>
    <button (click)="deleteAccount()">Delete My Account</button>
  `
  */
  styleUrls: ['./app.component.css']
})

/**
 * @param
 * title: string
 * userId: string
 * newPassword: string
 * isBasketEmpty: boolean | null
 */

export class AppComponent{

  userId: string | null = null;       // Almacena el ID de usuario
  isBasketEmpty: boolean | null = null;
  documentDetails: any;
  email: string = '';
  password: string = '';

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private firebaseService: FirebaseService, private authService: AuthService) {
  }



  updateProductInBasket(productId: string, quantity: number | null) {
    this.firebaseService.updateBasket(productId, quantity);
    /**
     * MODO DE USO:
     * <button (click)="updateProductInBasket('user1', '00003', 5)">Añadir/Actualizar Producto</button>
     * <button (click)="updateProductInBasket('user1', '00002', null)">Eliminar Producto</button>
     */

  }

  currenUser(){
    this.userId = this.firebaseService.getCurrentUserUid();
  }

  checkIfBasketIsEmpty(userId: string) {
    // Asegúrate de proporcionar el userId correcto aquí
    this.firebaseService.isEmptyBasket(userId).then(result => {
      this.isBasketEmpty = result;
    });

    /**
     * MODO DE USO:
     *      <div>
     *       <input type="text" [(ngModel)]="userId" placeholder="User ID">
     *       <button (click)="checkIfBasketIsEmpty(userId)">Check If Basket Is Empty</button>
     *       <p *ngIf="isBasketEmpty !== null">{{ isBasketEmpty ? 'Basket is empty' : 'Basket is not empty' }}</p>
     *      </div>
     */
  }

  loadProductsDetails(category: string, productId: string) {
    const path = ['products', category, productId, productId];
    this.firebaseService.getDocumentDetails(path).then(details => {
      this.documentDetails = details;
    });
    /**
     * MODO DE USO:
     *     <div>
     *       <button (click)="loadProductsDetails('drinks', '00001')">Load Document Details</button>
     *       <p *ngIf="documentDetails">Name: {{ documentDetails.name }}</p> //Nombre del producto
     *       <p *ngIf="documentDetails">Description: {{ documentDetails.description }}</p> //Descripción del producto
     *       <p *ngIf="documentDetails">Price: {{ documentDetails.price }}</p> //Precio del producto
     *       <img *ngIf="documentDetails" [src]="documentDetails['img-route']" alt="Document Image"> //Imagen del producto
     *     </div>
     */
  }

  /** ---------------------------------- FUNCIONES DE "AUTHENTICATION" -----------------------------------------------*/
  register() {
    this.authService.registerUser(this.email, this.password);
  }

  login() {
    this.authService.loginUser(this.email, this.password);
  }

  /**
   * MODO DE USO:
   * <button (click)="login()">Login</button>
   *     <button (click)="currenUser()">Login</button>
   *     <div>User ID: {{ userId }}</div>
   */

  logout() {
    this.authService.logoutUser();
  }

  /**
   * MODO DE USO:
   * <div>
   *       <input type="email" [(ngModel)]="email" placeholder="Enter your email">
   *       <input type="password" [(ngModel)]="password" placeholder="Enter your password">
   *       <button (click)="register()">Register</button>
   *       <button (click)="login()">Login</button>
   *       <button (click)="logout()">Logout</button>
   * </div>
   */

  /** ----------------------------------------------------------------------------------------------------------------*/
  deleteAccount() {
    if (confirm("Are you sure you want to delete your account? This cannot be undone.")) {
      this.authService.deleteUserAccount().then(() => {
        console.log("Account deleted successfully.");
        // Aquí puedes redirigir al usuario o actualizar el estado de la UI
      }).catch(error => {
        console.error("Failed to delete account:", error);
      });
    }
  }

  /**
   * MODO DE USO:
   * <button (click)="deleteAccount()">Delete My Account</button>
   */

}
