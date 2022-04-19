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

{% include grid.html %}
