import { Component } from '@angular/core';
import {AuthService} from "../../services/auth.service";
import {HeaderComponent} from "../../components/header/header.component";
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-password-reset',
  standalone: true,
  templateUrl: './password-reset.component.html',
  imports: [
    HeaderComponent,
    FormsModule,
    NgIf
  ],
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent {
  email: string = '';
  errorMessage: string = '';
  successMessage: string = '';


  constructor(private authService: AuthService) {}

  onResetPassword() {
    this.authService.resetPassword(this.email)
      .then(() => {
        this.successMessage = 'Please check your email to reset your password.';
        this.errorMessage = '';
      })
      .catch(error => {
        switch (error.code) {
          case 'auth/invalid-email':
            this.errorMessage = 'Invalid email address. Please enter a correct email.';
            break;
          case 'auth/user-not-found':
            this.errorMessage = 'No account found with this email. Please sign up.';
            break;
          default:
            this.errorMessage = 'Failed to send reset email. Please try again.';
            break;
        }
        this.successMessage = '';
      });
  }
}
