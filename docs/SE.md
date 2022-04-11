---
layout: post
title: "Sweden"
---
{% assign stations = site.data.SE %}
{% assign tracks = 'SE' %}
{% include map.html %}
<br />

## Resources

- [Official Rail network in Sweden (PDF)](https://www.sj.se/content/dam/externt/bilder/ovrigt/kartor/sjlinjekartahelasverige-eng-2022.pdf)
- [Rail network in the Nordic countries (PDF)](https://www.sj.se/content/dam/externt/bilder/ovrigt/kartor/kartaovernordiskajarnvagsnatet-2012.pdf)

(source: [https://www.sj.se/en/traffic-info/timetables-and-maps.html]())

## Todo

- Improve / fix the name link to the timetable
- Check reliability of given UIC codes

## Stations

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
      <th>Wikidata</th>
      <th>Website</th>
    </tr>
  </thead>
  <tbody>
    {% for feature in site.data.SE.features %}
      <tr>
        <td
          title="{% for label in feature.properties.labels %}{{ label.value | escape }} ({{ label.lang }})&#013;{% endfor %}">
          
          <a href="https://trafikinfo.sj.se/sv/station/{{ feature.properties.labels[1].value | downcase | replace: 'æ', 'a' | replace: 'ø', 'o' | replace: 'é', 'o' | replace: 'å', 'a' | replace: ' ', '-' | url_param_escape }}?date={{ site.time | date: '%Y-%m-%d' }}" target="_blank">
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
