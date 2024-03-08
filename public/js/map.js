mapboxgl.accessToken = token;
const map = new mapboxgl.Map({
container: 'map', // container ID
center:coordinates, // starting position [lng, lat]
zoom: 9 // starting zoom
});

const marker1 = new mapboxgl.Marker({ color: '#E0233D' })
.setLngLat(coordinates)
.addTo(map)

