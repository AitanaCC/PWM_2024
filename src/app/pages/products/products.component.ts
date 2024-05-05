import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {HeaderComponent} from "../../components/header/header.component";
import {ProductService} from "../../services/product.service";

import {CommonModule, NgFor} from "@angular/common";
import {Product} from "../../models/product.model";
import {strict} from "node:assert";
import {ProductComponent} from "../../components/product/product.component";
import {FlexModule} from "@angular/flex-layout";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [HeaderComponent, CommonModule, NgFor, ProductComponent, FlexModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit {
  categories: string[] | undefined
  productsList: Product[] = [];
  productsLoaded: Promise<boolean> = Promise.resolve(false);
  product: Product = {id: "", description: "", imgRoute: "", name: "", price: 0}
  protected subcollections: string[] = [];
  protected selectedCategory: any;
  protected lastSelectedCategory: any;
  constructor(private productService: ProductService,private router: Router, private activatedRoute: ActivatedRoute) {
    this.loadCategorires().then(r => {
      if (this.categories) {
        console.log("después del load cat: ", this.categories);
      }
    });
    this.productService.selectedCategory$.subscribe((value) =>{
      this.selectedCategory = value;
    });
    this.onSelectedCategory(this.router.getCurrentNavigation()?.extras.state!["category"]);
  }

  ngOnInit() {

    /*
    this.productService.selectedCategory$.subscribe((value) => {
      this.selectedCategory = value;
    });
     */
  }

  onSelectedCategory(category: string | undefined){
    this.productService.setCategory(category);
    console.log(this.selectedCategory);
    if (this.selectedCategory !== this.lastSelectedCategory)
    this.loadSubcollections().then(() => this.productsLoaded = Promise.resolve(true));
    this.lastSelectedCategory = this.selectedCategory;
  }
  async loadSubcollections() {
    console.log(this.selectedCategory);
    this.subcollections = await this.productService.getSubcollectionNames(this.selectedCategory);
    console.log(this.subcollections.join(", "));
    this.productsList = [];
    for (const subcollectionId of this.subcollections) {
      const documents = await this.productService.getDocumentsFromSubcollection(this.selectedCategory, subcollectionId);
      console.log('Documents in subcollection', subcollectionId, documents);
      this.product = await this.productService.getProduct(this.selectedCategory, subcollectionId);
      this.product.id = subcollectionId;
      console.log(this.product);
      this.productsList.push(this.product);
    }
    for (const prod of this.productsList){
      console.log("La ruta es: ", prod.imgRoute);
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
