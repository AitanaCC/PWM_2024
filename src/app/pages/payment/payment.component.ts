import { Component } from '@angular/core';
import { HeaderComponent } from "../../components/header/header.component";
import { FormsModule } from "@angular/forms";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [
    HeaderComponent,
    FormsModule,
    RouterLink
  ],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent {
  cardNumber: string = '';
  expiryDate: string = '';
  cvv: string = '';
  oldExpiryDate: string = '';

  formatCardNumber() {
    let value = this.cardNumber.replace(/\D/g, '');
    value = value.slice(0, 16);

    let finalValue = '';
    for (let i = 0; i < value.length; i++) {
      if (i > 0 && i % 4 === 0) {
        finalValue += ' ';
      }
      finalValue += value[i];
    }
    this.cardNumber = finalValue;
  }

  formatExpiryDate() {
    let input = this.expiryDate.replace(/\D/g, '').slice(0, 4);
    if (input.length >= 2) {
      if (this.oldExpiryDate.length > input.length && this.oldExpiryDate[this.oldExpiryDate.length - 1] === '/') {
        input = input.slice(0, 1);
      } else {
        input = input.slice(0, 2) + '/' + input.slice(2);
      }
    }
    this.expiryDate = input;
    this.oldExpiryDate = input;
  }

  formatCVV() {
    this.cvv = this.cvv.replace(/\D/g, '').slice(0, 3);
  }

  onSubmit(): boolean {
    let isValid = true;

    if (!this.isValidCardNumber(this.cardNumber.replace(/\s/g, ''))) {
      // Alert for incorrect card number
      alert('The card number is incorrect.');
      isValid = false;
    }
    if (!this.validateExpiryDate()) {
      isValid = false;
    }
    if (isValid) {
      console.log('Form submitted:', this.cardNumber, this.expiryDate, this.cvv);
    }
    return isValid;
  }



  validateExpiryDate(): boolean {
    const parts = this.expiryDate.split('/');
    const month = parseInt(parts[0], 10);
    const year = parseInt(parts[1], 10);
    const currentYear = new Date().getFullYear() % 100;
    const currentMonth = new Date().getMonth() + 1;

    if (month < 1 || month > 12 || year < currentYear || (year === currentYear && month < currentMonth)) {
      alert('The expiry date is not valid.');
      return false;
    }
    return true;
  }

  isValidCardNumber(number: string): boolean {
    let sum = 0;
    let shouldDouble = false;
    for (let i = number.length - 1; i >= 0; i--) {
      let digit = parseInt(number.charAt(i), 10);
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return (sum % 10) === 0;
  }
}
