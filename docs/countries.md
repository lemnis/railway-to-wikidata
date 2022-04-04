---
layout: page
title: "Countries"
---

<script src="https://embed.github.com/view/geojson/lemnis/railway-to-wikidata/master/docs/_data/map.json"></script>

<table>
  <thead>
    <tr>
      <th>Code</th>
      <th>Name</th>
      <th>UIC</th>
      <th>IBNR</th>
      <th>Coverage</th>
      <th>Description</th>
      <th>Urls</th>
    </tr>
  </thead>
  <tbody>
    {% for row in site.data.map.objects.europe.geometries %}
      <tr style="
        background-color: {{ row.properties.fill }};
        background-image: linear-gradient(rgba(255, 255, 255, .7), rgba(255, 255, 255, .7))
      ">
        <td>{{ row.id }}</td>
        <td>{{ row.properties.name }}</td>
        <td>{{ row.properties.UIC | default: '❌' }}</td>
        <td>{{ row.properties.IBNR | default: '❌' }}</td>
        <td>{{ row.properties.coverage | default: 'None' }}</td>
        <td>{{ row.properties.description }}</td>
        <td><a href="{{ row.properties.url }}">{{ row.properties.url }}</a></td>
      </tr>
    {% endfor %}
  </tbody>
</table>


<link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A==" crossorigin=""/>
<link rel="stylesheet" type="text/css" href="https://unpkg.com/leaflet.markercluster@1.1.0/dist/MarkerCluster.css" />
<link rel="stylesheet" type="text/css" href="https://unpkg.com/leaflet.markercluster@1.1.0/dist/MarkerCluster.Default.css" />
<script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js" integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA==" crossorigin=""></script>
<script type='text/javascript' src='https://unpkg.com/leaflet.markercluster@1.1.0/dist/leaflet.markercluster.js'></script>

<div id='map' style="width: 100%; height: 500px"></div>

<script>
	const map = L.map('map');

	L.tileLayer( 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: ['a','b','c']
  }).addTo( map );

	function onEachFeature(feature, layer) {
		const popupContent = `
      ${feature.properties.labels?.[0]?.value} <br />
      <b>UIC</b> ${feature.properties.P722?.[0]?.value} <br />
      <b>IBNR</b> ${feature.properties.P954?.[0]?.value} <br />
      <b>Station code</b> ${feature.properties.P296?.[0]?.value}
      <b>Atoc</b> ${feature.properties.P4755?.[0]?.value}
    `

		layer.bindPopup(popupContent);
	}

  var markers = L.markerClusterGroup();

  markers.addLayer(L.geoJson({{ site.data.AT | jsonify }}, { onEachFeature }));
  markers.addLayer(L.geoJson({{ site.data.BE | jsonify }}, { onEachFeature }));
  markers.addLayer(L.geoJson({{ site.data.BG | jsonify }}, { onEachFeature }));
  markers.addLayer(L.geoJson({{ site.data.CZ | jsonify }}, { onEachFeature }));
  markers.addLayer(L.geoJson({{ site.data.DE | jsonify }}, { onEachFeature }));
  markers.addLayer(L.geoJson({{ site.data.EE | jsonify }}, { onEachFeature }));
  markers.addLayer(L.geoJson({{ site.data.ES | jsonify }}, { onEachFeature }));
  markers.addLayer(L.geoJson({{ site.data.FI | jsonify }}, { onEachFeature }));
  markers.addLayer(L.geoJson({{ site.data.GR | jsonify }}, { onEachFeature }));
  markers.addLayer(L.geoJson({{ site.data.IE | jsonify }}, { onEachFeature }));
  markers.addLayer(L.geoJson({{ site.data.IT | jsonify }}, { onEachFeature }));
  markers.addLayer(L.geoJson({{ site.data.LT | jsonify }}, { onEachFeature }));
  markers.addLayer(L.geoJson({{ site.data.NL | jsonify }}, { onEachFeature }));
  markers.addLayer(L.geoJson({{ site.data.PT | jsonify }}, { onEachFeature }));
  markers.addLayer(L.geoJson({{ site.data.RO | jsonify }}, { onEachFeature }));
  markers.addLayer(L.geoJson({{ site.data.SE | jsonify }}, { onEachFeature }));
  markers.addLayer(L.geoJson({{ site.data.SK | jsonify }}, { onEachFeature }));
  markers.addLayer(L.geoJson({{ site.data.UK | jsonify }}, { onEachFeature }));

  map.addLayer(markers);
  map.fitBounds(markers.getBounds());
</script>
