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
    this.loadCategorires().then(r => {
      if (this.categories) {
        console.log("después del load cat: ", this.categories);
        this.loadSubcollections();
      }
    });

  }

  async loadSubcollections() {
    const subcollections = await this.productService.getSubcollectionNames(this.categories![2]);
    console.log(subcollections.join(", "));
    for (const subcollectionId of subcollections) {
      const documents = await this.productService.getDocumentsFromSubcollection(this.categories![2], subcollectionId);
      console.log('Documents in subcollection', subcollectionId, documents);
    }
  }
/*
  ngOnInit() {
    /*this.productService.getCategories().subscribe((res) =>{
      this.categories = res;
    });
    this.loadCategorires().then(r => {
      if (this.categories) {
        console.log("después del load cat: ", this.categories);
        this.productService.getProductsByCat(this.categories[2]);
      }
    });


    //console.log("Categoría: ");
  }
*/
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
