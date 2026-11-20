const visualDirection = "Create one original, high-energy quantum concept-art image for Quantum Atlas, an accessible sci-fi learning experience. Use cinematic editorial science-fiction art with bold camera movement, layered depth, luminous optical phenomena, sculptural geometry, and rich but controlled color. Let the specific scientific idea in the scene determine the composition and palette. The image should feel imaginative and surprising, while its visual mapping remains clear enough to explain in one sentence. No mascot, robot, CRT monitor, brass steampunk apparatus, generic data tube, readable text, pseudo-letters, equations, labels, logos, watermark, or decorative quantum symbols. Do not copy the composition or style of an existing artwork. Use no more than one human silhouette, and only when the scene calls for an observer. Output a single landscape artwork, not a collage, title card, or diagram.";

const topics = [
  {
    id: "carrier",
    title: "Information has a physical carrier",
    lecture: "Lecture 1 · Information and the physical world",
    caption: "A message needs a physical form—such as a pulse of light—to be stored or sent. This scene evokes a classical optical channel and the questions quantum information raises.",
    boundary: "The light pulse is a visual metaphor for encoding and transmission; information is not a glowing substance, and an ordinary communication channel is not automatically quantum.",
    prompt: "A cinematic cross-section of a modern optical channel stretching through a vast dark space: one carefully encoded light pulse leaves a source, travels through a material carrier, meets environmental noise, and reaches a detector that records one clear classical outcome. In the far depth, a second, delicate polarization path hints at the quantum-information questions to come, without merging it with the classical pulse. Use a sweeping diagonal camera angle, prismatic white and electric green light, and visible contrast between source, channel, noise, and receiver. Do not draw the information as a glowing fluid or imply the classical channel is itself a quantum effect. The lecture connection is that information must be physically represented, stored, or transmitted."
  },
  {
    id: "qubit-state",
    title: "Qubit state and measurement",
    lecture: "Lecture 2 · Entering the quantum",
    caption: "A Bloch sphere is a map mathematicians use to represent the state of one qubit. The direction helps calculate the probabilities of different measurement outcomes.",
    boundary: "The sphere is not a tiny planet or the qubit's physical shape. A measurement gives one outcome; probability patterns emerge across repeated trials.",
    prompt: "Build the composition around a precise, translucent Bloch sphere floating in a deep cobalt void. A single luminous state vector points to a location on the sphere; two differently oriented analyzer planes cast different probability patterns onto detector screens beyond it. One measurement produces one definite bright mark, while a cloud of many repeated trials would make the probability distribution visible. Use prismatic cyan, violet, and warm amber light, with a dramatic close perspective and clean geometry. The sphere is a mathematical representation of one qubit state, not a tiny planet or the physical shape of a qubit. Do not show multiple copies of the state or a classical object secretly holding both answers."
  },
  {
    id: "entanglement",
    title: "Entanglement and steering",
    lecture: "Lecture 3 · Quantum spookiness",
    caption: "Two distant labs make local records that can look strongly correlated when compared later. The visual pairing represents a relationship between outcomes, not a message travelling between the labs.",
    boundary: "Entanglement does not let either lab send a controllable faster-than-light message. The shared pattern is revealed by comparing records through ordinary communication.",
    prompt: "Compose two distant, isolated observatories on opposite sides of a huge dark landscape. Each records a sequence of locally unpredictable detector marks. Above them, their two record sheets align only when brought together in a later comparison, revealing a striking paired pattern; before comparison, neither station can read the other's choice. Use mirrored architecture, high vertical scale, and contrasting cyan and magenta lights, with open empty space between the stations. Do not draw a beam, wire, tunnel, or message passing between them. The shared pattern is a metaphor for joint quantum correlations, not a signal travelling faster than light."
  },
  {
    id: "bell-game",
    title: "Bell tests and the CHSH game",
    lecture: "Lecture 4 · Winning games",
    caption: "The arena evokes repeated rounds of a correlation game. Quantum strategies can exceed the best classical local strategy for the CHSH task under its rules.",
    boundary: "The result is a difference in statistical correlations—not reality breaking, a faster-than-light signal, or a win in every round.",
    prompt: "Show two sealed experimental chambers viewed from above like a high-stakes game arena. At each chamber a different analyzer orientation is chosen independently; each detector returns one simple outcome. A circular score sculpture records many rounds and glows just beyond a clearly visible amber “classical strategy” boundary, without numbers or words. Let electric blue and hot coral traces form a precise but non-connecting pattern across the arena. No player communicates during a round, and no beam links the chambers. This is a metaphor for statistical correlations exceeding a local classical bound under the game's assumptions, not for reality breaking or faster-than-light messaging."
  },
  {
    id: "qkd",
    title: "Quantum key distribution",
    lecture: "Lecture 5 · Quantum cryptography",
    caption: "Quantum key distribution uses quantum states and later checks to help two parties detect certain kinds of interception while establishing a shared key.",
    boundary: "It is not an all-purpose unhackable shield. The protocol relies on practical assumptions, authenticated classical communication, and secure endpoints.",
    prompt: "A single-photon security route cuts diagonally through a black, crystalline city: tiny polarization states travel along a lossy optical fiber between two distant endpoints. At the endpoints, differently oriented measurement plates turn the arrivals into records. A separate, clearly ordinary public channel carries only a small comparison of selected records; one disturbed subset appears as a sudden mismatch in the light pattern. Use sharp emerald and ice-blue pulses against dark violet, with a tense, kinetic sense of interception being detectable under a protocol. Do not show an impenetrable shield, “unhackable” lock, or protection for compromised endpoints. Quantum signals and classical authenticated discussion must remain visibly distinct."
  },
  {
    id: "computing",
    title: "Quantum computing and interference",
    lecture: "Lecture 6 · Quantum computing",
    caption: "Quantum operations can shape how likely different measurement results are. Interference can reinforce some outcomes and suppress others before one result is measured.",
    boundary: "A quantum computer does not reveal every possible answer at once, and it does not make every kind of calculation faster.",
    prompt: "A maze of discrete quantum paths folds through a monumental dark structure. Two wavefronts meet at crossings: some regions flare with constructive interference while others cancel into darkness. The surviving bright paths converge on one final detector that displays a single result, not a wall of answers. Use a fast, asymmetric camera angle, spectral cyan, violet, and amber, and crisp bands rather than smoke-like particles. Show controlled operations shaping measurement probabilities for one task; do not depict unrestricted parallel answers or imply all computing problems become faster."
  },
  {
    id: "sensing",
    title: "Quantum sensing",
    lecture: "Lecture 7 · Quantum sensors",
    caption: "An atom interferometer can split and recombine matter waves. A small phase change can shift an interference pattern, giving a way to measure tiny effects.",
    boundary: "The art shows a measurement strategy, not a promise that every quantum sensor is more sensitive than every classical instrument.",
    prompt: "A precision atom interferometer hangs in a vast night observatory as a faint gravitational ripple passes through it. Two carefully prepared wave packets travel along separate routes and recombine; an almost invisible phase shift turns into a readable fringe displacement on a measurement surface. At the image edges, vibration and environmental noise break the pattern into static. Make the small shift visually thrilling through extreme macro scale, a sweeping teal-and-gold interferometer path, and high-contrast fringes. This depicts a measurement strategy and its sensitivity, not a guarantee that every quantum sensor outperforms a classical one."
  },
  {
    id: "teleportation",
    title: "Quantum teleportation",
    lecture: "Lecture 8 · Quantum ideas in popular culture",
    caption: "Quantum teleportation transfers an unknown quantum state using shared entanglement, a joint measurement, and ordinary classical information sent to a receiver.",
    boundary: "No person or matter travels. The original state is consumed, and the receiver cannot reconstruct it before the classical message arrives.",
    prompt: "Visualize quantum teleportation as transfer of a pattern, not a person or object. At the left, an unknown delicate wave-pattern enters a joint measurement with one half of a shared entangled pair; that original pattern disappears from the source record. Far away, the other half remains at a receiver. Only after a short, visibly delayed classical message arrives does the receiver apply a correction and reconstruct the state-pattern. Use a dramatic split-space composition, a shared constellation motif, and magenta-to-gold light. No portal, dematerializing body, instantaneous message, or matter transported between locations. Keep the image mysterious but make the causal order clear."
  },
  {
    id: "spacetime",
    title: "Relativity and spacetime",
    lecture: "Lecture 9 · Spacetime and Einstein",
    caption: "Two clocks can accumulate different elapsed times when they follow different paths through motion and gravity, then reunite for comparison.",
    boundary: "Both clocks work correctly. The image is not a time-travel portal or a broken clock; it represents different elapsed times along different routes.",
    prompt: "Two precision clocks launch along different routes through a sculptural spacetime landscape: one descends close to a massive planet, the other follows a higher path. They reunite at a single comparison point, where their accumulated ticks differ by a tiny but visible amount. Fold the landscape into elegant curved layers and use a sweeping orbital camera, indigo shadows, and sharp gold clocklight. The clocks are both functioning correctly; motion and gravity change their elapsed times. Do not represent time as a river, a broken clock, or a time-travel portal."
  },
  {
    id: "black-holes",
    title: "Black holes and information",
    lecture: "Lecture 10 · Black holes",
    caption: "A black hole bends light around a dark event horizon. Researchers still ask how black-hole physics fits with the information principles of quantum theory.",
    boundary: "The information paradox and proposed resolutions remain theoretical questions. This scene does not show information escaping from inside the horizon or directly observed Hawking radiation from an astrophysical black hole.",
    prompt: "A black hole dominates a vast observatory window: its event horizon is a dark causal boundary, not a solid shell, and the surrounding light is strongly lensed into a bright, asymmetric arc. Outside the horizon, researchers compare a scattered archive of information records that cannot yet be reconciled into a complete story. Use immense scale, a deep-red and blue accretion glow, a tiny human-free research station, and suspended fragments of an unfinished ledger. Do not show information escaping from inside the horizon or portray Hawking radiation from astrophysical black holes as directly observed. Let the image end on an open question; the information paradox and its proposed resolutions remain theoretical."
  },
  {
    id: "computation-universe",
    title: "The computational universe proposal",
    lecture: "Lecture 11 · The computational universe",
    caption: "A quantum simulator can model some quantum systems. The art contrasts that practical scientific tool with a broader proposal that the universe itself might be understood as computation.",
    boundary: "Simulating a physical system does not establish that reality itself is a computer. The computational-universe idea is speculative, not an experimentally settled conclusion.",
    prompt: "Place a working quantum simulator on a small laboratory bench in the foreground. Beyond it, an enormous star field remains physically rich and irregular rather than turning into a circuit board. A transparent mathematical model is projected beside the cosmos and partially matches one observed pattern, while its edges fade before it can enclose the whole universe. Use a bold scale transition from precise machine geometry to untamed cosmic color, with a luminous boundary between model and reality. The image should distinguish simulating a physical system from the speculative proposal that reality itself is computation. Do not present the computational-universe idea as an experimentally established fact."
  }
];

const variants = {
  carrier: [
    ["Light_pulse_traveling_through_ch…_15d8dc18_2K.jpg", "An encoded pulse and its noisy channel", "A single bright pulse follows a long optical path toward a detector, with noise scattered around it."],
    ["Optical_channel_light_pulse_tran…_66d012b1_2K.jpg", "Inside an optical channel", "A close view follows a bright pulse through a glass-like transmission channel."],
  ],
  "qubit-state": [
    ["Bloch_sphere_quantum_concept_art_242ce76f_2K.jpg", "A state on the Bloch sphere", "A state vector crosses a luminous sphere toward layered measurement planes."],
    ["Bloch_sphere_quantum_concept_art_4e946f28_2K.jpg", "From state to outcome", "A Bloch sphere sits beside transparent analyzer planes and a field of possible detector marks."],
  ],
  entanglement: [
    ["Observatories_displaying_quantum…_23b2bb1a_2K.jpg", "Two observatories, two records", "Separate cyan and magenta observatories hold distinct records across a dark divide."],
    ["Observatories_displaying_quantum…_5f6f6442_2K.jpg", "Records awaiting comparison", "Two remote observatories display separate outcome records without a connecting beam."],
  ],
  "bell-game": [
    ["Create_quantum_concept_art_image_52e430d5_2K.jpg", "The correlation game", "A circular score-like arena gathers blue and coral outcome traces around two separated chambers."],
    ["Create_quantum_concept_art_image_8b379498_2K.jpg", "Independent choices, paired outcomes", "Two isolated analyzer chambers overlook outcome marks gathered from repeated rounds."],
  ],
  qkd: [
    ["Quantum_signal_security_route_in…_5119464d_2K.jpg", "A quantum-secure route", "A single bright line travels through a crystalline city while fragments scatter near the route."],
    ["Single-photon_security_route_in_…_a60b9a05_2K.jpg", "A photon route under scrutiny", "A narrow green photon path crosses a dark city beside a separate amber route."],
  ],
  computing: [
    ["Quantum_paths_interference_measu…_b77f1a33_2K.jpg", "Paths meeting at interference", "Several bright paths cross, reinforce, and fade before converging toward a detector."],
    ["Quantum_paths_shaping_measuremen…_78e89656_2K.jpg", "Shaping the measured result", "A luminous network of paths narrows toward one bright measurement point."],
  ],
  sensing: [
    ["Atom_interferometer_in_night_obs…_ec50d44f_2K.jpg", "A phase shift in the observatory", "A large atom-interferometer path curves across a night observatory toward a shifted fringe pattern."],
    ["Atom_interferometer_measuring_gr…_7e5b6771_2K.jpg", "Reading a tiny shift", "Two colored atom-wave routes loop through a precision instrument and meet at a striped detector."],
  ],
  teleportation: [
    ["Visualizing_quantum_teleportatio…_1bba8f77_2K.jpg", "A state-pattern across distance", "A pink wave-pattern and a gold receiver are separated by a measured sequence of steps."],
    ["Visualizing_quantum_teleportatio…_64518c39_2K.jpg", "The correction arrives", "Two wave structures face across a dark space linked by a dotted, delayed sequence."],
  ],
  spacetime: [
    ["Clocks_navigating_curved_spaceti…_551c25fd_2K.jpg", "Clocks on different routes", "Two ornate clocks follow separate arcs around a massive curved landscape."],
    ["Clocks_navigating_curved_spaceti…_7f300909_2K.jpg", "Comparing elapsed time", "Two paths trace different routes around a planet before reaching a clock comparison point."],
  ],
  "black-holes": [
    ["Black_hole_near_observatory_window_ddb008f5_2K.jpg", "A black hole beyond the window", "A luminous, lensed black hole fills a multi-pane observatory window, with record-like fragments nearby."],
    ["Researchers_viewing_black_hole_a…_ad2dcd82_2K.jpg", "The unfinished information ledger", "A black hole's bright accretion arc dominates an observatory as fragments drift around it."],
  ],
  "computation-universe": [
    ["Creating_quantum_concept_art_image_f6b4474f_2K.jpg", "A model meets the cosmos", "A translucent mathematical structure emerges from a small laboratory toward a star field."],
    ["Quantum_simulator_projecting_mat…_058ed722_2K.jpg", "A simulator beneath the stars", "A luminous model is projected beside a large, irregular cosmic landscape."],
  ],
};

export const conceptArtTopics = topics.map((topic) => ({
  ...topic,
  prompt: `${visualDirection}\n\n${topic.prompt}`,
  images: variants[topic.id].map(([filename, title, alt], index) => ({
    id: `${topic.id}-${index + 1}`,
    filename,
    title,
    alt,
    variant: `Variation ${index + 1}`,
    tool: "Google NanoBanana Pro",
  })),
}));

export const conceptArt = conceptArtTopics.flatMap((topic) => topic.images.map((image) => ({
  ...image,
  topicId: topic.id,
  topicTitle: topic.title,
  lecture: topic.lecture,
  caption: topic.caption,
  boundary: topic.boundary,
  prompt: topic.prompt,
})));
