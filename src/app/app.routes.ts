import { Routes } from '@angular/router';
import {HomeComponent} from "./pages/home/home.component";
import {RegisterLoginComponent} from "./pages/register-login/register-login.component";
import {PaymentComponent} from "./pages/payment/payment.component";
import {ContactUsComponent} from "./pages/contact-us/contact-us.component";
import {BasketComponent} from "./pages/basket/basket.component";
import {PasswordResetComponent} from "./pages/password-reset/password-reset.component";
import {GenBillComponent} from "./pages/gen-bill/gen-bill.component";
import {AddProductDbComponent} from "./pages/admin/add-product-db/add-product-db.component";
import {RmProductDbComponent} from "./pages/admin/rm-product-db/rm-product-db.component";
import {NotFoundComponent} from "./pages/not-found/not-found.component";
import {ProductsComponent} from "./pages/products/products.component";

export const routes: Routes = [

  {path: '', redirectTo:'Home', pathMatch:'full'},
  {path: 'Home', component:HomeComponent},
  {path: 'register-login', component:RegisterLoginComponent},
  {path: 'payment', component:PaymentComponent},
  {path: 'contact-us', component:ContactUsComponent},
  {path: 'basket', component:BasketComponent},
  {path: 'password-reset', component:PasswordResetComponent},
  {path: 'genPdf', component:GenBillComponent},
  {path: 'add-product', component:AddProductDbComponent},
  {path: 'rm-product', component: RmProductDbComponent},
  {path: 'paymentGateway', component: PaymentComponent},
  {path: 'products', component: ProductsComponent},
  {path: '**', redirectTo: 'not-found'},
  {path: 'not-found', component: NotFoundComponent }
];
