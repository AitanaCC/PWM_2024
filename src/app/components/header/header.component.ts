import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterLink} from "@angular/router";
import {AuthService} from "../../services/auth.service";
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink,],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  sidebarOpen: boolean = false;
  isLoggedIn: boolean = false;
  menuVisible: boolean = false;
  isAdmin: boolean = false;

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.authService.isLoggedIn.subscribe((status) => {
      this.isLoggedIn = status;
    });
    this.authService.isAdmin.subscribe((adminStatus) => {
      this.isAdmin = adminStatus;
    });
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
