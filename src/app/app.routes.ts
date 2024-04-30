import { Routes } from '@angular/router';
import {HomeComponent} from "./pages/home/home.component";
import {RegisterLoginComponent} from "./pages/register-login/register-login.component";
import {PaymentComponent} from "./pages/payment/payment.component";
import {ReviewsComponent} from "./pages/reviews/reviews.component";
import {ContactUsComponent} from "./pages/contact-us/contact-us.component";
import {BasketComponent} from "./pages/basket/basket.component";
import {PasswordResetComponent} from "./pages/password-reset/password-reset.component";
import {GenBillComponent} from "./pages/gen-bill/gen-bill.component";

export const routes: Routes = [

  {path: '', redirectTo:'Home', pathMatch:'full'},
  {path: 'Home', component:HomeComponent},
  {path: 'register-login', component:RegisterLoginComponent},
  {path: 'payment', component:PaymentComponent},
  {path: 'reviews', component:ReviewsComponent},
  {path: 'contact-us', component:ContactUsComponent},
  {path: 'basket', component:BasketComponent},
  {path: 'password-reset', component:PasswordResetComponent},
  {path: 'genPdf', component:GenBillComponent},
];
