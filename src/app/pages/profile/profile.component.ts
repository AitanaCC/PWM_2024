import { Component, OnInit } from '@angular/core';
import {HeaderComponent} from "../../components/header/header.component";
import {CommonModule} from "@angular/common";
import {RouterLink} from "@angular/router";
import {Product} from "../../models/product.model";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [HeaderComponent, CommonModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

}
