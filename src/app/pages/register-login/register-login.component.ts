import {Component, ElementRef, ViewChild} from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {AppComponent} from "../../app.component";
import {FormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";
import {NgIf} from "@angular/common";
import {HeaderComponent} from "../../components/header/header.component";
@Component({
  selector: 'app-register-login',
  standalone: true,
  imports: [AppComponent, FormsModule, RouterLink, NgIf, HeaderComponent],
  templateUrl: './register-login.component.html',
  styleUrl: './register-login.component.css'
})
export class RegisterLoginComponent{
  @ViewChild('autoButton') autoButton!: ElementRef<HTMLButtonElement>;
  loginEmail: string = '';
  loginPassword: string = '';
  signupEmail: string = '';
  signupPassword: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  isAuthenticated: boolean = false;

  constructor(private authService: AuthService) {}

  register() {
    this.authService.registerUser(this.signupEmail, this.signupPassword)
      .then(() => {
        this.isAuthenticated = true;
        this.triggerAutoButtonClick();
        this.errorMessage = '';

      })
      .catch((error) => {
        console.error('Registration failed:', error);
        if (error.code === 'auth/email-already-in-use') {
          this.errorMessage = 'Registration failed: The email address is already in use by another account.';
        } else if (error.code === 'auth/invalid-email') {
          this.errorMessage = 'Registration failed: The email address is not valid.';
        } else if (error.code === 'auth/operation-not-allowed') {
          this.errorMessage = 'Registration failed: Operation not allowed.';
        } else if (error.code === 'auth/weak-password') {
          this.errorMessage = 'Registration failed: The password must be 6 characters long or more.';
        } else {
          this.errorMessage = 'Registration failed: ' + error.message; // Error genérico
        }
      });
  }

  login() {
    this.authService.loginUser(this.loginEmail, this.loginPassword)
      .then(() => {
        console.log('Login successful');
        this.isAuthenticated = true;
        this.triggerAutoButtonClick();
      })
      .catch((error) => {
        console.error('Login failed:', error);
        this.errorMessage = 'Login failed: Incorrect email or password.';
        this.clearForm();
      });
  }

  logout() {
    this.authService.logoutUser();
  }

  triggerAutoButtonClick() {
    setTimeout(() => this.autoButton.nativeElement.click(), 0);
  }

  autoFunc() {
    console.log('Button was clicked automatically!');
  }
  clearForm() {
    this.loginEmail = '';
    this.loginPassword = '';
  }

}
