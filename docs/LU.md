---
layout: "page"
title: "Luxembourg"
---
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A==" crossorigin=""/>
<link rel="stylesheet" type="text/css" href="https://unpkg.com/leaflet.markercluster@1.1.0/dist/MarkerCluster.css" />
<link rel="stylesheet" type="text/css" href="https://unpkg.com/leaflet.markercluster@1.1.0/dist/MarkerCluster.Default.css" />
<script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js" integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA==" crossorigin=""></script>
<script type='text/javascript' src='https://unpkg.com/leaflet.markercluster@1.1.0/dist/leaflet.markercluster.js'></script>
<div id='map' style="width: 100%; height: 700px"></div>

<script>
	const map = L.map('map').setView([50.5, 4.4], 8);
	L.tileLayer( 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: ['a','b','c']
  }).addTo( map );

	function onEachFeature(feature, layer) {
		layer.bindPopup(`
      ${feature.properties.labels?.[0].value} <br />
      <b>UIC</b> ${feature.properties.P722?.[0].value} <br />
      <b>IBNR</b> ${feature.properties.P954?.[0].value} <br />
      <b>Station code</b> ${feature.properties.P296?.[0].value}
    `);
	}

  const points = {{ site.data.LU | jsonify }}
  var markers = L.markerClusterGroup();
  var geoJsonLayer = L.geoJson(points, { onEachFeature });
  markers.addLayer(geoJsonLayer);
  map.addLayer(markers);
  map.fitBounds(markers.getBounds());
  fetch('https://raw.githubusercontent.com/lemnis/railway-to-wikidata/master/geojson/tracks/LU.geojson').then(data => data.json()).then(data => map.addLayer(L.geoJson(data)));
</script>

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>Station code</th>
      <th>UIC</th>
      <th>IBNR</th>
      <th>DB</th>
      <th>Benerail</th>
      <th>SNCF</th>
      <th>IATA</th>
      <th>Trainline</th>
    </tr>
  </thead>
  <tbody>
    {% for feature in site.data.LU.features %}
      <tr>
        <td>{{ feature.properties.labels[0].value }}</td>
        <td>
          {% for label in feature.properties.P296 %}
          <a href="https://www.ns.nl/en/stationsinformatie/{{ label.value }}" target="_blank">
            {{ label.value }}
          </a>
          <br />
          {% endfor %}
        </td>
        <td>
          {% for label in feature.properties.P722 %}
            {% assign uic = label.value %}
            <a href="{% include uicLink.html %}" target="_blank">
              {{ label.value }}
            </a><br />
          {% endfor %}
        </td>
       <td>
          {% for label in feature.properties.P954 %}
          <a href="https://reiseauskunft.bahn.de/bin/bhftafel.exe/en?input={{ label.value }}&boardType=dep&time=actual&productsDefault=1111101&start=yes" target="_blank">
              {{ label.value }}
          </a>
          <br />
          {% endfor %}
        </td>
        <td>
          {% for label in feature.properties.P8671 %}
          <a href="https://iris.noncd.db.de/wbt/js/index.html?bhf={{ label.value }}" target="_blank">
              {{ label.value }}
            </a>
            <br />
            {% endfor %}
        </td>
        <td>{% for label in feature.properties.P8448 %}<a target="_blank" href="https://www.b-europe.com/EN/Booking/Tickets?autoactivatestep2=true&origin={{ label.value }}">{{ label.value }}</a><br />{% endfor %}</td>
        <td>{% for label in feature.properties.P8181 %}{{ label.value }}<br />{% endfor %}</td>
        <td>{% for label in feature.properties.P238 %}
          <a href="https://www.iata.org/en/publications/directories/code-search/?airport.search={{ label.value }}" target="_blank">
            {{ label.value }}
          </a>
        {% endfor %}</td>
        <td>
          {% for label in feature.properties.P6724 %}
          <a href="https://trainline-eu.github.io/stations-studio/#/station/{{ label.value }}" target="_blank">
            {{ label.value }}
          </a>
          <br />
          {% endfor %}
        </td>
      </tr>
    {% endfor %}
  </tbody>
</table>
