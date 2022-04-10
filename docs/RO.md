---
title: "Romenia"
layout: page  
---
{% assign stations = site.data.RO %}
{% assign tracks = 'RO' %}
{% include map.html %}

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>ESR</th>
      <th>UIC</th>
      <th>IBNR</th>
      <th>DB</th>
      <th>Benerail</th>
      <th>SNCF</th>
      <th>IATA</th>
      <th>Trainline</th>
      <th>Wikidata</th>
    </tr>
  </thead>
  <tbody>
    {% for feature in site.data.RO.features %}
      <tr>
        <td
          title="{% for label in feature.properties.labels %}{{ label.value }} ({{ label.lang }})&#013;{% endfor %}">
          
          <a href="https://bilete.cfrcalatori.ro/en-GB/Station/{{ feature.properties.labels[0].value  | default: '' | downcase | replace: ' ', '-' | replace: '.', '' | replace: 'ş','s' }}" target="_blank">
            {{ feature.properties.labels[0].value }}
          </a>
        </td>
        <td>
          {% for label in feature.properties.P296 %}
            {% include stationCodeLink.html %}
          {% endfor %}
        </td>
        <td>
          {% for label in feature.properties.P722 %}
            {% include uicLink.html %}
          {% endfor %}
        </td>
       <td>
          {% for label in feature.properties.P954 %}
           {% include ibnrLink.html %}
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
        <td>
          {% for label in feature.properties.PWIKI %}
          <a href="https://www.wikidata.org/wiki/{{ label.value }}" target="_blank">
            {{ label.value }}
          </a>
          <br />
          {% endfor %}
        </td>
      </tr>
    {% endfor %}
  </tbody>
</table>
