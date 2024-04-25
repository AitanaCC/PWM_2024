import { Routes } from '@angular/router';
import {HomeComponent} from "./pages/home/home.component";
import {RegisterLoginComponent} from "./pages/register-login/register-login.component";
import {ReviewsComponent} from "./pages/reviews/reviews.component";
import {ContactUsComponent} from "./pages/contact-us/contact-us.component";
import {BasketComponent} from "./pages/basket/basket.component";

export const routes: Routes = [

  {path: '', redirectTo:'Home', pathMatch:'full'},
  {path: 'Home', component:HomeComponent},
  {path: 'register-login', component:RegisterLoginComponent},
  {path: 'reviews', component:ReviewsComponent},
  {path: 'contact-us', component:ContactUsComponent},
  {path: 'basket', component:BasketComponent},
];
