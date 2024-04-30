import { Component, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-map-leaflet',
  standalone: true,
  templateUrl: './map-leaflet.component.html',
  styleUrls: ['./map-leaflet.component.css']
})
export class MapLeafletComponent implements AfterViewInit {
  private map: L.Map | undefined;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

  private initMap(): void {
    import('leaflet').then(L => {
      this.map = L.map('map', {
        center: [27.743091, -15.576004], // Cambio las coordenadas del centro del mapa
        zoom: 13 // Ajusto el zoom para enfocar en el marcador
      });

      const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        minZoom: 3,
        attribution: 'Chiringuito TFC!'
      }).addTo(this.map);

      const markerIcon = L.icon({
        iconSize: [25, 41],
        iconAnchor: [10, 41],
        popupAnchor: [2, -40],
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
      })

      // Añadiendo el marcador
      const marker = L.marker([27.743091, -15.576004], {icon:markerIcon}).addTo(this.map);
      marker.bindPopup("<b>Chiringuito TFC!</b><br>streetNstreet,CPstreet.").openPopup(); // Abre el popup automáticamente
    });
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initMap();
    }
  }
}
