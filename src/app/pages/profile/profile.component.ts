import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {Router, RouterLink} from '@angular/router';
import {NgIf} from "@angular/common";
import {HeaderComponent} from "../../components/header/header.component";  // Importa Router

@Component({
  selector: 'app-profile',
  standalone: true,
  templateUrl: './profile.component.html',
  imports: [
    NgIf,
    HeaderComponent,
    RouterLink
  ],
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  currentUser: any = null;

  constructor(
    private authService: AuthService,
    private router: Router  // Inyecta Router aquí
  ) {}

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe({
      next: (user) => {
        this.currentUser = user;
      },
      error: (err) => console.error('Error fetching user data:', err)
    });
  }

  deleteUserAccount(): void {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      this.authService.deleteUserAccount().then(() => {
        console.log("Account deletion successful");
        this.router.navigate(['/Home']);  // Usa Router para redirigir al usuario
      }).catch(error => {
        console.error("Failed to delete account:", error);
      });
    }
  }
}
