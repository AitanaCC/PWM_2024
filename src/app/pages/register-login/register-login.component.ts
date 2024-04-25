import {Component, ElementRef, ViewChild} from '@angular/core';
import { AuthService } from '../../services/auth.service'; // Asegúrate de que el servicio está correctamente importado.
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
      })
      .catch((error) => {
        console.error('Registration failed:', error);
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
        this.errorMessage = 'Login failed: Incorrect email or password.'; // Establecer el mensaje de error
        this.clearForm(); // Limpiar formulario tras error
      });
  }

  logout() {
    this.authService.logoutUser();
  }

  triggerAutoButtonClick() {
    setTimeout(() => this.autoButton.nativeElement.click(), 0); // Usar setTimeout para evitar problemas de detección de cambios
  }

  autoFunc() {
    console.log('Button was clicked automatically!');
  }
  clearForm() {
    this.loginEmail = '';
    this.loginPassword = '';
  }

}
