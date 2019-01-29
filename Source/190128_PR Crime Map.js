// JavaScript Document

mapboxgl.accessToken = 'pk.eyJ1IjoiemFuZG9yMTYiLCJhIjoiY2pxemx5c3JvMGVsMDQybnZ4dzR5dDl6MSJ9.A4hczx_vdjz0gtANuK6jjg';
var map = new mapboxgl.Map({
	container: 'map',
	style: 'mapbox://styles/zandor16/cjqzm0csibizh2qrqyagd9j6n',
	center: [-66.069805, 18.416242],
	zoom: 12.3
});

map.addControl(new mapboxgl.NavigationControl());

map.on('load', function() {
// Add a new source from our GeoJSON data and set the
// 'cluster' option to true. GL-JS will add the point_count property to your source data.
map.addSource("earthquakes", {
type: "geojson",
// Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
// from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
data: "https://raw.githubusercontent.com/ramonpena/Puerto-Rico-Crime-Map/bfd4153a5d2691b698997be725bbe3d7e1278517/Data/Crime_Data_Simplified_2016.geojson",
cluster: true,
clusterMaxZoom: 17, // Max zoom to cluster points on
clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
});
 
map.addLayer({
id: "clusters",
type: "circle",
source: "earthquakes",
filter: ["has", "point_count"],
paint: {
// Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
// with three steps to implement three types of circles:
//   * Blue, 20px circles when point count is less than 100
//   * Yellow, 30px circles when point count is between 100 and 750
//   * Pink, 40px circles when point count is greater than or equal to 750
"circle-color": [
"step",
["get", "point_count"],
"#bbbdc0",
100,
"#808284",
750,
"#58585b"
],
"circle-radius": [
"step",
["get", "point_count"],
20,
100,
30,
750,
40
]
}
});
 
map.addLayer({
id: "cluster-count",
type: "symbol",
source: "earthquakes",
filter: ["has", "point_count"],
layout: {
"text-field": "{point_count_abbreviated}",
"text-font": ["DIN Offc Pro Medium", "Arial Unicode MS Bold"],
"text-size": 12
}
});
 
map.addLayer({
id: "unclustered-point",
type: "circle",
source: "earthquakes",
filter: ["!", ["has", "point_count"]],
paint: {
"circle-color": [
["get", "delito"],
"1","#000000",
"2","#000000",
"3","#000000",
"4","#000000",
"5","#000000",
"6","#000000",
"7","#000000",
"8","#000000",
"9","#000000",
"#000000"
],
"circle-radius": 4,
"circle-stroke-width": 1,
"circle-stroke-color": "#fff",
}
});
 
// inspect a cluster on click
map.on('click', 'clusters', function (e) {
var features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
var clusterId = features[0].properties.cluster_id;
map.getSource('earthquakes').getClusterExpansionZoom(clusterId, function (err, zoom) {
if (err)
return;
 
map.easeTo({
center: features[0].geometry.coordinates,
zoom: zoom
});
});
});
 
map.on('mouseenter', 'clusters', function () {
map.getCanvas().style.cursor = 'pointer';
});
map.on('mouseleave', 'clusters', function () {
map.getCanvas().style.cursor = '';
});
});
