import { Routes } from '@angular/router';
import {HomeComponent} from "./pages/home/home.component";
import {RegisterLoginComponent} from "./pages/register-login/register-login.component";
import {AppComponent} from "./app.component";
import {ContactUsComponent} from "./pages/contact-us/contact-us.component";
import {PaymentComponent} from "./pages/payment/payment.component";

export const routes: Routes = [

  {path: '', redirectTo:'Home', pathMatch:'full'},
  {path: 'Home', component:HomeComponent},
  {path: 'register-login', component:RegisterLoginComponent},
  {path: 'contact-us', component:ContactUsComponent},
  {path: 'payment', component:PaymentComponent},
];
