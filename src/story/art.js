const webp = (filename, alt) => ({
  src: `${import.meta.env.BASE_URL}assets/story-art/${encodeURIComponent(filename)}`,
  width: 1376,
  height: 768,
  alt,
});

export const storyArt = {
  "qubi-sheet": {
    src: `${import.meta.env.BASE_URL}assets/qubi-reference-sheet.png`,
    width: 1536,
    height: 1024,
    alt: "Qubi's reference sheet showing the CRT character and its expressions.",
  },
  mira: webp("Retro-futurist_sci-fi_game_style…_3f880443[1].webp", "Portrait illustration of Mira holding a mug at the North observatory."),
  sol: webp("Retro-futurist_sci-fi_game_style…_db33c9bd[1].webp", "Portrait illustration of Sol holding a notebook at the South observatory."),
  "mira-and-sol": webp("Scientists_in_retro-futurist_obs…_0d987d2d[1].webp", "Mira and Sol shown in separate observatories, each beside their instruments."),
  "s01-archive-night": webp("CRT_terminal_on_archive_desk_e0467809[1].webp", "Qubi sits beside two sealed envelopes on a desk in the Edge Archive."),
  "s01-qubi-at-archive": webp("Qubi_in_archive_station_c738c95c[1].webp", "Qubi stands at the archive desk beside two paper records."),
  "s02-copy-room": webp("Copier_printing_glass_cube_e8d96b00[1].webp", "A paper copier prints duplicate records beside an abstract glass-state image."),
  "s02-copy-room-study": webp("Character_studying_shimmering_gr…_7c1f04de[1].webp", "Qubi studies an abstract glowing state beside printed records."),
  "s03-pair-prepared": webp("Glowing_device_between_radio_dishes_db20a626[1].webp", "A prepared source sits between two distant observatory dishes, with no connecting beam."),
  "s03-wide-source": webp("Wide_landscape_with_device_and_e18fac9f[1].webp", "A small device sits in a wide, dark landscape between distant observatories."),
  "s04-courier-beacon": webp("Courier_beacon_traveling_distant…_2737a6d7[1].webp", "A small envelope travels by an ordinary beacon across a distant landscape."),
  "s04-qubi-waiting": webp("Qubi_waiting_at_dusk_window_0f221834[1].webp", "Qubi waits at a window while a courier approaches across the dusk landscape."),
  "s05-record-arrives": webp("Qubi_looking_at_envelope_b51ccd35[1].webp", "Qubi looks toward a delivered envelope at the observatory desk."),
  "s05-distant-observatory": webp("Character_at_distant_observatory…_33648ad4[1].webp", "Qubi sits at a distant observatory desk beneath the night sky."),
  "s06-two-rooms": webp("Two_characters_in_separate_rooms_a633bf5f[1].webp", "Mira and Sol sit in separate rooms for the two-player game."),
  "s07-evidence-wall": webp("Character_studying_evidence_wall_017ac5f7[1].webp", "Qubi studies an evidence wall covered with paper cards."),
  "s08-sols-letter": webp("Sol_seals_letter_at_desk_e8425710[1].webp", "Sol seals a letter beside coffee beans at the South observatory."),
  "locked-rooms-corridor": webp("Archive_corridor_with_seven_doors_6d354b9f[1].webp", "A quiet archive corridor lined with seven doors marked by topic symbols."),
};
