import { Routes } from '@angular/router';
import {HomeComponent} from "./pages/home/home.component";
import {RegisterLoginComponent} from "./pages/register-login/register-login.component";

export const routes: Routes = [

  {path: '', redirectTo:'Home', pathMatch:'full'},
  {path: 'Home', component:HomeComponent},
  {path: 'register-login', component:RegisterLoginComponent},
];
