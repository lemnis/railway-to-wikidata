// http://www.hzpp.hr/en/Contents/Item/Display/383?m=385&mp=13
// offical dataset can be found here:
// https://www.promet-info.hr/en/datasets_details?id=95df8225-6741-acc6-f7f2-2f9b7d0902f6

export const Stations = new Promise<
  {
    latitude: number;
    longitude: number;
    name: string;
    street: string;
    map: any;
    nameAndStreet: string;
    description: string;
  }[]
>((resolve) => {
  const result: {
    latitude: number;
    longitude: number;
    name: string;
    street: string;
    map: any;
    nameAndStreet: string;
    description: string;
  }[] = [];
  const map = undefined;

  function addMarker(
    latitude: number,
    longitude: number,
    name: string,
    street: string,
    map: any,
    nameAndStreet: string,
    description: string
  ) {
    result.push({
      latitude,
      longitude,
      name,
      street,
      map,
      nameAndStreet,
      description,
    });
  }

  addMarker(
    45.1907748793,
    18.2928904688,
    "Andrijevci",
    "",
    map,
    "Andrijevci",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.4457145263,
    16.8761823035,
    "Banova Jaruga",
    "S. Radića 16, Banova Jaruga",
    map,
    "Banova Jaruga, S. Radića 16, Banova Jaruga",
    "Train station, <br />Working hours: mon - sat            4.40 - 16.100 sun and blagdan      12.30 - 20.00"
  );
  addMarker(
    46.0415259064,
    15.9978427366,
    "Bedekovčina",
    "Trg Ante Starčevića 14, Bedekovčina",
    map,
    "Bedekovčina, Trg Ante Starčevića 14, Bedekovčina",
    "Train station, <br />Working hours: mon - fri              05.40 - 13.10    "
  );
  addMarker(
    45.7656755942,
    18.5961379164,
    "Beli Manastir",
    "Trg slobode 26, Beli Manastir",
    map,
    "Beli Manastir, Trg slobode 26, Beli Manastir",
    "Train station, <br />Working hours: mon - fri               06.40 - 14.10   "
  );
  addMarker(
    44.0263297609,
    15.61426985,
    "Benkovac",
    "Benkovačke bojne 4, Benkovac",
    map,
    "Benkovac, Benkovačke bojne 4, Benkovac",
    "Train station, <br />Buy ticket on the bus"
  );
  addMarker(
    44.0813381729,
    15.2777395005,
    "Bibinje",
    "Kralja Petra Krešimira IV. 67, Bibinje",
    map,
    "Bibinje, Kralja Petra Krešimira IV. 67, Bibinje",
    "Train station, <br />Buy ticket on the bus"
  );
  addMarker(
    45.5871337927,
    18.4530093809,
    "Bizovac",
    "Kolodvorska b.b., Bizovac",
    map,
    "Bizovac, Kolodvorska b.b., Bizovac",
    "Train station, <br />Working hours: mon - fri                05.20 -12.50         "
  );
  addMarker(
    45.8940714232,
    16.8446658723,
    "Bjelovar",
    "Tomislavov trg 2, Bjelovar",
    map,
    "Bjelovar, Tomislavov trg 2, Bjelovar",
    "Train station, <br />Working hours: mon - fri             05.40 - 17.10          sat                     07.30 - 15.00       sun and blagdan                     12.40 - 20.10                      "
  );
  addMarker(
    45.3356930828,
    17.7572836032,
    "Blacko-Jakšić",
    "Kolodvorska 219, Jakšić ",
    map,
    "Blacko-Jakšić, Kolodvorska 219, Jakšić ",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.4157621442,
    16.4576623609,
    "Blinjski Kut",
    "",
    map,
    "Blinjski Kut",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.3043263497,
    14.052268776,
    "Borut",
    "Borut b.b., Borut",
    map,
    "Borut, Borut b.b., Borut",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    46.1266952633,
    16.8919901575,
    "Bregi",
    "Kolodvorska 3, Bregi",
    map,
    "Bregi, Kolodvorska 3, Bregi",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.4649238425,
    14.9612177497,
    "Brod Moravice",
    "Ključ 9, Brod Moravice",
    map,
    "Brod Moravice, Ključ 9, Brod Moravice",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    46.1282011691,
    16.2137231239,
    "Budinšćina",
    "Kraljevec Gornji 8, Budinščina",
    map,
    "Budinšćina, Kraljevec Gornji 8, Budinščina",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.4262660498,
    13.985151093,
    "Buzet",
    "",
    map,
    "Buzet",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.7581311026,
    17.5813823354,
    "Cabuna",
    "Alojzija Stepinca 8, Cabuna",
    map,
    "Cabuna, Alojzija Stepinca 8, Cabuna",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    46.2597138994,
    16.2187238442,
    "Cerje Tužno",
    "Cerje Tužno b.b., Radovan",
    map,
    "Cerje Tužno, Cerje Tužno b.b., Radovan",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.1942316418,
    18.6991043489,
    "Cerna",
    "Kolodvorska 58, Cerna",
    map,
    "Cerna, Kolodvorska 58, Cerna",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.2765883348,
    14.0138066101,
    "Cerovlje",
    "",
    map,
    "Cerovlje",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.5986217891,
    17.8689672625,
    "Čačinci",
    "Kolodvorska b.b., Čačinci",
    map,
    "Čačinci, Kolodvorska b.b., Čačinci",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.3483831251,
    17.9900422085,
    "Čaglin",
    "Kolodvorska 3, Čaglin",
    map,
    "Čaglin, Kolodvorska 3, Čaglin",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    46.3844204914,
    16.420487545,
    "Čakovec",
    "Kolodvorska 2, Čakovec",
    map,
    "Čakovec, Kolodvorska 2, Čakovec",
    "Train station, <br />Working hours: mon - fri 04.50 - 19.40, sat 06.00 - 13.30 sun and blagdan 12.40 - 20.10"
  );
  addMarker(
    45.5004930351,
    18.9672473444,
    "Dalj",
    "Vladimira Nazora b.b., Dalj",
    map,
    "Dalj, Vladimira Nazora b.b., Dalj",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.6338714258,
    18.6992656805,
    "Darda",
    "Ivana Mažuranića b.b., Darda",
    map,
    "Darda, Ivana Mažuranića b.b., Darda",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.5888556511,
    17.2264113901,
    "Daruvar",
    "Kolodvorska 5, Daruvar",
    map,
    "Daruvar, Kolodvorska 5, Daruvar",
    "Train station, <br />Working hours: mon - fri                  05.50 -13.20    "
  );
  addMarker(
    45.6894670459,
    16.4599625271,
    "Deanovec",
    "Kolodvorska b.b., Deanovec",
    map,
    "Deanovec, Kolodvorska b.b., Deanovec",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.3915011564,
    14.7974259247,
    "Delnice",
    "Željezničarska ulica b.b., Delnice",
    map,
    "Delnice, Željezničarska ulica b.b., Delnice",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    46.3678614875,
    16.6451042879,
    "Donji Kraljevec",
    "Kolodvorska 43, Donji Kraljevec",
    map,
    "Donji Kraljevec, Kolodvorska 43, Donji Kraljevec",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.5694188445,
    15.6093394054,
    "Draganići",
    "Mrzljaki 72, Draganići",
    map,
    "Draganići, Mrzljaki 72, Draganići",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    44.9198304655,
    18.8589120064,
    "Drenovci",
    "Stari Drenovci b.b.",
    map,
    "Drenovci, Stari Drenovci b.b.",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.2672074303,
    14.6913051834,
    "Drivenik",
    "Drivenik 1, Drivenik",
    map,
    "Drivenik, Drivenik 1, Drivenik",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    43.8637257472,
    16.1818519805,
    "Drniš",
    "Put Badnja b.b., Drniš",
    map,
    "Drniš, Put Badnja b.b., Drniš",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.4489564881,
    15.4985853769,
    "Duga Resa",
    "Trg sv. Jurja 18, Duga Resa",
    map,
    "Duga Resa, Trg sv. Jurja 18, Duga Resa",
    "Train station, <br />Working hours: mon - fri             4.55 - 12.25"
  );
  addMarker(
    45.8013583056,
    16.2347324102,
    "Dugo Selo",
    "Matije Gupca 4, Dugo Selo",
    map,
    "Dugo Selo, Matije Gupca 4, Dugo Selo",
    "Train station, <br />Working hours: mon - sat            05.15 - 20.45 sun and blagdan     06.20 - 20.15            "
  );
  addMarker(
    45.3136468325,
    18.421791942,
    "Đakovo",
    "Park pobjede 3, Đakovo",
    map,
    "Đakovo, Park pobjede 3, Đakovo",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.6643288236,
    17.4312638855,
    "Đulovac",
    "",
    map,
    "Đulovac",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.5374044048,
    18.0380619772,
    "Đurđenovac",
    "Kolodvorska b.b., Đurđenovac",
    map,
    "Đurđenovac, Kolodvorska b.b., Đurđenovac",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    46.0273446232,
    17.0652308,
    "Đurđevac",
    "Kolodvorska 21, Đurđevac",
    map,
    "Đurđevac, Kolodvorska 21, Đurđevac",
    "Train station, <br />Working hours: prodaja u  vlaku"
  );
  addMarker(
    46.1937818519,
    15.8431762668,
    "Đurmanec",
    "Đurmanec 46",
    map,
    "Đurmanec, Đurmanec 46",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.5073862033,
    19.0491230008,
    "Erdut",
    "Kolodvorska 9, Erdut",
    map,
    "Erdut, Kolodvorska 9, Erdut",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.3003485956,
    14.7173638082,
    "Fužine",
    "Kolodvorska 9, Fužine",
    map,
    "Fužine, Kolodvorska 9, Fužine",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.1734844312,
    18.1859733697,
    "Garčin",
    "Zrinskog 5, Garčin ",
    map,
    "Garčin, Zrinskog 5, Garčin ",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.3434140617,
    15.3765261432,
    "Generalski Stol",
    "Generalski Stol 45, Generalski Stol",
    map,
    "Generalski Stol, Generalski Stol 45, Generalski Stol",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    46.173741433,
    15.9835027463,
    "Golubovec",
    "Novi Golubovec b.b.",
    map,
    "Golubovec, Novi Golubovec b.b.",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.342814329,
    15.1281227439,
    "Gomirje",
    "Stojanovića Jove Brice 20, Vrbovsko",
    map,
    "Gomirje, Stojanovića Jove Brice 20, Vrbovsko",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.9832738312,
    16.0041448595,
    "Gornja Stubica",
    "Matije Gupca 12, Gornja Stubica",
    map,
    "Gornja Stubica, Matije Gupca 12, Gornja Stubica",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.2789739992,
    15.3074711624,
    "Gornje Dubrave",
    "Gornje Dubrave 2, Ogulin",
    map,
    "Gornje Dubrave, Gornje Dubrave 2, Ogulin",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    44.5361701871,
    15.3935933752,
    "Gospić",
    "Bilajska 165, Gospić",
    map,
    "Gospić, Bilajska 165, Gospić",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    44.3003606464,
    15.8221481828,
    "Gračac",
    "Željeznička b.b., Gračac",
    map,
    "Gračac, Željeznička b.b., Gračac",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.5305665295,
    16.2930349102,
    "Greda",
    "Grada b.b., Stupno",
    map,
    "Greda, Grada b.b., Stupno",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.7137207163,
    15.8174557503,
    "Horvati",
    "Horvati 181, Rakov Potok",
    map,
    "Horvati, Horvati 181, Rakov Potok",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.3114520975,
    16.5465365722,
    "Hrastovac",
    "",
    map,
    "Hrastovac",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.2216705276,
    16.8061753082,
    "Hrvatska Dubica",
    "Kolodvorska b.b., Hrvatska Dubica",
    map,
    "Hrvatska Dubica, Kolodvorska b.b., Hrvatska Dubica",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.7444224695,
    15.8920997848,
    "Hrvatski Leskovac",
    "15. travnja 1944.b.b., Hrvatski Leskovac",
    map,
    "Hrvatski Leskovac, 15. travnja 1944.b.b., Hrvatski Leskovac",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    46.2314066573,
    16.1244049077,
    "Ivanec",
    "Kolodvorska 5, Ivanec",
    map,
    "Ivanec, Kolodvorska 5, Ivanec",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.7073500225,
    16.3977812014,
    "Ivanić Grad",
    "Kolodvorska 2, Ivanić Grad",
    map,
    "Ivanić Grad, Kolodvorska 2, Ivanić Grad",
    "Train station, <br />Working hours: 05.10 - 19.55 "
  );
  addMarker(
    45.2784122464,
    18.6674795808,
    "Ivankovo",
    "",
    map,
    "Ivankovo",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    46.268477908,
    16.4717226132,
    "Jalžabet",
    "Jalžabet 86, Jalžabet",
    map,
    "Jalžabet, Jalžabet 86, Jalžabet",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.6572023616,
    15.647834497,
    "Jastrebarsko",
    "Nikole Tesle b.b., Jastrebarsko ",
    map,
    "Jastrebarsko, Nikole Tesle b.b., Jastrebarsko ",
    "Train station, <br />Working hours: mon - fri             05.20 - 12.50"
  );
  addMarker(
    45.1973621588,
    15.2890915114,
    "Josipdol",
    "Kolodvorska 8 Josipdol",
    map,
    "Josipdol, Kolodvorska 8 Josipdol",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.5741580826,
    18.5900606196,
    "Josipovac",
    "Kolodvorska b.b., Josipovac",
    map,
    "Josipovac, Kolodvorska b.b., Josipovac",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.6453285875,
    15.4084391475,
    "Kamanje",
    "Kamanje 1c, Kamanje",
    map,
    "Kamanje, Kamanje 1c, Kamanje",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.1171465397,
    13.8367383224,
    "Kanfanar",
    "Jurija Dobrile 10, Kanfanar",
    map,
    "Kanfanar, Jurija Dobrile 10, Kanfanar",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.500120524,
    15.5449150841,
    "Karlovac",
    "Vilima Reinera 3, Karlovac ",
    map,
    "Karlovac, Vilima Reinera 3, Karlovac ",
    "Train station, <br />Working hours: mon - fri                  5.00 - 19.40, sat 6.10 - 17.40, sun and blagdan 13.55 - 21.25  "
  );
  addMarker(
    43.5673880121,
    16.3448138294,
    "Kaštel Stari",
    "Tolanac 31, Kaštel Stari",
    map,
    "Kaštel Stari, Tolanac 31, Kaštel Stari",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    43.5489192081,
    16.4305239192,
    "Kaštel Sućurac",
    "Put Glavice 30, Kaštel Sućurac",
    map,
    "Kaštel Sućurac, Put Glavice 30, Kaštel Sućurac",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    43.9876084543,
    15.9575582306,
    "Kistanje",
    "Kistanje b.b., Kistanje",
    map,
    "Kistanje, Kistanje b.b., Kistanje",
    "Train station, <br />Buy ticket on the bus"
  );
  addMarker(
    45.9814445778,
    17.1392721981,
    "Kloštar",
    "Kolodvorska 29, Kloštar Podravski",
    map,
    "Kloštar, Kolodvorska 29, Kloštar Podravski",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    44.0366469582,
    16.1983566454,
    "Knin",
    "Trg A. Starčevića 4, Knin",
    map,
    "Knin, Trg A. Starčevića 4, Knin",
    "Train station, <br />Working hours: mon - fri               7.30 - 15.00                       "
  );
  addMarker(
    46.0505453752,
    16.1789635292,
    "Konjšćina",
    "Kolodvorska 3, Konjščina",
    map,
    "Konjšćina, Kolodvorska 3, Konjščina",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    46.1654838664,
    16.8168149566,
    "Koprivnica",
    "Kolodvorska 10, Koprivnica",
    map,
    "Koprivnica, Kolodvorska 10, Koprivnica",
    "Train station, <br />Working hours: 04.40 - 20.40              "
  );
  addMarker(
    43.9497185207,
    16.2096243023,
    "Kosovo",
    "",
    map,
    "Kosovo",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.5415174467,
    18.2953762328,
    "Koška",
    "Braće Radić b.b., Koška",
    map,
    "Koška, Braće Radić b.b., Koška",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    46.3537588492,
    16.808433699,
    "Kotoriba",
    "Kolodvorska b.b., Kotoriba",
    map,
    "Kotoriba, Kolodvorska b.b., Kotoriba",
    "Train station, <br />Working hours: mon - fri             05.20 - 12.50"
  );
  addMarker(
    46.1594733404,
    15.8721073781,
    "Krapina",
    "Frana Galovića 8, Krapina",
    map,
    "Krapina, Frana Galovića 8, Krapina",
    "Train station, <br />Working hours: mon - fri             05.20 - 12.50    "
  );
  addMarker(
    46.0062652062,
    16.5434616759,
    "Križevci",
    "Kralja Tomislava 69, Križevci",
    map,
    "Križevci, Kralja Tomislava 69, Križevci",
    "Train station, <br />Working hours: 05.00 - 20.20           "
  );
  addMarker(
    45.2340421079,
    15.3333368349,
    "Kukača",
    "Kamenica Skradnička bb, Tounj",
    map,
    "Kukača, Kamenica Skradnička bb, Tounj",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.4748505749,
    16.7744892249,
    "Kutina",
    "Metanska 6, Kutina",
    map,
    "Kutina, Metanska 6, Kutina",
    "Train station, <br />Working hours: mon-fri 4.50-19.50, sun-blagdan 13.15-20.45"
  );
  addMarker(
    43.5837773092,
    16.2331330771,
    "Labin Dalmatinski",
    "",
    map,
    "Labin Dalmatinski",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.5844552009,
    16.2187551207,
    "Lekenik",
    "Kolodvorska 25, Lekenik",
    map,
    "Lekenik, Kolodvorska 25, Lekenik",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    46.0979276617,
    16.6850278438,
    "Lepavina",
    "Kolodvorska b.b., Sokolovac",
    map,
    "Lepavina, Kolodvorska b.b., Sokolovac",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    46.2131120765,
    16.0434605652,
    "Lepoglava",
    "Kolodvorska b.b., Lepoglava",
    map,
    "Lepoglava, Kolodvorska b.b., Lepoglava",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    44.7731550267,
    15.3586151169,
    "Ličko Lešće",
    "",
    map,
    "Ličko Lešće",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.4095693642,
    17.1599743992,
    "Lipik",
    "Marije Terezije b.b., Lipik",
    map,
    "Lipik, Marije Terezije b.b., Lipik",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.3867794884,
    16.8823781469,
    "Lipovljani",
    "Kolodvorska b.b., Lipovljani",
    map,
    "Lipovljani, Kolodvorska b.b., Lipovljani",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.3566454524,
    14.7722343188,
    "Lokve",
    "",
    map,
    "Lokve",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    44.3760504807,
    15.6638102496,
    "Lovinac",
    "Lovinac b.b., Lovinac",
    map,
    "Lovinac, Lovinac b.b., Lovinac",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    46.2562603471,
    16.6120212076,
    "Ludbreg",
    "Kolodvorska b.b., Ludbreg",
    map,
    "Ludbreg, Kolodvorska b.b., Ludbreg",
    "Train station, <br />Working hours: mon - fri             05.20 - 12.50 "
  );
  addMarker(
    45.6005568378,
    16.5696341146,
    "Ludina",
    "Kolodvorska b.b., Ludina",
    map,
    "Ludina, Kolodvorska b.b., Ludina",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.9536898809,
    15.8211034174,
    "Luka",
    "Polukružna b.b., Luka",
    map,
    "Luka, Polukružna b.b., Luka",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.355538928,
    14.1054264621,
    "Lupoglav",
    "Lupoglav 12, Lupoglav ",
    map,
    "Lupoglav, Lupoglav 12, Lupoglav ",
    "Train station, <br />Working hours: Buy ticket on the train/autobusu"
  );
  addMarker(
    45.5530021896,
    15.5313248522,
    "Mahično",
    "",
    map,
    "Mahično",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.2573559332,
    16.5279788337,
    "Majur",
    "",
    map,
    "Majur",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    46.3772423309,
    16.5348479978,
    "Mala Subotica",
    "Ul. Vinka Žganca b.b., Mala Subotica",
    map,
    "Mala Subotica, Ul. Vinka Žganca b.b., Mala Subotica",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.6425249782,
    17.2960453013,
    "Maslenjača",
    "",
    map,
    "Maslenjača",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.3065563379,
    14.595743086,
    "Meja",
    "Meja Gaj 28, Praputnjak",
    map,
    "Meja, Meja Gaj 28, Praputnjak",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    43.0566839477,
    17.6468796194,
    "Metković",
    "Andrije Hebranga 32, Metković",
    map,
    "Metković, Andrije Hebranga 32, Metković",
    "Train station, <br />Working hours: HŽPP ne pruža uslugu"
  );
  addMarker(
    45.4230051556,
    15.0161696611,
    "Moravice",
    "Ulica žrtava fašizma 12, Moravice",
    map,
    "Moravice, Ulica žrtava fašizma 12, Moravice",
    "Train station, <br />Working hours: mon - fri             5.40 - 13.10   "
  );
  addMarker(
    45.5140189054,
    16.689202529,
    "Moslavačka Gračenica",
    "Kolodvorska b.b., Moslovačka Gračenica",
    map,
    "Moslavačka Gračenica, Kolodvorska b.b., Moslovačka Gračenica",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.4664500776,
    15.5359171467,
    "Mrzlo Polje",
    "Riječka 51, Karlovac",
    map,
    "Mrzlo Polje, Riječka 51, Karlovac",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    46.1230936903,
    16.7604719379,
    "Mučna Reka",
    "Kolodvorska 38, Mučna Reka",
    map,
    "Mučna Reka, Kolodvorska 38, Mučna Reka",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.496495368,
    18.1243664001,
    "Našice",
    "Kolodvorska 4, Našice",
    map,
    "Našice, Kolodvorska 4, Našice",
    "Train station, <br />Working hours: mon - fri  4.40 - 12.10        "
  );
  addMarker(
    45.2533584422,
    17.3792715066,
    "Nova Gradiška",
    "Kolodvorska 5, Nova Gradiška ",
    map,
    "Nova Gradiška, Kolodvorska 5, Nova Gradiška ",
    "Train station, <br />Working hours: mon - fri 05.00 - 16.30, sat/sun and blagdan 09.30 - 19.00                               "
  );
  addMarker(
    45.1898264923,
    17.6502620684,
    "Nova Kapela-Batrina",
    "Kralja D. Zvonimira 19, Nova Kapela ",
    map,
    "Nova Kapela-Batrina, Kralja D. Zvonimira 19, Nova Kapela ",
    "Train station, <br />Working hours: mon - fri             05.30 - 13.00               "
  );
  addMarker(
    45.879684399,
    15.8131122299,
    "Novi Dvori",
    "Industrijska 16, Novi Dvori, Zaprešić",
    map,
    "Novi Dvori, Industrijska 16, Novi Dvori, Zaprešić",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    46.1769078653,
    16.338333136,
    "Novi Marof",
    "Varaždinska 49, Novi Marof",
    map,
    "Novi Marof, Varaždinska 49, Novi Marof",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.6492678335,
    16.5299033689,
    "Novoselec",
    "Kolodvorska b.b., Novoselec ",
    map,
    "Novoselec, Kolodvorska b.b., Novoselec ",
    "Train station, <br />Working hours: mon - sat            05.30 - 17.00, sun and blagdan 14.05 - 21.35 "
  );
  addMarker(
    45.3268875768,
    16.9767282712,
    "Novska",
    "Kolodvorska b.b., Novska ",
    map,
    "Novska, Kolodvorska b.b., Novska ",
    "Train station, <br />Working hours: mon - fri 4.25 - 19.40, sun and blagdan 12.45 - 20.15         "
  );
  addMarker(
    45.266043194,
    15.2315249436,
    "Ogulin",
    "Trg F. Tuđmana 1, Ogulin",
    map,
    "Ogulin, Trg F. Tuđmana 1, Ogulin",
    "Train station, <br />Working hours: mon - fri               04.50 - 16.20 sat                      06.00 - 16.30 sun and blagdan     13.10 - 20.40                                "
  );
  addMarker(
    45.2960355035,
    15.1781838115,
    "Ogulinski Hreljin",
    "Hreljin Ogulinski 25, Ogulin",
    map,
    "Ogulinski Hreljin, Hreljin Ogulinski 25, Ogulin",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.2523615675,
    17.2062904278,
    "Okučani",
    "Fra Luke Ibrišimovića 10, Okučani ",
    map,
    "Okučani, Fra Luke Ibrišimovića 10, Okučani ",
    "Train station, <br />Working hours: mon - fri             06.10 - 13.40  (iznimno from 17.1.-7.2.2022. blagajna ne radi)"
  );
  addMarker(
    45.3645935927,
    14.3210136895,
    "Opatija-Matulji",
    "Vladimira Nazora 1, Matulji",
    map,
    "Opatija-Matulji, Vladimira Nazora 1, Matulji",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    43.0202894573,
    17.56400797,
    "Opuzen",
    "",
    map,
    "Opuzen",
    "Train station, <br />Working hours: HŽPP ne pruža uslugu"
  );
  addMarker(
    45.1612629492,
    17.7536739114,
    "Oriovac",
    "M. Gabrića b.b., Orlovac ",
    map,
    "Oriovac, M. Gabrića b.b., Orlovac ",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.5527370155,
    18.6834082547,
    "Osijek",
    "Trg Lavoslava Ružičke 2, Osijek ",
    map,
    "Osijek, Trg Lavoslava Ružičke 2, Osijek ",
    "Train station, <br />Working hours: 07.00 - 20.05                              "
  );
  addMarker(
    45.5522315055,
    18.7212676508,
    "Osijek Donji grad",
    "Trg J. Runjanina 1, Osijek",
    map,
    "Osijek Donji grad, Trg J. Runjanina 1, Osijek",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.234389955,
    15.2962805733,
    "Oštarije",
    "Belaj 177, Josipdol",
    map,
    "Oštarije, Belaj 177, Josipdol",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.1456359114,
    18.8719050573,
    "Otok",
    "Kolodvorska 3, Otok",
    map,
    "Otok, Kolodvorska 3, Otok",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.6119886746,
    15.4823463132,
    "Ozalj",
    "Kolodvorska 9, Ozalj",
    map,
    "Ozalj, Kolodvorska 9, Ozalj",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.2397665338,
    13.9461517797,
    "Pazin",
    "Od stareh kostanji 3b, Pazin",
    map,
    "Pazin, Od stareh kostanji 3b, Pazin",
    "Train station, <br />Working hours: mon - fri             05.40 - 13.10          "
  );
  addMarker(
    43.6755816098,
    16.1177946074,
    "Perković",
    "Sitno Donje ",
    map,
    "Perković, Sitno Donje ",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    44.6480392155,
    15.3887981635,
    "Perušić",
    "Kolodvorska b.b., Perušić",
    map,
    "Perušić, Kolodvorska b.b., Perušić",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.9425676863,
    17.2295479022,
    "Pitomača",
    "Vinogradska 37, Pitomača",
    map,
    "Pitomača, Vinogradska 37, Pitomača",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.2834653853,
    14.6291002186,
    "Plase",
    "",
    map,
    "Plase",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.0783340603,
    15.3680749673,
    "Plaški",
    "Kralja Tomislava b.b., Plaški",
    map,
    "Plaški, Kralja Tomislava b.b., Plaški",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.2867976163,
    17.8098557406,
    "Pleternica",
    "V. Nazora 11, 34 310 Pleternica ",
    map,
    "Pleternica, V. Nazora 11, 34 310 Pleternica ",
    "Train station, <br />Working hours: mon - fri              06.10 - 13.40 (iznimno from 17.12.2020. blagajna ne radi)"
  );
  addMarker(
    45.5592216191,
    16.6235216888,
    "Popovača",
    "Kolodvorska 86, Popovača",
    map,
    "Popovača, Kolodvorska 86, Popovača",
    "Train station, <br />Working hours: mon - sat            05.20 - 16.50 sun and blagdan      13.50 - 21.20 "
  );
  addMarker(
    45.3375042221,
    17.683260824,
    "Požega",
    "F.Cirakija 5, Požega ",
    map,
    "Požega, F.Cirakija 5, Požega ",
    "Train station, <br />Working hours: mon - sat            07.10 - 18.10 sun and blagdan      12.10 - 19.40"
  );
  addMarker(
    43.6366902827,
    16.1588202602,
    "Primorski Dolac",
    "",
    map,
    "Primorski Dolac",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.1983598622,
    18.8484507785,
    "Privlaka",
    "Kolodvorska b.b., Privlaka",
    map,
    "Privlaka, Kolodvorska b.b., Privlaka",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    44.8797722933,
    13.8470969327,
    "Pula",
    "Kolodvorska 5, Pula",
    map,
    "Pula, Kolodvorska 5, Pula",
    "Train station, <br />Working hours: from 12.12.2021.-15.4.2022. and from 26.9.-10.12.2022. mon - fri  08.15 - 15.45, from 16.4.-25.9.2022. svakodnevno 8.40-18.10                     "
  );
  addMarker(
    46.2058966856,
    16.720662492,
    "Rasinja",
    "Rasinja b.b.",
    map,
    "Rasinja, Rasinja b.b.",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    43.7054132878,
    15.923201031,
    "Ražine",
    "Hrvatskih rodoljuba 2, Ražine",
    map,
    "Ražine, Hrvatskih rodoljuba 2, Ražine",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.3300874969,
    14.4302604034,
    "Rijeka",
    "Trg kralja Tomislava 1, Rijeka",
    map,
    "Rijeka, Trg kralja Tomislava 1, Rijeka",
    "Train station, <br />Working hours: 06.40 - 20.40                                          "
  );
  addMarker(
    45.4003666843,
    14.038876151,
    "Roč",
    "",
    map,
    "Roč",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    43.0450935156,
    17.478061729,
    "Rogotin",
    "",
    map,
    "Rogotin",
    "Train station, <br />Working hours: HŽPP ne pruža uslugu"
  );
  addMarker(
    45.52083517,
    18.834368494,
    "Sarvaš",
    "",
    map,
    "Sarvaš",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.8720767976,
    15.7399963722,
    "Savski Marof",
    "A. Kovačića, Prigorje Brdovečko (Savski Marof)",
    map,
    "Savski Marof, A. Kovačića, Prigorje Brdovečko (Savski Marof)",
    "Train station, <br />Working hours: mon - sat             05.40 - 17.10          sun and blagdan      07.30 - 15.00 "
  );
  addMarker(
    45.8248451177,
    16.109907637,
    "Sesvete",
    "Ninska b.b., Sesvete",
    map,
    "Sesvete, Ninska b.b., Sesvete",
    "Train station, <br />Working hours: mon - sat                05.20 - 19.50 sun and blagdan     06.20 - 18.30"
  );
  addMarker(
    45.1809170789,
    17.9045374929,
    "Sibinj",
    "Braće Radića 107, Sibinj ",
    map,
    "Sibinj, Braće Radića 107, Sibinj ",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.529923946,
    17.2409793668,
    "Sirač",
    "Kolodvorska 7, Sirač",
    map,
    "Sirač, Kolodvorska 7, Sirač",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.4921177533,
    16.3734442674,
    "Sisak",
    "Trg Republike 1, Sisak",
    map,
    "Sisak, Trg Republike 1, Sisak",
    "Train station, <br />Working hours: 05.10 - 20.00                  "
  );
  addMarker(
    45.458077153,
    16.3905162494,
    "Sisak Caprag",
    "Božidara Adžije b.b.,Sisak Caprag",
    map,
    "Sisak Caprag, Božidara Adžije b.b.,Sisak Caprag",
    "Train station, <br />Working hours: mon - sat 05.15 - 16.45, sun and blagdan 12.00 - 19.30         "
  );
  addMarker(
    45.4253963086,
    14.902817548,
    "Skrad",
    "I.Gorana Kovačića 22, Skrad",
    map,
    "Skrad, I.Gorana Kovačića 22, Skrad",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.7055719172,
    17.7062646458,
    "Slatina",
    "Kolodvorska b.b.,Slatina",
    map,
    "Slatina, Kolodvorska b.b.,Slatina",
    "Train station, <br />Working hours: mon - fri, sun and blagdan               06.30 - 18.00            sat 10.30 - 18.00 (iznimno from 7.10.2021. blagajna radi mon-fri 7.20-14.50)"
  );
  addMarker(
    45.1636245438,
    18.0111812712,
    "Slavonski Brod",
    "Trg Hrvatskog proljeća 4, Slavonski Brod",
    map,
    "Slavonski Brod, Trg Hrvatskog proljeća 4, Slavonski Brod",
    "Train station, <br />Working hours: 05.45 - 20.45                                 "
  );
  addMarker(
    43.5371670288,
    16.4709656749,
    "Solin",
    "Draškovićeva b.b., Solin",
    map,
    "Solin, Draškovićeva b.b., Solin",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.0412436382,
    18.9040967516,
    "Spačva",
    "",
    map,
    "Spačva",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    43.5047301042,
    16.4429578016,
    "Split",
    "Domagojeva obala 9, Split",
    map,
    "Split, Domagojeva obala 9, Split",
    "Train station, <br />Working hours: 06.20 - 21.50 (iznimno from 23.9.2021. 6.10-17.10)"
  );
  addMarker(
    43.5221211067,
    16.4552617291,
    "Split Predgrađe",
    "Hercegovačka b.b., Split",
    map,
    "Split Predgrađe, Hercegovačka b.b., Split",
    "Train station, <br />Working hours: mon - fri             07.05 - 14.35   (iznimno from 8.2.2022. mon-fri  6.10-13.40)                      "
  );
  addMarker(
    45.266579259,
    18.5396620803,
    "Stari Mikanovci",
    "",
    map,
    "Stari Mikanovci",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.222117259,
    17.5259230987,
    "Staro Petrovo Selo",
    "Kolodvorska 2, Staro Petrovo Selo",
    map,
    "Staro Petrovo Selo, Kolodvorska 2, Staro Petrovo Selo",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.2272836842,
    18.4136503026,
    "Strizivojna-Vrpolje",
    "Kolodvorska b.b., Strizivojna",
    map,
    "Strizivojna-Vrpolje, Kolodvorska b.b., Strizivojna",
    "Train station, <br />Working hours: mon - sat            05.40 - 17.10            sun and blagdan                                         11.40-19.10 (iznimno 21. and 22.2.2022. blagajna radi u vremenu from 5.40-13.10)"
  );
  addMarker(
    45.7940430278,
    17.4868844257,
    "Suhopolje",
    "Kolodvorska 13, Suhopolje",
    map,
    "Suhopolje, Kolodvorska 13, Suhopolje",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.355506806,
    16.5504937205,
    "Sunja",
    "Ulica branitelja b.b., Sunja",
    map,
    "Sunja, Ulica branitelja b.b., Sunja",
    "Train station, <br />Working hours: mon - fri             05.40 - 13.10      "
  );
  addMarker(
    45.3208285277,
    14.4637778478,
    "Sušak-Pećine",
    "Danijela Godine 3, Rijeka",
    map,
    "Sušak-Pećine, Danijela Godine 3, Rijeka",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    46.0768549171,
    15.9032014125,
    "Sveti Križ Začretje",
    "Kolodvorska 2, Sveti Križ Začretje",
    map,
    "Sveti Križ Začretje, Kolodvorska 2, Sveti Križ Začretje",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.1850864141,
    13.8672206179,
    "Sveti Petar u šumi",
    "Dajčići 13, Sveti Petar u Šumi",
    map,
    "Sveti Petar u šumi, Dajčići 13, Sveti Petar u Šumi",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.4766495695,
    14.2443824579,
    "Šapjane",
    "Šapjane 33, Šapjane",
    map,
    "Šapjane, Šapjane 33, Šapjane",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    43.729996119,
    15.8979455676,
    "Šibenik",
    "Fra Jeronima Milete 24, Šibenik",
    map,
    "Šibenik, Fra Jeronima Milete 24, Šibenik",
    "Train station, <br />Working hours: mon - fri             07.05 - 14.35  (iznimno 11.1.2022. blagajna ne radi)"
  );
  addMarker(
    44.0872734939,
    15.4557243737,
    "Škabrnje",
    "Gojka Šuška 50, Škabrnja",
    map,
    "Škabrnje, Gojka Šuška 50, Škabrnja",
    "Train station, <br />Buy ticket on the bus"
  );
  addMarker(
    45.3245358259,
    14.5390171732,
    "Škrljevo",
    "",
    map,
    "Škrljevo",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.8458456193,
    17.2987682832,
    "Špišić Bukovica",
    "Kolodvorska b.b., Špišić Bukovica",
    map,
    "Špišić Bukovica, Kolodvorska b.b., Špišić Bukovica",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.1554771736,
    19.1485553951,
    "Tovarnik",
    "",
    map,
    "Tovarnik",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    46.2540486729,
    16.3587592991,
    "Turčin",
    "Kolodvorska 5a, Turčin",
    map,
    "Turčin, Kolodvorska 5a, Turčin",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.6477243656,
    16.1312918015,
    "Turopolje",
    "Kolodvorska b.b., Buševec ",
    map,
    "Turopolje, Kolodvorska b.b., Buševec ",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    43.7414823347,
    16.1814945967,
    "Unešić",
    "Kod crkve b.b., Unešić",
    map,
    "Unešić, Kod crkve b.b., Unešić",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    46.3056022735,
    16.346725625,
    "Varaždin",
    "Supilova 1, Varaždin",
    map,
    "Varaždin, Supilova 1, Varaždin",
    "Train station, <br />Working hours: mon - fri 05.10 - 19.40, sat 05.10 - 14.40 , sun and blagdan 12.10 - 19.40                     "
  );
  addMarker(
    45.4389359699,
    17.6654643586,
    "Velika",
    "F. Tuđmana 19, Velika ",
    map,
    "Velika, F. Tuđmana 19, Velika ",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.7085965002,
    16.0469387306,
    "Velika Gorica",
    "Kolodvorska 151, Velika Gorica",
    map,
    "Velika Gorica, Kolodvorska 151, Velika Gorica",
    "Train station, <br />Working hours: mon - fri 05.50 - 13.20 "
  );
  addMarker(
    45.994659345,
    15.8468804468,
    "Veliko Trgovišće",
    "Kolodvorska 2, Veliko Trgovišće",
    map,
    "Veliko Trgovišće, Kolodvorska 2, Veliko Trgovišće",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.300398403,
    18.8028085306,
    "Vinkovci",
    "Trg Kralja Tomislava 3, Vinkovci",
    map,
    "Vinkovci, Trg Kralja Tomislava 3, Vinkovci",
    "Train station, <br />Working hours: mon - sat 05.20 - 19.40, sun and blagdan 08.10-19.40"
  );
  addMarker(
    46.0685571682,
    17.0044631744,
    "Virje",
    "Kolodvorska 65, Virje",
    map,
    "Virje, Kolodvorska 65, Virje",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.8251167678,
    17.3985939595,
    "Virovitica",
    "Stjepana Radića 104, Virovitica",
    map,
    "Virovitica, Stjepana Radića 104, Virovitica",
    "Train station, <br />Working hours: mon - fri  05.40 - 19.40, sat 05.40 - 13.10, sun and blagdan 12.10 - 19.40"
  );
  addMarker(
    45.4754766706,
    18.5586672168,
    "Vladislavci",
    "Velika Palača 5, Vladislavci",
    map,
    "Vladislavci, Velika Palača 5, Vladislavci",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    44.9667073055,
    13.8560733427,
    "Vodnjan",
    "Željeznička 30, Vodnjan",
    map,
    "Vodnjan, Željeznička 30, Vodnjan",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.2024132147,
    16.4861284609,
    "Volinja",
    "Volinja b.b., Volinja",
    map,
    "Volinja, Volinja b.b., Volinja",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.8736124604,
    16.4103867517,
    "Vrbovec",
    "Kolodvorska 124, Vrbovec",
    map,
    "Vrbovec, Kolodvorska 124, Vrbovec",
    "Train station, <br />Working hours: 05.20 - 20.40                      "
  );
  addMarker(
    45.3726775384,
    15.0714847258,
    "Vrbovsko",
    "Željeznička 7, Vrbovsko",
    map,
    "Vrbovsko, Željeznička 7, Vrbovsko",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    44.8489088295,
    15.4270664727,
    "Vrhovine",
    "Željeznička 17, Vrhovine",
    map,
    "Vrhovine, Željeznička 17, Vrhovine",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.3624196834,
    18.9868485492,
    "Vukovar",
    "",
    map,
    "Vukovar",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.3734192625,
    18.9552340439,
    "Vukovar-Borovo naselje",
    "Kolodvorska 55, Borovo",
    map,
    "Vukovar-Borovo naselje, Kolodvorska 55, Borovo",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    46.0239188531,
    15.9020859007,
    "Zabok",
    "Trg Ksavera Šandora Đalskog 3, Zabok",
    map,
    "Zabok, Trg Ksavera Šandora Đalskog 3, Zabok",
    "Train station, <br />Working hours: 04.40 - 21.25"
  );
  addMarker(
    44.1062622862,
    15.2422904246,
    "Zadar",
    "Ante Starčevića 3, Zadar",
    map,
    "Zadar, Ante Starčevića 3, Zadar",
    "Train station, <br />Buy ticket on the bus"
  );
  addMarker(
    45.8044511799,
    15.9788116194,
    "Zagreb Glavni kolodvor",
    "Trga kralja Tomislava 12, Zagreb ",
    map,
    "Zagreb Glavni kolodvor, Trga kralja Tomislava 12, Zagreb ",
    "Train station, <br />Working hours: 05.30 - 22.00               "
  );
  addMarker(
    45.7601347072,
    15.9752276405,
    "Zagreb Klara",
    "Horvatova 5, Zagreb",
    map,
    "Zagreb Klara, Horvatova 5, Zagreb",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.8091245968,
    15.9542125497,
    "Zagreb Zapadni Kolodvor",
    "Trg Francuske Republike 13 b,  Zagreb",
    map,
    "Zagreb Zapadni Kolodvor, Trg Francuske Republike 13 b,  Zagreb",
    "Train station, <br />Working hours: mon - sat 5.40 - 17.10, sun and blagdan 07.30 - 15.00"
  );
  addMarker(
    45.3980282531,
    14.8577481373,
    "Zalesina",
    "",
    map,
    "Zalesina",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.8444036946,
    15.8131100427,
    "Zaprešić",
    "Trg žrtava 1903. 2, Zaprešić",
    map,
    "Zaprešić, Trg žrtava 1903. 2, Zaprešić",
    "Train station, <br />Working hours: mon - sat                      05.40 - 17.10 sun and blagdan      07.30 - 15.00 "
  );
  addMarker(
    45.5685962207,
    17.929177415,
    "Zdenci-Orahovica",
    "Kralja Tomislava 3, Zdenci ",
    map,
    "Zdenci-Orahovica, Kralja Tomislava 3, Zdenci ",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.6836991878,
    15.7500537288,
    "Zdenčina",
    "Matije Gupca 2, Donja Zdenčina",
    map,
    "Zdenčina, Matije Gupca 2, Donja Zdenčina",
    "Train station, <br />Working hours: mon - fri             05.30 - 13.00 "
  );
  addMarker(
    46.0441446078,
    16.0813273553,
    "Zlatar Bistrica",
    "Kolodvorska 7, Zlatar Bistrica",
    map,
    "Zlatar Bistrica, Kolodvorska 7, Zlatar Bistrica",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.3957528029,
    15.430957368,
    "Zvečaj",
    "Zvečaj 7, Zvečaj",
    map,
    "Zvečaj, Zvečaj 7, Zvečaj",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    43.8318033853,
    16.1457808994,
    "Žitnić",
    "",
    map,
    "Žitnić",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    45.0821946297,
    18.6964363206,
    "Županja",
    "Strossmayerova 64, Županja",
    map,
    "Županja, Strossmayerova 64, Županja",
    "Train station, <br />Buy ticket on the train"
  );
  addMarker(
    46.1486641229,
    16.2626571277,
    "Podrute",
    "Kamena Gorica bb",
    map,
    "Podrute, Kamena Gorica bb",
    "Train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.5170201171,
    18.6720632299,
    "Brijest",
    "",
    map,
    "Brijest",
    "Train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.982948514,
    15.966021088,
    "Donja Stubica",
    "Kolodvorska 1, Donja Stubica",
    map,
    "Donja Stubica, Kolodvorska 1, Donja Stubica",
    "Train stop, <br />Working hours: mon-fri 05.40-14.00"
  );
  addMarker(
    45.2253328356,
    13.8943926303,
    "Heki",
    "",
    map,
    "Heki",
    "Train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.2761497927,
    16.9106168451,
    "Jasenovac",
    "",
    map,
    "Jasenovac",
    "Train stop, <br />Buy ticket on the train"
  );
  addMarker(
    46.5082887642,
    16.4464180298,
    "Mursko Središće",
    "Kolodvorska 5, Mursko Središće",
    map,
    "Mursko Središće, Kolodvorska 5, Mursko Središće",
    "Train stop, <br />Buy ticket on the train"
  );
  addMarker(
    46.0015189683,
    15.9289342379,
    "Oroslavje",
    "",
    map,
    "Oroslavje",
    "Train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.4473208501,
    17.1954973996,
    "Pakrac",
    "",
    map,
    "Pakrac",
    "Train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.9450277994,
    16.6209571241,
    "Sveti Ivan Žabno",
    "",
    map,
    "Sveti Ivan Žabno",
    "Train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.7800882208,
    17.5255854441,
    "Pčelić",
    "",
    map,
    "Pčelić",
    "Train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.8208442451,
    16.0636177663,
    "Čulinec",
    "Čulinečka 77, Čulinec, Zagreb",
    map,
    "Čulinec, Čulinečka 77, Čulinec, Zagreb",
    "Train stop, <br />Working hours: mon - fri 5.40 - 17.10 sun and blagdan      07.30 - 15.00 (iznimno from 25.1.2022. blagajna radi mon-fri 5.40-13.10)"
  );
  addMarker(
    46.0208648595,
    15.9263840529,
    "Hum-Lug",
    "Hum Zabočki 64",
    map,
    "Hum-Lug, Hum Zabočki 64",
    "Train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.2300143755,
    18.7305206475,
    "Andrijaševci",
    "",
    map,
    "Andrijaševci",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.4835931019,
    18.6701419477,
    "Antunovac",
    "",
    map,
    "Antunovac",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.5029328742,
    17.2084549359,
    "Badljevina",
    "",
    map,
    "Badljevina",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    43.6415938567,
    16.1885406486,
    "Bakovići",
    "",
    map,
    "Bakovići",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    43.0453677324,
    17.5062734548,
    "Banja",
    "",
    map,
    "Banja",
    "train stop, <br />Working hours: HŽPP ne pruža uslugu"
  );
  addMarker(
    45.4222203081,
    15.4790694219,
    "Belavići",
    "",
    map,
    "Belavići",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.5131286077,
    18.8589956957,
    "Bijelo Brdo",
    "",
    map,
    "Bijelo Brdo",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.8222591134,
    16.3071395197,
    "Božjakovina",
    "",
    map,
    "Božjakovina",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    43.629296998,
    16.2016391446,
    "Brdašce",
    "",
    map,
    "Brdašce",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.863822797,
    15.7664473263,
    "Brdovec",
    "Dragutina Butorca 17, Prigorje Brdovečko ",
    map,
    "Brdovec, Dragutina Butorca 17, Prigorje Brdovečko ",
    "train stop, <br />Working hours: mon - sat 05.40 - 17.10 sun and blagdan 07.30 - 15.00 (iznimno from 13.1.2022. mon-fri 5.40-13.10)"
  );
  addMarker(
    45.4447974841,
    17.0342245405,
    "Brezine-Bujavica",
    "",
    map,
    "Brezine-Bujavica",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.9511813943,
    16.5679107956,
    "Brezovljani",
    "",
    map,
    "Brezovljani",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.6380393047,
    15.3831646488,
    "Brlog Grad",
    "",
    map,
    "Brlog Grad",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.1605598346,
    17.79520272,
    "Brodski Stupnik",
    "",
    map,
    "Brodski Stupnik",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.3499529716,
    18.8696756195,
    "Bršadin",
    "",
    map,
    "Bršadin",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.3677219279,
    18.91652651,
    "Bršadin-Lipovača",
    "",
    map,
    "Bršadin-Lipovača",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.6442334657,
    15.3513141103,
    "Bubnjarci",
    "",
    map,
    "Bubnjarci",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.247243831,
    17.7576186244,
    "Bučje-Koprivnica",
    "",
    map,
    "Bučje-Koprivnica",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.2610362748,
    18.4207361309,
    "Budrovci",
    "",
    map,
    "Budrovci",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    43.9800390036,
    15.7406207041,
    "Bulić",
    "",
    map,
    "Bulić",
    "train stop, <br />Buy ticket on the bus"
  );
  addMarker(
    45.7434100911,
    15.9984317731,
    "Buzin",
    "",
    map,
    "Buzin",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    46.0654728333,
    16.6471036127,
    "Carevdar",
    "",
    map,
    "Carevdar",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    43.7048172684,
    16.1768882729,
    "Cera",
    "",
    map,
    "Cera",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.2226027374,
    16.772983308,
    "Cerovljani",
    "",
    map,
    "Cerovljani",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.3341361865,
    17.9170585677,
    "Ciglenik",
    "",
    map,
    "Ciglenik",
    "train stop, <br />Working hours: HŽPP ne pruža uslugu"
  );
  addMarker(
    45.940274984,
    16.6591302246,
    "Cirkvena",
    "Cirkvena",
    map,
    "Cirkvena, Cirkvena",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.5735933595,
    18.409764217,
    "Cret",
    "",
    map,
    "Cret",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.041567213,
    13.8659781387,
    "Čabrunići",
    "",
    map,
    "Čabrunići",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.0308174086,
    13.8648680069,
    "Čabrunići Selo",
    "",
    map,
    "Čabrunići Selo",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    46.3837975075,
    16.4458545283,
    "Čakovec-Buzovec",
    "Preloška b.b., Čakovec",
    map,
    "Čakovec-Buzovec, Preloška b.b., Čakovec",
    "train stop, <br />Working hours: mon - sri and fri      05.20 - 13.20            thu                      06.40 - 15.40"
  );
  addMarker(
    46.3703133895,
    16.6164357117,
    "Čehovec",
    "Čehovec b.b.",
    map,
    "Čehovec, Čehovec b.b.",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.685868343,
    18.6553501211,
    "Čeminac",
    "",
    map,
    "Čeminac",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.5205539646,
    18.5778860845,
    "Čepin",
    "",
    map,
    "Čepin",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    46.2359524999,
    16.6659782271,
    "Čukovec",
    "",
    map,
    "Čukovec",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    43.6727287945,
    16.0106746003,
    "Dabar",
    "",
    map,
    "Dabar",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    43.9656892081,
    15.7909945911,
    "Dalmatinska Ostrovica",
    "",
    map,
    "Dalmatinska Ostrovica",
    "train stop, <br />Buy ticket on the bus"
  );
  addMarker(
    44.050409921,
    15.3442379975,
    "Debeljak",
    "",
    map,
    "Debeljak",
    "train stop, <br />Buy ticket on the bus"
  );
  addMarker(
    45.6730280576,
    15.7088712224,
    "Desinec",
    "",
    map,
    "Desinec",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.4186320448,
    17.1259417219,
    "Dobrovac",
    "",
    map,
    "Dobrovac",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    46.1718143963,
    15.8633103542,
    "Doliće",
    "",
    map,
    "Doliće",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.6332623281,
    15.632589488,
    "Domagović",
    "",
    map,
    "Domagović",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.1635935738,
    18.1214624064,
    "Donja Vrba",
    "",
    map,
    "Donja Vrba",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.6465184733,
    17.2725869328,
    "Donja Vrijeska",
    "",
    map,
    "Donja Vrijeska",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.3119703799,
    15.3625990794,
    "Donje Dubrave",
    "",
    map,
    "Donje Dubrave",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    43.6517843175,
    16.1266359708,
    "Donji Dolac",
    "",
    map,
    "Donji Dolac",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    46.0479020713,
    16.1356665803,
    "Donji Lipovec",
    "",
    map,
    "Donji Lipovec",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    46.3610933876,
    16.7238577184,
    "Donji Mihaljevec",
    "",
    map,
    "Donji Mihaljevec",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.4630733916,
    18.5502628672,
    "Dopsin",
    "",
    map,
    "Dopsin",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.2525655745,
    17.2882176683,
    "Dragalić",
    "",
    map,
    "Dragalić",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.2145591401,
    17.7063880901,
    "Dragovci",
    "",
    map,
    "Dragovci",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    46.02093388,
    15.9526407207,
    "Dubrava Zabočka",
    "",
    map,
    "Dubrava Zabočka",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    46.0960892789,
    15.8960476387,
    "Dukovec",
    "",
    map,
    "Dukovec",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    46.3860703446,
    16.3713812595,
    "Dunjkovec",
    "",
    map,
    "Dunjkovec",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    43.9626790796,
    15.8625916176,
    "Đevrske",
    "",
    map,
    "Đevrske",
    "train stop, <br />Buy ticket on the bus"
  );
  addMarker(
    45.4451009529,
    18.6676181071,
    "Ernestinovo",
    "",
    map,
    "Ernestinovo",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.5381901786,
    17.9809208556,
    "Feričanci",
    "",
    map,
    "Feričanci",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.5584467759,
    18.635722211,
    "Frigis - Osijek",
    "",
    map,
    "Frigis - Osijek",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.3540353937,
    18.7431914652,
    "Gaboš",
    "",
    map,
    "Gaboš",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.8135855446,
    15.8728285771,
    "Gajnice",
    "Aleja Bologne b.b., Zagreb-Susedgrad",
    map,
    "Gajnice, Aleja Bologne b.b., Zagreb-Susedgrad",
    "train stop, <br />Working hours: mon - sat            05.40 - 17.10         sun and blagdan     07.30 - 15.00 (iznimno from 18.1.2022. blagajna ne radi)"
  );
  addMarker(
    44.9334649803,
    13.871456348,
    "Galižana",
    "",
    map,
    "Galižana",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    44.070300401,
    15.3811600841,
    "Galovci",
    "",
    map,
    "Galovci",
    "train stop, <br />Buy ticket on the bus"
  );
  addMarker(
    45.3759445799,
    15.4123797382,
    "Gornji Zvečaj",
    "",
    map,
    "Gornji Zvečaj",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.2804833542,
    16.5415177584,
    "Graboštani",
    "",
    map,
    "Graboštani",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.1443976235,
    18.6999020808,
    "Gradište",
    "",
    map,
    "Gradište",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.9093679926,
    16.8931100073,
    "Grginac",
    "",
    map,
    "Grginac",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.9138711943,
    16.9083714145,
    "Grginac Novi",
    "",
    map,
    "Grginac Novi",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    44.8827790838,
    18.8443335118,
    "Gunja",
    "Kolodvorska b.b., Gunja",
    map,
    "Gunja, Kolodvorska b.b., Gunja",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.8915931891,
    15.6856861768,
    "Harmica",
    "",
    map,
    "Harmica",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.2155302579,
    13.8871831997,
    "Heki stajalište",
    "",
    map,
    "Heki stajalište",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    46.1055433277,
    16.1996543314,
    "Hrašćina-Trgovišće",
    "",
    map,
    "Hrašćina-Trgovišće",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    46.2068689139,
    15.80798734,
    "Hromec",
    "",
    map,
    "Hromec",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.9362584329,
    16.6878510015,
    "Hrsovo",
    "",
    map,
    "Hrsovo",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.2353354722,
    16.5274294214,
    "Hrvatska Kostajnica",
    "",
    map,
    "Hrvatska Kostajnica",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.34383803,
    14.0729758572,
    "Hum u Istri",
    "",
    map,
    "Hum u Istri",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.1734239076,
    19.0896647126,
    "Ilača",
    "",
    map,
    "Ilača",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.4507047388,
    16.8343164361,
    "Ilova",
    "",
    map,
    "Ilova",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.523392332,
    18.1548170924,
    "Jelisavac",
    "",
    map,
    "Jelisavac",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.0250046932,
    13.8651610847,
    "Juršići",
    "",
    map,
    "Juršići",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    43.9726330042,
    16.2058856394,
    "Kaldrma",
    "",
    map,
    "Kaldrma",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    46.0128483098,
    17.095933003,
    "Kalinovac",
    "",
    map,
    "Kalinovac",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.4880952841,
    15.5492424181,
    "Karlovac Centar",
    "Prilaz Većeslava Holjevca b.b., Karlovac",
    map,
    "Karlovac Centar, Prilaz Većeslava Holjevca b.b., Karlovac",
    "train stop, <br />Working hours: mon - fri 05.50 - 20.40"
  );
  addMarker(
    43.5534973434,
    16.4001883132,
    "Kaštel Gomilica",
    "",
    map,
    "Kaštel Gomilica",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    43.5554943002,
    16.3857133941,
    "Kaštel Kambelovac",
    "",
    map,
    "Kaštel Kambelovac",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.9101124226,
    16.7751966026,
    "Klokočevac",
    "",
    map,
    "Klokočevac",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.3368322108,
    17.897878798,
    "Knežci",
    "",
    map,
    "Knežci",
    "train stop, <br />Working hours: HŽPP ne pruža uslugu"
  );
  addMarker(
    43.0408659874,
    17.5374304131,
    "Komin",
    "",
    map,
    "Komin",
    "train stop, <br />Working hours: HŽPP ne pruža uslugu"
  );
  addMarker(
    43.6898050549,
    16.1484921749,
    "Koprno",
    "",
    map,
    "Koprno",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.6541847662,
    17.3580805972,
    "Koreničani",
    "",
    map,
    "Koreničani",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.2206049272,
    15.328849792,
    "Košare",
    "",
    map,
    "Košare",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    43.9977116163,
    15.681741976,
    "Kožlovac",
    "",
    map,
    "Kožlovac",
    "train stop, <br />Buy ticket on the bus"
  );
  addMarker(
    45.160054846,
    13.862619562,
    "Krajcar Brijeg",
    "",
    map,
    "Krajcar Brijeg",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    46.2249373302,
    16.3214623396,
    "Krušljevec",
    "",
    map,
    "Krušljevec",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    43.0255040911,
    17.589541125,
    "Krvavac",
    "",
    map,
    "Krvavac",
    "train stop, <br />Working hours: HŽPP ne pruža uslugu"
  );
  addMarker(
    45.4350811974,
    17.0828061193,
    "Kukunjevac",
    "",
    map,
    "Kukunjevac",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    43.0296676055,
    17.6050538624,
    "Kula Norinska",
    "",
    map,
    "Kula Norinska",
    "train stop, <br />Working hours: HŽPP ne pruža uslugu"
  );
  addMarker(
    46.2280609659,
    16.0935196057,
    "Kuljevčica",
    "",
    map,
    "Kuljevčica",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    46.1937309537,
    16.7565964104,
    "Kunovec-Subotica",
    "",
    map,
    "Kunovec-Subotica",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.4001459223,
    14.8904886963,
    "Kupjak",
    "",
    map,
    "Kupjak",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.9328378222,
    15.8161691352,
    "Kupljenovo",
    "",
    map,
    "Kupljenovo",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.8106281373,
    15.9268870664,
    "Kustošija",
    "Sokolska b.b., Zagreb",
    map,
    "Kustošija, Sokolska b.b., Zagreb",
    "train stop, <br />Working hours: mon - sat 5.40 - 17.10 sun and blagdan 07.30 - 15.00 (iznimno blagajna radi mon-fri 5.40-13.10)"
  );
  addMarker(
    45.1636365957,
    17.8129114586,
    "Kuti",
    "",
    map,
    "Kuti",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.878250513,
    15.7203497269,
    "Laduč",
    "",
    map,
    "Laduč",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.4144633138,
    18.7073214317,
    "Laslovo-Korođ",
    "",
    map,
    "Laslovo-Korođ",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.1121616534,
    15.3623816137,
    "Latin",
    "",
    map,
    "Latin",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.3369676882,
    17.9567504902,
    "Latinovac",
    "",
    map,
    "Latinovac",
    "train stop, <br />Working hours: HŽPP ne pruža uslugu"
  );
  addMarker(
    45.6064844006,
    15.6252578501,
    "Lazina",
    "",
    map,
    "Lazina",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    43.990807786,
    15.7174081284,
    "Lepuri",
    "",
    map,
    "Lepuri",
    "train stop, <br />Buy ticket on the bus"
  );
  addMarker(
    45.2815748245,
    14.7150989258,
    "Lič",
    "",
    map,
    "Lič",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.1326406018,
    15.3544637004,
    "Lički Podhum",
    "",
    map,
    "Lički Podhum",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.4215223368,
    18.5236580906,
    "Lipovac-Koritna",
    "",
    map,
    "Lipovac-Koritna",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.4260116759,
    18.0409308808,
    "Londžica",
    "",
    map,
    "Londžica",
    "train stop, <br />Working hours: HŽPP ne pruža uslugu"
  );
  addMarker(
    45.1705049896,
    17.7168227438,
    "Lužani-Malino",
    "Matije Gupca 1, Orlovac",
    map,
    "Lužani-Malino, Matije Gupca 1, Orlovac",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.3795157505,
    18.0215088722,
    "Ljeskovica",
    "",
    map,
    "Ljeskovica",
    "train stop, <br />Working hours: HŽPP ne pruža uslugu"
  );
  addMarker(
    45.3283729919,
    15.1705318854,
    "Ljubošina",
    "",
    map,
    "Ljubošina",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    46.38754872,
    16.3249475494,
    "Macinec",
    "",
    map,
    "Macinec",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    46.1695575562,
    16.3098357194,
    "Mađarevo",
    "",
    map,
    "Mađarevo",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    46.0267154325,
    16.590189162,
    "Majurec",
    "",
    map,
    "Majurec",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.8140787699,
    16.023745024,
    "Maksimir",
    "Ulica kneza Branimira b.b., Zagreb",
    map,
    "Maksimir, Ulica kneza Branimira b.b., Zagreb",
    "train stop, <br />Working hours: mon - fri             05.40 - 17.10"
  );
  addMarker(
    43.7200648108,
    15.9069358888,
    "Mandalina",
    "",
    map,
    "Mandalina",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.9081967314,
    16.8677828999,
    "Markovac",
    "",
    map,
    "Markovac",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.3813557798,
    18.7336382905,
    "Markušica-Antin",
    "",
    map,
    "Markušica-Antin",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    46.261419312,
    16.5325778384,
    "Martijanec",
    "Školska b.b., Martijanec",
    map,
    "Martijanec, Školska b.b., Martijanec",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.6972431268,
    15.7983332626,
    "Mavračići",
    "",
    map,
    "Mavračići",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.445477094,
    16.9111386127,
    "Međurić",
    "",
    map,
    "Međurić",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.2769149193,
    14.6176319353,
    "Melnice",
    "",
    map,
    "Melnice",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.3793233212,
    17.6720672318,
    "Mihaljevci",
    "",
    map,
    "Mihaljevci",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.6167919415,
    17.8122461509,
    "Mikleuš",
    "",
    map,
    "Mikleuš",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.2788254907,
    18.8560710101,
    "Mirkovci",
    "",
    map,
    "Mirkovci",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.9347418741,
    16.9449073885,
    "Mišulinovac",
    "",
    map,
    "Mišulinovac",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.6687558623,
    16.102145008,
    "Mraclin",
    "",
    map,
    "Mraclin",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    44.0698038327,
    15.494795362,
    "Nadin",
    "",
    map,
    "Nadin",
    "train stop, <br />Buy ticket on the bus"
  );
  addMarker(
    45.4874379224,
    18.0882118717,
    "Našice Grad",
    "",
    map,
    "Našice Grad",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.5315086976,
    18.1907468493,
    "Našička Breznica",
    "",
    map,
    "Našička Breznica",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.5427803054,
    18.2345543483,
    "Niza",
    "",
    map,
    "Niza",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.5573315563,
    18.3664905562,
    "Normanci",
    "",
    map,
    "Normanci",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.662570601,
    17.7773111707,
    "Nova Bukovica",
    "",
    map,
    "Nova Bukovica",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.2589534538,
    13.9894588294,
    "Novaki",
    "",
    map,
    "Novaki",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    46.2642302623,
    16.4965774651,
    "Novakovec",
    "",
    map,
    "Novakovec",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    46.0845700213,
    16.9549836297,
    "Novigrad Podravski",
    "",
    map,
    "Novigrad Podravski",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    46.4296938969,
    16.4564559168,
    "Novo Selo Rok",
    "",
    map,
    "Novo Selo Rok",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.3238565949,
    17.7797389751,
    "Novoselci",
    "",
    map,
    "Novoselci",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.4122949321,
    14.0243499348,
    "Nugla",
    "",
    map,
    "Nugla",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.3363670811,
    18.8413317129,
    "Nuštar Stajalište",
    "",
    map,
    "Nuštar Stajalište",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.7338960484,
    16.0116932696,
    "Odra",
    "",
    map,
    "Odra",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.2066536967,
    18.9756144976,
    "Orolik",
    "",
    map,
    "Orolik",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.5587547338,
    18.7036370234,
    "Osijek Dravski Most",
    "",
    map,
    "Osijek Dravski Most",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.5366370037,
    18.7676922413,
    "Osijek Luka",
    "",
    map,
    "Osijek Luka",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.5541115303,
    18.7055093998,
    "Osijek OLT",
    "",
    map,
    "Osijek OLT",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.7941134492,
    16.2711154023,
    "Ostrna",
    "",
    map,
    "Ostrna",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.3356746,
    18.7774832524,
    "Ostrovo",
    "",
    map,
    "Ostrovo",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.2187980044,
    15.2774303173,
    "Oštarije-Ravnice",
    "",
    map,
    "Oštarije-Ravnice",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.4371242136,
    17.1887679921,
    "Pakrac Grad",
    "Matije Gupca 8, Pakrac",
    map,
    "Pakrac Grad, Matije Gupca 8, Pakrac",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.3078983831,
    16.6344821584,
    "Papići",
    "",
    map,
    "Papići",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.9384422827,
    16.9743766052,
    "Paulovac",
    "",
    map,
    "Paulovac",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.7393706527,
    17.4912959019,
    "Pepelana",
    "",
    map,
    "Pepelana",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.2085555357,
    18.3495588786,
    "Perkovci",
    "Kolodvorska 82, Vrpolje",
    map,
    "Perkovci, Kolodvorska 82, Vrpolje",
    "train stop, <br />Working hours: mon - fri             05.00 - 13.00  "
  );
  addMarker(
    45.6145266466,
    16.1772302449,
    "Pešćenica",
    "",
    map,
    "Pešćenica",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.5556595585,
    18.6505404339,
    "Petrove Gore",
    "",
    map,
    "Petrove Gore",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.7081121632,
    17.4831938679,
    "Pivnica",
    "",
    map,
    "Pivnica",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    43.766793792,
    16.1835007209,
    "Planjane",
    "",
    map,
    "Planjane",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.7427199368,
    17.608969617,
    "Podravska Bistrica",
    "",
    map,
    "Podravska Bistrica",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.8156037931,
    15.8358497923,
    "Podsused Stajalište",
    "Samoborska cesta b.b., Zagreb- Susedgrad",
    map,
    "Podsused Stajalište, Samoborska cesta b.b., Zagreb- Susedgrad",
    "train stop, <br />Working hours: mon - sat            05.40 - 17.10          sun and blagdan        07.30 - 15.30"
  );
  addMarker(
    45.9094017902,
    15.8081771095,
    "Pojatno",
    "",
    map,
    "Pojatno",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.4630460063,
    16.978955409,
    "Poljana",
    "Kolodvorska 20, Poljana",
    map,
    "Poljana, Kolodvorska 20, Poljana",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.9747655326,
    16.5447189466,
    "Poljanka",
    "",
    map,
    "Poljanka",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.6501047754,
    17.3930592626,
    "Potočani-Katinac",
    "",
    map,
    "Potočani-Katinac",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    46.0496968324,
    16.0295498458,
    "Poznanovec",
    "Stubička b.b., Poznanovec",
    map,
    "Poznanovec, Stubička b.b., Poznanovec",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.7597304066,
    16.3506222303,
    "Prečec stajalište",
    "",
    map,
    "Prečec stajalište",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    43.6295938832,
    16.2139194371,
    "Preslo",
    "",
    map,
    "Preslo",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    43.610294745,
    16.2261750756,
    "Prgomet",
    "",
    map,
    "Prgomet",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    43.6963384733,
    15.9468064448,
    "Primorski Sveti Juraj",
    "",
    map,
    "Primorski Sveti Juraj",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    43.6784529648,
    15.9819828143,
    "Primorsko Vrpolje",
    "",
    map,
    "Primorsko Vrpolje",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    46.13714,
    15.877612,
    "Pristava Krapinska",
    "",
    map,
    "Pristava Krapinska",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    44.0871735685,
    15.4179917985,
    "Prkos",
    "",
    map,
    "Prkos",
    "train stop, <br />Buy ticket on the bus"
  );
  addMarker(
    44.0226061586,
    16.0642050712,
    "Radučić",
    "",
    map,
    "Radučić",
    "train stop, <br />Buy ticket on the bus"
  );
  addMarker(
    45.2959750533,
    17.1025147233,
    "Rajić",
    "",
    map,
    "Rajić",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    44.0530662852,
    15.5442672477,
    "Raštević",
    "",
    map,
    "Raštević",
    "train stop, <br />Buy ticket on the bus"
  );
  addMarker(
    45.2305499322,
    17.7314692069,
    "Ratkovica",
    "",
    map,
    "Ratkovica",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.7663628321,
    15.9455841815,
    "Remetinec",
    "",
    map,
    "Remetinec",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.9496598595,
    16.5052044268,
    "Repinec",
    "Repinec",
    map,
    "Repinec, Repinec",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.4891840746,
    16.729116774,
    "Repušnica",
    "Fumićeva 43, Kutina",
    map,
    "Repušnica, Fumićeva 43, Kutina",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    43.669615091,
    16.0517918542,
    "Ripište",
    "",
    map,
    "Ripište",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.3738620651,
    14.0799030898,
    "Ročko polje",
    "",
    map,
    "Ročko polje",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.2412996228,
    18.7315669272,
    "Rokovci",
    "",
    map,
    "Rokovci",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.9320337469,
    16.7186714185,
    "Rovišće",
    "",
    map,
    "Rovišće",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    43.5634479702,
    16.2986679446,
    "Sadine",
    "",
    map,
    "Sadine",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.5907846148,
    18.5025741387,
    "Samatovci",
    "",
    map,
    "Samatovci",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.0658221069,
    13.8587409582,
    "Savićenta",
    "",
    map,
    "Savićenta",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    43.7952201129,
    16.1587879524,
    "Sedramić",
    "",
    map,
    "Sedramić",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.8107253531,
    16.1688806102,
    "Sesvetski Kraljevec",
    "Željeznička 57, Sesvetski Kraljevec",
    map,
    "Sesvetski Kraljevec, Željeznička 57, Sesvetski Kraljevec",
    "train stop, <br />Working hours: mon - fri              05.40 - 17.10     "
  );
  addMarker(
    45.9592075842,
    17.0682700513,
    "Sirova Katalena",
    "",
    map,
    "Sirova Katalena",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    43.8742024228,
    16.1966948584,
    "Siverić",
    "",
    map,
    "Siverić",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.7268859758,
    17.6388105463,
    "Sladojevci",
    "",
    map,
    "Sladojevci",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.2151434534,
    18.9462944199,
    "Slakovci",
    "",
    map,
    "Slakovci",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.1769993723,
    17.9271623266,
    "Slobodnica",
    "",
    map,
    "Slobodnica",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.0917764439,
    13.8444887438,
    "Smoljanci",
    "",
    map,
    "Smoljanci",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    46.1010415468,
    16.7118856959,
    "Sokolovac",
    "",
    map,
    "Sokolovac",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.2271967501,
    18.9277928422,
    "Sremske Laze",
    "",
    map,
    "Sremske Laze",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    43.0481593677,
    17.4498179567,
    "Stablina",
    "",
    map,
    "Stablina",
    "train stop, <br />Working hours: HŽPP ne pruža uslugu"
  );
  addMarker(
    45.5453014983,
    18.7421494903,
    "Standard",
    "",
    map,
    "Standard",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.3641343387,
    16.9114369639,
    "Stara Subocka",
    "Stara Subocka 1, Novska",
    map,
    "Stara Subocka, Stara Subocka 1, Novska",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.8994132565,
    16.8099568048,
    "Stare Plavnice",
    "",
    map,
    "Stare Plavnice",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.1702495585,
    17.8420350171,
    "Stari Slatnik",
    "",
    map,
    "Stari Slatnik",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.1828945929,
    18.2471860213,
    "Staro Topolje",
    "Ive Lole Ribara 21, Donji Andrijevci",
    map,
    "Staro Topolje, Ive Lole Ribara 21, Donji Andrijevci",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.3286037699,
    16.6037067355,
    "Staza",
    "",
    map,
    "Staza",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    46.2417418206,
    16.174123427,
    "Stažnjevec",
    "",
    map,
    "Stažnjevec",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.9749009072,
    15.9414216546,
    "Stubičke Toplice",
    "Viktora Šipeka 68, Stubičke Toplice ",
    map,
    "Stubičke Toplice, Viktora Šipeka 68, Stubičke Toplice ",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.5022182215,
    16.3320122974,
    "Stupno",
    "Stupno b.b., Stupno",
    map,
    "Stupno, Stupno b.b., Stupno",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    44.0573440131,
    15.3130760232,
    "Sukošan",
    "",
    map,
    "Sukošan",
    "train stop, <br />Buy ticket on the bus"
  );
  addMarker(
    45.2590270269,
    17.7760218325,
    "Sulkovci",
    "",
    map,
    "Sulkovci",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.8861215968,
    15.6950718844,
    "Sutla",
    "Mokrička 13, Ključ Brdovečki, Šenkovec",
    map,
    "Sutla, Mokrička 13, Ključ Brdovečki, Šenkovec",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    46.2443375973,
    16.33637493,
    "Sveti Ilija",
    "",
    map,
    "Sveti Ilija",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.2850235203,
    16.6684406594,
    "Šaš",
    "",
    map,
    "Šaš",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.1800512537,
    19.0669548483,
    "Šidski Banovci",
    "",
    map,
    "Šidski Banovci",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    44.8884825226,
    13.8660852887,
    "Šijana",
    "",
    map,
    "Šijana",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.6713886394,
    16.490881058,
    "Širinec",
    "",
    map,
    "Širinec",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.6348802687,
    17.3171024326,
    "Škodinovac",
    "",
    map,
    "Škodinovac",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.9370546994,
    16.5932670383,
    "Škrinjari",
    "",
    map,
    "Škrinjari",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    44.0287886879,
    15.5811426929,
    "Šopot",
    "",
    map,
    "Šopot",
    "train stop, <br />Buy ticket on the bus"
  );
  addMarker(
    46.0317300443,
    15.9703413731,
    "Špičkovina",
    "",
    map,
    "Špičkovina",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    46.0564878215,
    15.9117484291,
    "Štrucljevo",
    "",
    map,
    "Štrucljevo",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.2103291786,
    15.2832194633,
    "Šušnjevo Selo",
    "",
    map,
    "Šušnjevo Selo",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    43.8933701298,
    16.2103415265,
    "Tepljuh",
    "",
    map,
    "Tepljuh",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.2506272046,
    15.3202446067,
    "Tounj",
    "",
    map,
    "Tounj",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.4009292395,
    17.6626122757,
    "Trenkovo",
    "",
    map,
    "Trenkovo",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.8184452691,
    16.0494026724,
    "Trnava",
    "Ulica kneza Branimira b.b., Zagreb",
    map,
    "Trnava, Ulica kneza Branimira b.b., Zagreb",
    "train stop, <br />Working hours: mon - sat             05.40 - 17.10          sun and blagdan      07.30 - 15.00 "
  );
  addMarker(
    46.1150378711,
    15.8876965341,
    "Velika Ves",
    "Gornja Pačetina 11a",
    map,
    "Velika Ves, Gornja Pačetina 11a",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.9321537468,
    16.9249901629,
    "Veliko Trojstvo",
    "",
    map,
    "Veliko Trojstvo",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.5125347989,
    18.0950524521,
    "Velimirovac",
    "",
    map,
    "Velimirovac",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    46.2648623974,
    16.252038973,
    "Vidovec",
    "",
    map,
    "Vidovec",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.185788958,
    19.0472762987,
    "Vinkovački Banovci",
    "",
    map,
    "Vinkovački Banovci",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.2900316322,
    18.7814734127,
    "Vinkovačko Novo Selo",
    "",
    map,
    "Vinkovačko Novo Selo",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.2926029035,
    18.822599076,
    "Vinkovci Bolnica",
    "",
    map,
    "Vinkovci Bolnica",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.8268433515,
    17.3860479402,
    "Virovitica grad",
    "",
    map,
    "Virovitica grad",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.3463861382,
    18.4265249782,
    "Viškovci",
    "",
    map,
    "Viškovci",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.5614222239,
    18.6198483365,
    "Višnjevac",
    "",
    map,
    "Višnjevac",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.5663694476,
    18.6066081534,
    "Višnjevac IPK",
    "",
    map,
    "Višnjevac IPK",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.2565121397,
    16.8803347416,
    "Višnjica",
    "",
    map,
    "Višnjica",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    44.9607166145,
    13.8557337023,
    "Vodnjan stajalište",
    "",
    map,
    "Vodnjan stajalište",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.5523506011,
    18.6681700751,
    "Vodovod",
    "",
    map,
    "Vodovod",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.2696813929,
    18.6137668509,
    "Vođinci",
    "",
    map,
    "Vođinci",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    46.0492047954,
    16.6212338812,
    "Vojakovački Kloštar",
    "",
    map,
    "Vojakovački Kloštar",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.1499836658,
    15.3342075156,
    "Vojnovac",
    "",
    map,
    "Vojnovac",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.5375742604,
    16.6579028571,
    "Voloder",
    "",
    map,
    "Voloder",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.8122886632,
    15.896561914,
    "Vrapče",
    "Aleja Bologne b.b., Zagreb- Susedgrad",
    map,
    "Vrapče, Aleja Bologne b.b., Zagreb- Susedgrad",
    "train stop, <br />Working hours: mon - sat             05.40 - 17.10         sun and blagdan       07.30 - 15.00 "
  );
  addMarker(
    45.3176533215,
    14.7320842312,
    "Vrata",
    "",
    map,
    "Vrata",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    46.4731521436,
    16.4534651563,
    "Vratišinec",
    "",
    map,
    "Vratišinec",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    44.9825039321,
    18.8851393794,
    "Vrbanja",
    "",
    map,
    "Vrbanja",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.2096733711,
    17.5831319872,
    "Vrbova",
    "",
    map,
    "Vrbova",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.4432829688,
    18.5399076253,
    "Hrastovac Vučki",
    "",
    map,
    "Hrastovac Vučki",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.8749307223,
    17.2538053278,
    "Vukosavljevica",
    "",
    map,
    "Vukosavljevica",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.6196857942,
    17.2722651062,
    "Vukovje",
    "",
    map,
    "Vukovje",
    "train stop, <br />Buy ticket on the bus"
  );
  addMarker(
    45.1685435369,
    18.1535453951,
    "Zadubravlje",
    "Slavonska 1, Garčin",
    map,
    "Zadubravlje, Slavonska 1, Garčin",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.6246723367,
    15.4633274243,
    "Zaluka",
    "",
    map,
    "Zaluka",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.2355921521,
    17.4628865981,
    "Zapolje",
    "",
    map,
    "Zapolje",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.854990863,
    15.7947729789,
    "Zaprešić Savska",
    "Savska 54, Zaprešić",
    map,
    "Zaprešić Savska, Savska 54, Zaprešić",
    "train stop, <br />Working hours: mon - fri 05.40 - 17.10"
  );
  addMarker(
    45.334311966,
    17.8764941142,
    "Zarilac",
    "",
    map,
    "Zarilac",
    "train stop, <br />Working hours: HŽPP ne pruža uslugu"
  );
  addMarker(
    46.2814052167,
    16.3990064576,
    "Zbelava",
    "",
    map,
    "Zbelava",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.9465102071,
    17.0394459713,
    "Zid Katalena",
    "",
    map,
    "Zid Katalena",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.2883238873,
    14.6505790448,
    "Zlobin",
    "",
    map,
    "Zlobin",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.4567049707,
    18.052134531,
    "Zoljan",
    "",
    map,
    "Zoljan",
    "train stop, <br />Working hours: HŽPP ne pruža uslugu"
  );
  addMarker(
    45.5912404034,
    15.530200251,
    "Zorkovac",
    "",
    map,
    "Zorkovac",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.9269429032,
    16.7320263931,
    "Žabjak",
    "",
    map,
    "Žabjak",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.9763936742,
    15.8450427487,
    "Žeinci",
    "",
    map,
    "Žeinci",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.2470328128,
    16.7276060812,
    "Živaja",
    "",
    map,
    "Živaja",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.1462943313,
    13.8555215728,
    "Žminj",
    "",
    map,
    "Žminj",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.449977,
    14.937467,
    "Žrnovac",
    "",
    map,
    "Žrnovac",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    46.1821226472,
    15.8536367943,
    "Žutnica",
    "",
    map,
    "Žutnica",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.57481,
    17.26075,
    "Bijela",
    "",
    map,
    "Bijela",
    "Buy ticket on the train"
  );
  addMarker(
    45.383018,
    16.494682,
    "Brđani Krajiški",
    "",
    map,
    "Brđani Krajiški",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.39246,
    14.30899,
    "Jurdani",
    "",
    map,
    "Jurdani",
    "Buy ticket on the train"
  );
  addMarker(
    45.38051,
    14.31685,
    "Jušići",
    "",
    map,
    "Jušići",
    "Buy ticket on the train"
  );
  addMarker(
    45.33832,
    14.39976,
    "Krnjevo",
    "",
    map,
    "Krnjevo",
    "Buy ticket on the train"
  );
  addMarker(
    45.41224,
    14.30317,
    "Permani",
    "",
    map,
    "Permani",
    "Buy ticket on the train"
  );
  addMarker(
    45.37003,
    14.30394,
    "Rukavac",
    "",
    map,
    "Rukavac",
    "Buy ticket on the train"
  );
  addMarker(
    45.1941680177,
    19.0186293247,
    "Đeletovci stajalište",
    "",
    map,
    "Đeletovci stajalište",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.2465789173,
    18.9007894039,
    "Novi Jankovci",
    "",
    map,
    "Novi Jankovci",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.914537,
    16.485064,
    "Gradec",
    "",
    map,
    "Gradec",
    "Buy ticket on the train"
  );
  addMarker(
    45.9236,
    16.5141,
    "Lubena",
    "",
    map,
    "Lubena",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.92404,
    16.5382,
    "Remetinec Križevački",
    "",
    map,
    "Remetinec Križevački",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.92671,
    16.58652,
    "Haganj",
    "",
    map,
    "Haganj",
    "train stop, <br />Buy ticket on the train"
  );
  addMarker(
    45.9143414403,
    16.4847683722,
    "Gradec ",
    "",
    map,
    "Gradec ",
    "za prometne potrebe, <br />Working hours: nema zaustavljanja putničkih vlakova"
  );

  return resolve(result);
});
