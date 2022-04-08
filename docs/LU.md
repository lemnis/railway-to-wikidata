---
layout: "page"
title: "Luxembourg"
---
{% assign stations = site.data.LU %}
{% assign tracks = 'LU' %}
{% include map.html %}

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
            {% include uicLink.html %}
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
