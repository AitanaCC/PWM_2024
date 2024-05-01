import {Component, OnInit} from '@angular/core';
import {HeaderComponent} from "../../components/header/header.component";
import {ProductService} from "../../services/product.service";

import {CommonModule, NgFor} from "@angular/common";

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [HeaderComponent, CommonModule, NgFor],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  categories: string[] | undefined

  constructor(private productService: ProductService) {
  }

  ngOnInit() {
    /*this.productService.getCategories().subscribe((res) =>{
      this.categories = res;
    });*/
    this.loadCategorires();

    //console.log("Categoría: ");
  }

  async loadCategorires() {
    try {
      const result = await this.productService.getCategories();
      this.categories = result.categories;
      console.log(this.categories);
    } catch (error) {
      console.error("Error al cargar las categorías...", error);
    }
  }
}
