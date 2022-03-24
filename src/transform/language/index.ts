export interface LanguageInfo {
    1: string;
  }
  
  type EnforceObjectType<T> = <V extends T>(v: V) => V;
  const enforceObjectType: EnforceObjectType<Record<string, LanguageInfo>> = (v) =>
    v;
  
  export const Language = enforceObjectType({
    // // Afghanistan: {
    // //   wikidata: "Q889",
    // //   UIC: [68],
    // //   alpha2: "AF",
    // // },
    // Albania: {
    //   wikidata: "Q222",
    //   UIC: [41],
    //   alpha2: "AL",
    // },
    // // Algeria: {
    // //   wikidata: "Q262",
    // //   UIC: [92],
    // //   alpha2: "DZ",
    // // },
    // // Andorra: {
    // //   wikidata: "Q228",
    // //   alpha2: "AD",
    // // },
    // Armenia: {
    //   wikidata: "Q399",
    //   UIC: [58],
    //   alpha2: "AM",
    // },
    // Austria: {
    //   wikidata: "Q40" as "Q40",
    //   UIC: [81],
    //   IVR: "A",
    //   IBNR: [81],
    //   alpha2: "AT",
    // },
    // Azerbaijan: {
    //   wikidata: "Q227",
    //   UIC: [57],
    //   alpha2: "AZ",
    // },
    // Belarus: {
    //   wikidata: "Q184",
    //   UIC: [21],
    //   alpha2: "BY",
    // },
    // Belgium: {
    //   wikidata: "Q31",
    //   UIC: [88],
    //   IVR: "B",
    //   IBNR: [88],
    //   alpha2: "BE",
    // },
    // BosniaAndHerzegovina: {
    //   wikidata: "Q225",
    //   UIC: [44, 49, 50],
    //   alpha2: "BA",
    // },
    // Bulgaria: {
    //   wikidata: "Q219",
    //   UIC: [52],
    //   IBNR: [52],
    //   alpha2: "BG",
    // },
    // // China: {
    // //   wikidata: "Q148",
    // //   UIC: [33],
    // //   alpha2: "CN",
    // // },
    // Croatia: {
    //   wikidata: "Q224",
    //   UIC: [78],
    //   IBNR: [78],
    //   alpha2: "HR",
    // },
    // // Cuba: {
    // //   wikidata: "Q241",
    // //   UIC: [40],
    // //   alpha2: "CU",
    // // },
    // // Cyprus: {
    // //   wikidata: "Q229",
    // //   alpha2: "CY",
    // // },
    // Czech: {
    //   wikidata: "Q213" as "Q213",
    //   UIC: [54],
    //   IBNR: [54],
    //   alpha2: "CZ",
    // },
    // Denmark: {
    //   wikidata: "Q35",
    //   UIC: [86],
    //   IBNR: [86],
    //   alpha2: "DK",
    // },
    // // Egypt: {
    // //   wikidata: "Q79",
    // //   UIC: [90],
    // //   alpha2: "EG",
    // // },
    // Estonia: {
    //   wikidata: "Q191",
    //   UIC: [26],
    //   alpha2: "EE",
    // },
    // Finland: {
    //   wikidata: "Q33",
    //   UIC: [10],
    //   alpha2: "FI",
    //   alpha3: "FIN",
    // },
    // France: {
    //   wikidata: "Q142",
    //   UIC: [87],
    //   IVR: "F",
    //   IBNR: [87],
    //   alpha2: "FR",
    // },
    // Georgia: {
    //   wikidata: "Q230",
    //   UIC: [28],
    //   alpha2: "GE",
    // },
    German: {
      1: 'de'
    },
    // Greece: {
    //   wikidata: "Q41",
    //   UIC: [73],
    //   alpha2: "GR",
    //   alpha3: "GRC",
    // },
    // Hungary: {
    //   wikidata: "Q28" as "Q28",
    //   UIC: [55],
    //   IBNR: [55],
    //   alpha2: "HU",
    // },
    // // Iran: {
    // //   wikidata: "Q794",
    // //   UIC: [96],
    // //   alpha2: "IR",
    // // },
    // // Iraq: {
    // //   wikidata: "Q796",
    // //   UIC: [99],
    // //   alpha2: "IQ",
    // // },
    // Ireland: {
    //   wikidata: "Q27",
    //   UIC: [60],
    //   alpha2: "IE",
    // },
    // // Israel: {
    // //   wikidata: "Q801",
    // //   UIC: [95],
    // //   alpha2: "IL",
    // // },
    // Italy: {
    //   wikidata: "Q38",
    //   UIC: [83],
    //   IBNR: [83],
    //   alpha2: "IT",
    // },
    // // Japan: {
    // //   wikidata: "Q17",
    // //   UIC: [42],
    // //   alpha2: "JP",
    // // },
    // // Kazakhstan: {
    // //   wikidata: "Q232",
    // //   UIC: [27],
    // //   alpha2: "KZ",
    // // },
    // // Kyrgyzstan: {
    // //   wikidata: "Q813",
    // //   UIC: [59],
    // //   alpha2: "KG",
    // // },
    // Latvia: {
    //   wikidata: "Q211",
    //   UIC: [25],
    //   alpha2: "LV",
    // },
    // // Lebanon: {
    // //   wikidata: "Q822",
    // //   UIC: [98],
    // //   alpha2: "LB",
    // // },
    // Liechtenstein: {
    //   wikidata: "Q347",
    //   alpha2: "LI",
    // },
    // Lithuania: {
    //   wikidata: "Q37",
    //   UIC: [24],
    //   alpha2: "LT",
    // },
    // Luxembourg: {
    //   wikidata: "Q32",
    //   UIC: [82],
    //   IBNR: [82],
    //   alpha2: "LU",
    // },
    // // Malta: {
    // //   wikidata: "Q233",
    // //   alpha2: "MT",
    // // },
    // // Marocco: {
    // //   wikidata: "Q1028",
    // //   UIC: [93],
    // //   alpha2: "MA",
    // // },
    // Moldova: {
    //   wikidata: "Q217",
    //   UIC: [23],
    //   alpha2: "MD",
    // },
    // Monaco: {
    //   wikidata: "Q235",
    //   alpha2: "MC",
    // },
    // // Mongolia: {
    // //   wikidata: "Q711",
    // //   UIC: [31],
    // //   alpha2: "MN",
    // // },
    // Montenegro: {
    //   wikidata: "Q236",
    //   UIC: [62],
    //   alpha2: "ME",
    // },
    // // Morocco: {
    // //   wikidata: "Q1028",
    // //   alpha2: "MA",
    // // },
    // Netherlands: {
    //   wikidata: "Q55",
    //   UIC: [84],
    //   IVR: "NL",
    //   IBNR: [84],
    //   alpha2: "NL",
    // },
    // // NewZealand: {
    // //   wikidata: "Q664",
    // //   UIC: [64],
    // //   alpha2: "NZ",
    // // },
    // // NorthKorea: {
    // //   wikidata: "Q423",
    // //   UIC: [30],
    // //   alpha2: "KP",
    // // },
    // NorthMacedonia: {
    //   wikidata: "Q221",
    //   UIC: [65],
    //   alpha2: "MK",
    // },
    // Norway: {
    //   wikidata: "Q20",
    //   UIC: [76],
    //   IBNR: [76],
    //   alpha2: "NO",
    // },
    // Poland: {
    //   wikidata: "Q36" as "Q36",
    //   UIC: [51],
    //   IBNR: [51],
    //   alpha2: "PL",
    // },
    // Portugal: {
    //   wikidata: "Q45",
    //   UIC: [94],
    //   alpha2: "PT",
    // },
    // Romania: {
    //   wikidata: "Q218",
    //   UIC: [53],
    //   IBNR: [53],
    //   alpha2: "RO",
    // },
    // Russia: {
    //   wikidata: "Q159",
    //   UIC: [20],
    //   alpha2: "RU",
    //   alpha3: "RUS",
    // },
    Serbian: {
      1: "sn",
    },
    Slovak: {
      1: "sk",
    },
    Slovenian: {
      1: "sl",
    },
    // // SouthKorea: {
    // //   wikidata: "Q884",
    // //   UIC: [61],
    // //   alpha2: "KR",
    // // },
    // Spain: {
    //   wikidata: "Q29",
    //   UIC: [71],
    //   alpha2: "ES",
    // },
    // Sweden: {
    //   wikidata: "Q34",
    //   UIC: [74],
    //   IBNR: [74],
    //   alpha2: "SE",
    // },
    // Switzerland: {
    //   wikidata: "Q39",
    //   UIC: [85],
    //   IVR: "CH",
    //   alpha2: "CH",
    //   IBNR: [85],
    // },
    // // Syria: {
    // //   wikidata: "Q858",
    // //   UIC: [97],
    // //   alpha2: "SY",
    // // },
    // // Tajikistan: {
    // //   wikidata: "Q863",
    // //   UIC: [66],
    // //   alpha2: "TJ",
    // // },
    // // Tunisia: {
    // //   wikidata: "Q948",
    // //   UIC: [91],
    // //   alpha2: "TN",
    // // },
    // Turkey: {
    //   wikidata: "Q43",
    //   UIC: [75],
    //   alpha2: "TR",
    // },
    // // Turkmenistan: {
    // //   wikidata: "Q874",
    // //   UIC: [67],
    // //   alpha2: "TM",
    // // },
    // Ukraine: {
    //   wikidata: "Q212",
    //   UIC: [22],
    //   alpha2: "UA",
    //   IBNR: [22],
    // },
    English: {
      1: 'en'
    },
    // // Uzbekistan: {
    // //   wikidata: "Q265",
    // //   UIC: [29],
    // //   alpha2: "UZ",
    // // },
    // // Vietnam: {
    // //   wikidata: "Q88",
    // //   UIC: [32],
    // //   alpha2: "VN",
    // // },
  });
  