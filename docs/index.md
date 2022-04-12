---
layout: "page"
title: "railway-to-wikidata"
---

# Goal

The goal of this project to get a complete overview of all **in-use** & **public** railway locations with its corresponding IDs of different systems.

## UIC location codes

A UIC location code is a unique 7-digit code indicating a location. The first 2 digits indicate the country.

Multiple resources uses is ID also for there internal systems, but possible in a different format. Common formats are:

- 5-digit number (country code is ommitted, location code)
- 6-digit number (same value as above, with the 6th number as a checksum following the luhn algorithm)
- 7-digit number (default, country code + location code)
- 8-digit number (country code + location code, with the 8th number as a checksum against the 3th to 7th number)

Often the internal IDs of a data source are based off the UIC code, as such it is advised to check if you can find overlap with UIC codes already gathered from other data sources.

## Todo

- `sk-zsr` - Remove hardcoded country, instead get country through coordinats.
- Improve label scoring system
- Remove duplicate labels
- Prevent original locations being matched a new location
- Fix locations without a country
- Improve scoring system by creating a flexible maximum score
- Ignore [UIC reservation codes](https://www.wikidata.org/wiki/Property_talk:P722#Which_UIC_code?)

## Resources that can help find new data sources

- [https://github.com/RensBloom/EUrailcompanies/blob/master/EUrailcompanies.md](https://github.com/RensBloom/EUrailcompanies/blob/master/EUrailcompanies.md)
- [https://github.com/public-transport/european-transport-operators](https://github.com/public-transport/european-transport-operators)
- [https://transport.ec.europa.eu/system/files/2021-11/its-national-access-points.pdf](https://transport.ec.europa.eu/system/files/2021-11/its-national-access-points.pdf)
- [https://www.trafiklab.se/api/other-apis/public-transport-europe/https://www.trafiklab.se/api/other-apis/public-transport-europe/](https://www.trafiklab.se/api/other-apis/public-transport-europe/https://www.trafiklab.se/api/other-apis/public-transport-europe/)
- [https://data.europa.eu/data/datasets?query=gtfs](https://data.europa.eu/data/datasets?query=gtfs)
- [https://github.com/WSDOT-GIS/GTFS-JS/blob/master/agencies.json](https://github.com/WSDOT-GIS/GTFS-JS/blob/master/agencies.json)
- [https://rail.cc/train-company](https://rail.cc/train-company)
- [http://www.projectmapping.co.uk/rail_maps_diagrams.html](http://www.projectmapping.co.uk/rail_maps_diagrams.html)
