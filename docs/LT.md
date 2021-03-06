---
title: "Lithuania"
layout: page  
---
{% assign stations = site.data.LT %}
{% assign tracks = 'LT' %}
{% include map.html %}

<table>
  <thead>
    <tr>
      <th>Name</th>
      <th>ESR</th>
      <th>UIC</th>
      <th>IBNR</th>
      <th>Benerail</th>
      <th>SNCF</th>
      <th>Trainline</th>
      <th>Wikidata</th>
      <th>Website</th>
    </tr>
  </thead>
  <tbody>
    {% for feature in site.data.LT.features %}
      <tr>
        <td
          title="{% for label in feature.properties.labels %}{{ label.value | escape }} ({{ label.lang }})&#013;{% endfor %}"
        >
          {{ feature.properties.labels[0].value }}
        </td>
        <td>
          {% for label in feature.properties.P2815 %}
            {{ label.value }}
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
           {% include ibnrLink.html %}
          {% endfor %}
        </td>
        <td>{% for label in feature.properties.P8448 %}<a target="_blank" href="https://www.b-europe.com/EN/Booking/Tickets?autoactivatestep2=true&origin={{ label.value }}">{{ label.value }}</a><br />{% endfor %}</td>
        <td>{% for label in feature.properties.P8181 %}{{ label.value }}<br />{% endfor %}</td>
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
        <td>
          {% for label in feature.properties.P856 %}
          <a href="{{ label.value }}" target="_blank">
            {{ label.value }}
          </a>
          <br />
          {% endfor %}
        </td>
      </tr>
    {% endfor %}
  </tbody>
</table>
