---
layout: "page"
title: "Ireland"
---
{% assign stations = site.data.IE %}
{% assign tracks = 'IE' %}
{% include map.html %}
<br />

## Todo

- Add links to departure board, format: `https://www.transportforireland.ie/live-travel-info-service-updates/live-departures/?departureId=${stop_id.slice(0, -1)}&departureValue=${stop_name}`

## Stations

{% include grid.html %}