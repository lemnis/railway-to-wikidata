---
layout: page
title: "Bulgaria"
---

<link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A==" crossorigin=""/>
<script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js" integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA==" crossorigin=""></script>

<div id='map' style="width: 100%; height: 700px"></div>

<script>
	const map = L.map('map').setView([50.5, 4.4], 8);

const markerHtmlStyles = (myCustomColour) => `
  background-color: ${myCustomColour || 'red'};
  width: 3rem;
  height: 3rem;
  display: block;
  left: -1.5rem;
  top: -1.5rem;
  position: relative;
  border-radius: 3rem 3rem 0;
  transform: rotate(45deg);
  border: 1px solid #FFFFFF`

const icon = L.divIcon({
  className: "",
  iconAnchor: [0, 24],
  labelAnchor: [-6, 0],
  popupAnchor: [0, -36],
  html: `<span style="${markerHtmlStyles}" />`
})


	L.tileLayer( 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: ['a','b','c']
}).addTo( map );

	function onEachFeature(feature, layer) {
		const popupContent = `
      ${feature.properties.labels?.[0].value} <br />
      <b>UIC</b> ${feature.properties.P722?.[0].value} <br />
      <b>IBNR</b> ${feature.properties.P954?.[0].value} <br />
      <b>Station code</b> ${feature.properties.P296?.[0].value}
    `

		layer.bindPopup(popupContent);
	}

  const points = {{ site.data.BG | jsonify }}
	const coorsLayer = L.geoJSON(points, {
		pointToLayer: (feature, latlng) => L.marker(latlng),
		onEachFeature: onEachFeature
	}).addTo(map);
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
    {% for feature in site.data.BG.features %}
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
        <td>{% for label in feature.properties.P722 %}{{ label.value }}<br />{% endfor %}</td> 
       <td>
          {% for label in feature.properties.P954 %}
          <a href="https://reiseauskunft.bahn.de/bin/bhftafel.exe/en?input={{ labl.value }}&boardType=dep&time=actual&productsDefault=1111101&start=yes" target="_blank">
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
