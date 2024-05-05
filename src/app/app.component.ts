import {Component, OnInit} from '@angular/core';
import {AsyncPipe, NgIf} from '@angular/common';
import {NavigationEnd, Router, RouterOutlet} from '@angular/router';
import {FooterComponent} from "./components/footer/footer.component";
import {HeaderComponent} from "./components/header/header.component";
import {NgOptimizedImage} from "@angular/common";
import {MapLeafletComponent} from "./components/map-leaflet/map-leaflet.component";
import {HomeComponent} from "./pages/home/home.component";
import {FormsModule} from "@angular/forms";
import {FlexLayoutModule} from "@angular/flex-layout";
import {FlexLayoutServerModule} from "@angular/flex-layout/server";

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
    FlexLayoutModule,
    FlexLayoutServerModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

/**
 * @param
 * title: string
 * userId: string
 * newPassword: string
 * isBasketEmpty: boolean | null
 */

export class AppComponent implements OnInit{
  email: string = '';
  showFooter: boolean = true;

  constructor(private router: Router) {}

  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const currentRoute = this.router.url.split('?')[0];
        const isNotFoundRoute = currentRoute === '/not-found';
        this.showFooter = !isNotFoundRoute;
      }
    });
  }

}
