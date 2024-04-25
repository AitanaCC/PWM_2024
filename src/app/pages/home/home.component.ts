import {Component, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {HeaderComponent} from "../../components/header/header.component";
import {AsyncPipe, isPlatformBrowser} from "@angular/common";
declare function initializeTypingEffect(elementSelector: string, words: string[]): void;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    HeaderComponent,
    AsyncPipe,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }
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
