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

  logout() {
    this.authService.logoutUser();
    this.isLoggedIn = false;
  }
  toggleMenu() {
    this.menuVisible = !this.menuVisible;
  }
}
