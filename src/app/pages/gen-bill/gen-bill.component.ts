import {Component, OnDestroy} from '@angular/core';
import {HeaderComponent} from "../../components/header/header.component";
import {CommonModule} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import {OnInit} from '@angular/core';
import {FirebaseService} from '../../services/firebase.service';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {Subscription} from "rxjs";
import {MoveCurrencySymbolPipe} from "../../move-currency-symbol.pipe";

@Component({
  selector: 'app-gen-bill',
  standalone: true,
  templateUrl: './gen-bill.component.html',
  imports: [
    HeaderComponent, CommonModule, RouterLink, MoveCurrencySymbolPipe
  ],
  styleUrls: ['./gen-bill.component.css']
})
export class GenBillComponent implements OnInit, OnDestroy {
  basketItems: any[] = [];
  total: number = 0;
  isLoggedIn: boolean | undefined;
  showButton = true;
  private basketSubscription: Subscription | undefined;

  constructor(private firebaseService: FirebaseService, private router: Router) {
  }

  ngOnInit(): void {
    this.firebaseService.getCurrentUserUid().subscribe(uid => {
      if (uid) {
        this.isLoggedIn = true;
        this.subscribeToBasketItems(uid);
      } else {
        this.isLoggedIn = false;
        this.basketItems = [];
        this.total = 0;
      }
    });
  }
  subscribeToBasketItems(userId: string) {
    this.basketSubscription = this.firebaseService.getBasketItemsRealtime(userId).subscribe({
      next: (items) => {
        this.basketItems = items;
        this.calculateTotal();
      },
      error: (error) => {
        console.error('Error fetching basket items:', error);
      }
    });
  }

  calculateTotal() {
    this.total = this.basketItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }


  generatePdf() {
    this.showButton = false;

    setTimeout(() => {
      const data = document.getElementById('basket-contents');
      if (data) {
        html2canvas(data as HTMLElement, {
          scale: 3,
          useCORS: true
        }).then(canvas => {
          const imgWidth = 210;
          const imgHeight = canvas.height * imgWidth / canvas.width;

          const contentDataURL = canvas.toDataURL('image/png', 1.0);
          const pdf = new jsPDF('p', 'mm', 'a4');
          const position = 0;
          pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
          pdf.save('basket-details.pdf');

          this.showButton = true;

          this.router.navigate(['/Home']);
        });
      } else {
        console.error('Element #basket-contents not found');
        this.showButton = true;
      }
    }, 100);
  }

  ngOnDestroy() {
    if (this.basketSubscription) {
      this.basketSubscription.unsubscribe();
      console.log("Unsubscribed from basket updates.");
    }

    this.firebaseService.getCurrentUserUid().subscribe(uid => {
      if (uid) {
        console.log("Clearing basket for user:", uid);
        this.firebaseService.clearBasketExceptEmpty(uid);
      } else {
        console.log("Cannot clear basket, no user UID found.");
      }
    });
  }

}
