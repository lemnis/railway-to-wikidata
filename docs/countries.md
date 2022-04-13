---
layout: page
title: "Countries & Providers"
---

<script src="https://embed.github.com/view/geojson/lemnis/railway-to-wikidata/master/docs/_data/map.json" defer async></script>

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
        <td><a href="./{{ row.id }}">{{ row.id }}</a></td>
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

<div id='map' style="width: 100%; height: 500px"></div>

<br/>

## Providers

List of implemented providers with rough indication of the area covered and its ID used.

| Name          | Area                                | Properties                                                 |
| ------------- | ----------------------------------- | ---------------------------------------------------------- |
| Euasfr        | EU                                  | 60% of the countries have a station code (IBNR, UIC, etc.) |
| Iris          | German & neighbouring countries     | IBNR, UIC                                                  |
| Trainline     | Mostly EU                           | All (international) station codes                          |
| Oebb          | Austria & neighbours                | IBNR                                                       |
| Irail         | Belgium                             | UIC                                                        |
| Sbb           | Switzerland & neighbours            | UIC                                                        |
| LeoExpress    | Czechia, Slovakia & neighbours      | UIC                                                        |
| Regiojet      | Czechia & neighbours                | Station Code                                               |
| Deutsche Bahn | Germany                             | IBNR, UIC                                                  |
| Peatus        | Estonia                             | None!                                                      |
| Renfe         | Spain & neighbourPs                 | UIC                                                        |
| Digitraffic   | Finland & a couple Russian stations | UIC, Station Code                                          |
| SNCF          | France                              | UIC                                                        |
| TrainOse      | Greece & neighbours                 | Station Code                                               |
| HZPP          | Croatia                             | None!                                                      |
| MAV           | Hungary                             | None!                                                      |
| Irish Rail    | Ireland & Northern Ireland          | Station Code                                               |
| Trenitalia    | Italy                               | Station Code for a few locations                           |
| Litrail       | Lithuania                           | ESR, UIC                                                   |
| Openov        | Luxembourg & neighbours             | None!                                                      |

...Need to add more...

<link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A==" crossorigin=""/>
<link rel="stylesheet" type="text/css" href="https://unpkg.com/leaflet.markercluster@1.1.0/dist/MarkerCluster.css" />
<link rel="stylesheet" type="text/css" href="https://unpkg.com/leaflet.markercluster@1.1.0/dist/MarkerCluster.Default.css" />
<script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js" integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA==" crossorigin=""></script>
<script type='text/javascript' src='https://unpkg.com/leaflet.markercluster@1.1.0/dist/leaflet.markercluster.js'></script>

<script>
const map = L.map("map");

L.tileLayer("http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: ["a", "b", "c"],
}).addTo(map);

function onEachFeature(feature, layer) {
  layer.bindPopup(
    ` ${feature.properties.labels?.[0]?.value} <br /> <b>UIC</b> ${feature.properties.P722?.[0]?.value} <br /> <b>IBNR</b> ${feature.properties.P954?.[0]?.value} <br /> <b>Station code</b> ${feature.properties.P296?.[0]?.value} <b>Atoc</b> ${feature.properties.P4755?.[0]?.value} `
  );
}

var markers = L.markerClusterGroup();

Promise.all(
  [
    "AT",
    "BE",
    "BG",
    "CH",
    "CZ",
    "DE",
    "DK",
    "EE",
    "ES",
    "FI",
    "FR",
    "GR",
    "HU",
    "HR",
    "IE",
    "IT",
    "LT",
    "LU",
    "LV",
    "NL",
    "NO",
    "PL",
    "PT",
    "RO",
    "SE",
    "SI",
    "SK",
    // "GB",
  ].map((country) =>
    fetch(
      `https://raw.githubusercontent.com/lemnis/railway-to-wikidata/master/docs/_data/${country}.json`
    )
      .then((data) => data.json())
      .then((data) => {
        markers.addLayer(L.geoJson(data, { onEachFeature }));
      })
  )
).then(() => {
  map.addLayer(markers);
  map.fitBounds(markers.getBounds());
});
</script>