import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from "./components/footer/footer.component";
import { HeaderComponent } from "./components/header/header.component";
import { NgOptimizedImage } from "@angular/common";
import {MapLeafletComponent} from "./components/map-leaflet/map-leaflet.component";
declare function initializeTypingEffect(elementSelector: string, words: string[]): void;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FooterComponent, HeaderComponent, NgOptimizedImage, MapLeafletComponent,],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Chiringuito';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) { //Asegura que el código se ejecute solo en el navegador para evitar errores en el servidor
      this.loadScript('assets/js/typingEffect.js').then(() => {
        initializeTypingEffect('.typing-effect', ["Drinks", "Smoothies", "Frozen Desserts", "Cocktails", "Appetizer"]);
      }).catch(error => console.error('Error loading the script:', error));
    }
  }

  loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve();
      script.onerror = (e) => reject(e);
      document.head.appendChild(script);
    });
  }
}
