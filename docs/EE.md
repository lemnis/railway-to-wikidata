---
title: "Estonia"
layout: page
---

{% assign stations = site.data.EE %}
{% assign tracks = 'EE' %}
{% include map.html %}
<br />

## Todo

- Include the station code from the GTFS feed and link it to `https://web.peatus.ee/aggregaatti-aikataulu/estonia:${stationCode}`
- Merge duplicate locations

## Stations

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
    {% for feature in stations.features %}
      <tr>
        <td
          title="{% for label in feature.properties.labels %}{{ label.value | escape }} ({{ label.lang }})&#013;{% endfor %}">
          {{ feature.properties.labels[0].value }}</td>
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
            {% for other in stations.features %}  {% for prop in other.properties.PWIKI %}
              {% if prop.value == label.value and other.id != feature.id %}style="background: firebrick;"{% endif %}
            {% endfor %} {% endfor %}
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


<script src="https://unpkg.com/ag-grid-community/dist/ag-grid-community.min.js"></script>
<div id="myGrid" style="width:100%; height: 90vh;" class="ag-theme-alpine"></div>

<script>
const valueFormatter = function (params) {
  console.log(params, params.value)
  return params.value?.map(({ value }) => value).join(', ');
};

const defaultColumns = ['labels','P296', 'P954', 'P722', 'PWIKI', 'P8448']

const columnDefs = [...new Set(points.features.map(i => Object.keys(i.properties)).flat())].filter(i => !['P17', "P31", 'P131'].includes(i)).map(field => ({ field, valueFormatter,checked: defaultColumns.includes(field) }))

// specify the data
const rowData = points.features.map(i => i.properties);

// let the grid know which columns and what data to use
const gridOptions = {
  columnDefs,
  defaultColDef: {
    flex: 1,
    minWidth: 120,
    sortable: true,
    filter: true,
     menuTabs: ['filterMenuTab', 'generalMenuTab', 'columnsMenuTab']
  },
  rowData
};

// setup the grid after the page has finished loading
const gridDiv = document.querySelector('#myGrid');
  new agGrid.Grid(gridDiv, gridOptions);
</script>
