---
layout: page
title: "Greece"
---

(Map only shows in use stations)

{% assign stations = site.data.GR %}
{% assign tracks = 'GR' %}
{% include map.html %}
<br />

## Resources

- [InterCity Network Map (PDF)](https://www.trainose.gr/wp-content/uploads/2021/03/%CE%A7%CE%AC%CF%81%CF%84%CE%B7%CF%82-%CE%A0%CE%91%CE%9D%CE%95%CE%9B%CE%9B%CE%91%CE%94%CE%99%CE%9A%CE%9F%CE%A5-%CE%B4%CE%B9%CE%BA%CF%84%CF%8D%CE%BF%CF%85-18%CE%99%CE%BF%CF%85%CE%BD2020.pdf)

(source: [https://www.trainose.gr/en/passenger-activity/intercity-network/]())

## Stations
<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>In use</th>
      <th>Station code</th>
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
    {% for feature in site.data.GR.features %}
      <tr>
        <td
          title="{% for label in feature.properties.labels %}{{ label.value | escape }} ({{ label.lang }})&#013;{% endfor %}">
          {{ feature.properties.labels[1].value }}</td>
        <td>
          {% if feature.properties.info.enabled %}✅{% else %}❌{% endif %}
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
          <a
            href="https://www.wikidata.org/wiki/{{ label.value }}"
            target="_blank"
          >
            {{ label.value }}
          </a>
          <br />
          {% endfor %}
        </td>        
      </tr>
    {% endfor %}
  </tbody>
</table>
