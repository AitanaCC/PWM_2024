document.addEventListener('DOMContentLoaded', function() {
    var map = L.map('map').setView([27.743091, -15.576004], 13); // Cambié las coordenadas para que se abra el mapa sobre el marcador

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // MARCADOR
    var marker = L.marker([27.743091, -15.576004]).addTo(map);
    marker.bindPopup("<b>Chiringuito TFC!</b><br>streetNstreet,CPstreet.").openPopup(); // Abre el popup automáticamente
});
