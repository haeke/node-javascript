const axios = require('axios');

import { $ } from './bling';

const mapOptions = {
  center: { lat: 43.2, lng: -79.8 },
  zoom: 10,
};

function loadPlaces(map, lat = 43.2, lng= -79.8) {
  axios.get(`api/stores/near?lat=${lat}&lng=${lng}`)
    .then(res => {
      const places = res.data;
      if (!places.length) {
        alert('no places found');
        return;
      }

      //create bounds
      const bounds = new google.maps.LatLngBounds();
      const infoWindow = new google.maps.InfoWindow();

      const markers = places.map(place => {
        const [placeLng, placeLat] = place.location.coordinates;
        const position = { lat: placeLat, lng: placeLng };
        bounds.extend(position);

        const marker = new google.maps.Marker({
          map: map,
          position: position,
        });

        marker.place = place;

        return marker;
      });

      //show details of marker when clicked
      markers.forEach( marker => marker.addListener('click', function() {
        infoWindow.setContent(this.place.name);
        infoWindow.open(map, this);
      }));
      //zoom the map to fit the markers
      map.setCenter(bounds.getCenter());
      map.fitBounds(bounds);
    });
}

function makeMap(mapDiv) {
  if (!mapDiv) return;
  //create the map
  const map = new google.maps.Map(mapDiv, mapOptions);
  loadPlaces(map);
  const input = $('[name="geolocate"]');
  const autocomplete = new google.maps.places.Autocomplete(input);
};

export default makeMap;
