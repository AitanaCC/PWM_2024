import {Component,} from '@angular/core';
import {HeaderComponent} from "../../components/header/header.component";
import {ProductService} from "../../services/product.service";
import {CommonModule, NgFor} from "@angular/common";
import {Product} from "../../models/product.model";
import {ProductComponent} from "../../components/product/product.component";
import {FlexModule} from "@angular/flex-layout";
import {Router} from "@angular/router";

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [HeaderComponent, CommonModule, NgFor, ProductComponent, FlexModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent{
  categories: string[] | undefined
  productsList: Product[] = [];
  productsLoaded: Promise<boolean> = Promise.resolve(false);
  product: Product = {id: "", description: "", imgRoute: "", name: "", price: 0}
  protected subcollections: string[] = [];
  protected selectedCategory: any;
  protected lastSelectedCategory: any;
  constructor(private productService: ProductService,private router: Router) {
    this.loadCategories();
    this.productService.selectedCategory$.subscribe((value) =>{
      this.selectedCategory = value;
    });
    this.onSelectedCategory(this.router.getCurrentNavigation()?.extras.state!["category"]);
  }

  onSelectedCategory(category: string | undefined){
    this.productService.setCategory(category);
    console.log(this.selectedCategory);
    if (this.selectedCategory !== this.lastSelectedCategory)
    this.loadSubcollections().then(() => this.productsLoaded = Promise.resolve(true));
    this.lastSelectedCategory = this.selectedCategory;
  }
  async loadSubcollections() {
    this.subcollections = await this.productService.getSubcollectionNames(this.selectedCategory);
    this.productsList = [];
    for (const subcollectionId of this.subcollections) {
      this.product = await this.productService.getProduct(this.selectedCategory, subcollectionId);
      this.product.id = subcollectionId;
      this.productsList.push(this.product);
    }
  }

  async loadCategories() {
    try {
      const result = await this.productService.getCategories();
      this.categories = result.categories;
    } catch (error) {
      console.error("Error al cargar las categorías...", error);
    }
  }



}
