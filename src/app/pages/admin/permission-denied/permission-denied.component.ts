import { Component } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBan } from '@fortawesome/free-solid-svg-icons';
import {Router} from "@angular/router";
@Component({
  selector: 'app-permission-denied',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './permission-denied.component.html',
  styleUrl: './permission-denied.component.css'
})
export class PermissionDeniedComponent {
  faBan = faBan;
  constructor(private router: Router) { }

  goBack() {
    this.router.navigate(['/Home']); // Función para navegar a la página de inicio
  }
}
