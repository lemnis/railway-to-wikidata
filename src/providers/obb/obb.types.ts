interface ObbRawLocation {
  /**
   * national station number,
   * @example 1114
   */
  pk_bfnr: string;
  /**
   * international station number,
   * @example 8100002
   */
  eva_bfnr: string;
  /**
   * Station name,
   * @example Salzburg Hbf
   */
  bfname: string;
  /**
   * Line timetable picture,
   * @example 101;200;220;300
   */
  bild: string;
  /**
   * Train station with ticket sales (yes/no),
   * @example ticketverkauf_ja
   */
  ticketverkauf_ja: string;
  /**
   * Ticket office opening hours Monday,
   * @example 05:30 - 21:15
   */
  k_montag: string;
  /**
   * Ticket counter opening hours Tuesday,
   * @example 5:30 a.m. - 9:15 p.m
   */
  k_tuesday: string;
  /**
   * Ticket office opening hours Wednesday,
   * @example 05:30 - 21:15
   */
  k_mittwoch: string;
  /**
   * Ticket counter opening hours Thursday,
   * @example 05:30 - 21:15
   */
  k_donnerstag: string;
  /**
   * Ticket counter opening times on Friday,
   * @example 5:30 a.m. - 9:15 p.m
   */
  k_freitag: string;
  /**
   * Ticket counter opening times on Saturday,
   * @example 05:30 - 21:15
   */
  k_samstag: string;
  /**
   * Ticket counter opening times on Sundays,
   * @example 06:30 - 21:15
   */
  k_sonntag: string;
  /**
   * Remarks ticket counter,
   * @example The travel center is located in the passage in the main train station
   */
  kassen_bem: string;
  /**
   * ÖBB travel agency opening hours Monday,
   * @example 08:30 - 12:30, 13:00 - 17:45
   */
  r_montag: string;
  /**
   * ÖBB travel agency opening hours on Tuesdays,
   * @example 8:30 a.m. - 12:30 p.m., 1:00 p.m. - 5:45 p.m
   */
  r_tuesday: string;
  /**
   * ÖBB travel agency opening hours Wednesday,
   * @example 8:30 a.m. - 12:30 p.m., 1:00 p.m. - 5:45 p.m
   */
  r_mittwoch: string;
  /**
   * ÖBB travel agency opening times Thursday,
   * @example 08:30 - 12:30, 13:00 - 17:45
   */
  r_donnerstag: string;
  /**
   * ÖBB travel agency opening hours Friday,
   * @example 8:30 a.m. - 12:30 p.m., 1:00 p.m. - 5:45 p.m
   */
  r_freitag: string;
  /**
   * ÖBB travel agency opening hours Saturday,
   * @example closed
   */
  r_samstag: string;
  /**
   * ÖBB travel agency opening times Sunday,
   * @example closed
   */
  r_sonntag: string;
  /**
   * Remarks ÖBB travel agency,
   * @example The travel agency is located in the travel center in the new passage
   */
  bem_rbb: string;
  /**
   * E-mail address ÖBB travel agency,
   * @example salzburg.reisebuero@pv.oebb.at
   */
  email: string;
  /**
   * Internet link ÖBB travel agency,
   * @example http://reisebuero.oebb.at
   */
  internetlink: string;
  /**
   * ÖBB Lounge opening hours Monday,
   * @example 05:45 - 22:00
   */
  l_montag: string;
  /**
   * ÖBB Lounge opening times on Tuesdays,
   * @example 5:45 a.m. - 10:00 p.m
   */
  l_dienstag: string;
  /**
   * ÖBB Lounge opening hours Wednesday,
   * @example 5:45 a.m. - 10:00 p.m
   */
  l_mittwoch: string;
  /**
   * ÖBB Lounge opening times Thursday,
   * @example 05:45 - 22:00
   */
  l_donnerstag: string;
  /**
   * ÖBB Lounge opening hours Friday,
   * @example 05:45 - 22:00
   */
  l_freitag: string;
  /**
   * ÖBB Lounge opening hours Saturday,
   * @example 6:30 a.m. - 10:00 p.m
   */
  l_samstag: string;
  /**
   * ÖBB Lounge opening times Sunday,
   * @example 06:30 - 22:00
   */
  l_sonntag: string;
  /**
   * Directions to the ÖBB Lounge,
   * @example The lounge is located in the passage between the escalators to platforms 2/3 and 4/5
   */
  lounge_weg: string;
  /**
   * Internet link ÖBB Lounge,
   * @example www.oebb.at/lounge
   */
  lounge_link: string;
  /** wheelchair lift */
  hebelift: string;
  /** Railway wheelchair available */
  bahnrollstuhl: string;
  /** wheelchair accessible ticket counter. */
  unterf_teller: string;
  /** Inductive hearing system */
  induktive_hoeranlage: string;
  /** boarding aid for travelers with restricted mobility - meeting point ticket counter, */
  t_fkschalter: string;
  /** boarding assistance for travelers with restricted mobility - meeting point Infopoint, */
  t_info_point: string;
  /** boarding aid for travelers with restricted mobility - meeting point at the platform, */
  t_bahnsteig: string;
  /** boarding aid for travelers with restricted mobility - meeting point car loading point, */
  t_autolade: string;
  /** Remarks for travelers with restricted mobility. */
  bf_besonderheiten: string;
  /** boarding assistance for travelers with restricted mobility - meeting point taxi, */
  t_taxi: string;
  /** boarding aid for travelers with restricted mobility - other meeting point, */
  t_sonstiger: string;
  /** Cashless payment possible */
  bargeldlose_zahlung: "True";
  /**
   * Operating hours of the wheelchair lift,
   * @example Monday - Sunday: 00:00 - 24:00 only with prior notification!
   */
  bed_hl: string;

  ticketautomat: {
    /**
     * ticket machine number,
     * @example 1114 81
     */
    kassennummer: string;
    /**
     * Description of the location of the ticket machine,
     * @example in the passage, between the entrance to platforms 2/3 and 4/5
     */
    standort_beschreibung: string;
    /**
     * Remarks on the ticket machine,
     * @example new ticket shop user interface.
     */
    bemerkungen: string;
    /**
     * Disabled ticket machine
     */
    behindertengerecht: string;
  }[];
}
