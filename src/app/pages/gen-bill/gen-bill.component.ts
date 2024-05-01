import {Component} from '@angular/core';
import {HeaderComponent} from "../../components/header/header.component";
import {CommonModule} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import {OnInit} from '@angular/core';
import {FirebaseService} from '../../services/firebase.service';
import {DocumentReference} from 'firebase/firestore';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

@Component({
  selector: 'app-gen-bill',
  standalone: true,
  templateUrl: './gen-bill.component.html',
  imports: [
    HeaderComponent, CommonModule, RouterLink
  ],
  styleUrls: ['./gen-bill.component.css']
})
export class GenBillComponent implements OnInit {
  basketItems: any[] = [];
  total: number = 0;
  isLoggedIn: boolean | undefined;
  showButton = true;

  constructor(private firebaseService: FirebaseService, private router: Router) {
  }

  ngOnInit(): void {
    this.firebaseService.getCurrentUserUid().subscribe(uid => {
      if (uid) {
        this.isLoggedIn = true;
        this.loadBasketItems(uid);
      } else {
        this.isLoggedIn = false;
        this.basketItems = []; // Limpiar el carrito cuando no hay usuario loggeado
        this.total = 0;
      }
    });
  }

  async loadBasketItems(userId: string) {
    const basketSnapshot = await this.firebaseService.getDocuments(`users/${userId}/basket`);
    const productDetailsPromises = basketSnapshot.docs.map(async docItem => {
      const itemData = docItem.data();
      const itemRef = itemData['ref'] as DocumentReference;
      if (itemRef) {
        const productDetails = await this.firebaseService.getDocumentByRef(itemRef);
        return {...itemData, ...productDetails};
      } else {
        console.error('No reference found for this item');
        return null;
      }
    });

    this.basketItems = await Promise.all(productDetailsPromises);
    this.basketItems = this.basketItems.filter(item => item !== null); // Filtrar nulls
    this.calculateTotal();
  }

  calculateTotal() {
    this.total = this.basketItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }


  generatePdf() {
    this.showButton = false; // Esconde el botón antes de la captura

    setTimeout(() => {
      const data = document.getElementById('basket-contents');
      if (data) {
        html2canvas(data as HTMLElement, {
          scale: 3, // Incrementa la escala para mejorar la calidad
          useCORS: true // Permite cargar recursos externos para imágenes, si es necesario
        }).then(canvas => {
          const imgWidth = 210; // Aproximadamente el ancho de un A4
          const imgHeight = canvas.height * imgWidth / canvas.width; // Altura proporcional

          const contentDataURL = canvas.toDataURL('image/png', 1.0); // Mejora la calidad de la imagen
          const pdf = new jsPDF('p', 'mm', 'a4');
          const position = 0;
          pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
          pdf.save('basket-details.pdf');

          this.showButton = true; // Muestra el botón de nuevo si es necesario

          // Redirecciona a la página de inicio después de generar el PDF
          this.router.navigate(['/Home']);

        });
      } else {
        console.error('Element #basket-contents not found');
        this.showButton = true; // Muestra el botón de nuevo si la captura falla
      }
    }, 100); // Timeout para asegurar que la UI se actualiza y el botón desaparece antes de la captura
  }

  /*
    FALTA AÑADIR AQUI LOGICA PARA VACIAR LA CESTA JUSTO AL ABANDONAR LA PAGINA
    ngOnDestroy(): void {
      this.clearBasket();
    }

    async clearBasket() {
      const uid = await this.firebaseService.getCurrentUserUid().toPromise(); // asumiendo que getCurrentUserUid retorna un Observable
      if (uid) {
        this.firebaseService.clearBasket(uid);
      }
    }

    esta funcion en firebase.service.ts seria:
    clearBasket(userId: string) {
      const basketRef = collection(this.db, `users/${userId}/basket`);
      getDocs(basketRef).then(snapshot => {
        snapshot.forEach(doc => {
          deleteDoc(doc.ref); // elimina cada documento
        });
      }).catch(error => console.error("Error clearing basket:", error));
    }
  */

}
