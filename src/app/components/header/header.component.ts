import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterLink} from "@angular/router";
import {AuthService} from "../../services/auth.service";
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink,], // Importando CommonModule para usar *ngIf
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  sidebarOpen: boolean = false;
  isLoggedIn: boolean;
  menuVisible: boolean = false;

  constructor(private authService: AuthService) {
    this.isLoggedIn = this.authService.isLoggedIn();
  }
  toggleSidebar(): void {
    this.sidebarOpen = !this.sidebarOpen;
  }

  viewProfile() {
    console.log('Ver perfil de usuario');
    // Aquí puedes abrir un modal o navegar a una página de detalles del usuario
  }

  viewOrders() {
    console.log('Ver pedidos del usuario');
    // Navega a la página de pedidos o muestra detalles en un modal
  }

  logout() {
    this.authService.logoutUser();
    this.isLoggedIn = false;
  }
  toggleMenu() {
    this.menuVisible = !this.menuVisible;
  }
}
