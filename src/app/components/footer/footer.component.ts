import { Component } from '@angular/core';
import {MapLeafletComponent} from "../map-leaflet/map-leaflet.component";

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    MapLeafletComponent

  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {

}
