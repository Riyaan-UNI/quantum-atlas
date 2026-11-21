import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, MotionConfig, motion, useReducedMotion, useScroll } from "motion/react";
import { conceptArt, conceptArtTopics } from "./content/artworks.js";
import { episodeTranscripts } from "./content/transcripts.js";
import { StoryApp } from "./story/StoryApp.jsx";
import { storyUI } from "./story/scenes.js";
const assetUrl = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\/+/, "")}`;
const videos = [
  {
    id: "ZNNB-lHQsfI",
    title: "The Magic Box",
    hook: "What changes when we measure a quantum bit?",
    runtime: "Video",
    topics: ["qubits", "measurement"],
    scienceNote: "The spinning coin is an analogy, not a literal model of a qubit. A qubit's state sets measurement probabilities; quantum algorithms can help with particular tasks, not every hard problem.",
  },
  {
    id: "vdufocF6Mjs",
    title: "Spooky Twins, No Messages",
    hook: "How can distant particles show linked results without sending a message?",
    runtime: "Video",
    topics: ["entanglement", "bell"],
    scienceNote: "Entangled outcomes are not universally opposite: the relation depends on the prepared state and measurement setting. Each local result is random; correlations do not carry a controllable faster-than-light message.",
  },
  {
    id: "8QNQDiFKVyg",
    title: "The Game Show That Broke Reality",
    hook: "Can a team win a game more often by using quantum correlations?",
    runtime: "Video",
    topics: ["bell"],
    titleNote: "The title is playful; the episode does not claim that experiments literally break reality.",
    scienceNote: "For the stated CHSH game with equally likely questions, the classical limit is 75% and the ideal quantum rate is about 85%. A Bell violation rules out local-realistic models under the experiment's assumptions; it does not literally break reality.",
  },
  {
    id: "episode-4",
    title: "The Un-Copyable Secret",
    hook: "Why can't an unknown quantum state be copied perfectly?",
    runtime: "Script supplied · video link needed",
    topics: ["qubits", "cryptography"],
    forthcoming: true,
  },
];

const topics = [
  {
    id: "information",
    title: "Information, bits, and physical systems",
    group: "Information foundations",
    source: "Lecture 1",
    question: "What does a bit tell us?",
    idea: "A bit represents one of two possible values. Information theory helps describe uncertainty and the resources needed to store or send information. Real devices and channels can add noise or lose information.",
    boundary: "Information is a useful way to describe physical systems; that does not mean every physical quantity is literally a message.",
    choices: ["A choice between two possible values", "A tiny object that is always visible"],
    answer: 0,
    feedback: "A classical bit has two possible values, often written 0 and 1. The physical device carrying it can take many forms.",
    relatedEpisodes: [],
    terms: ["bit", "information"],
  },
  {
    id: "qubits",
    title: "Qubits, superposition, and measurement",
    group: "Information foundations",
    source: "Lecture 2",
    question: "Is a qubit just a classical bit with a hidden value?",
    idea: "A qubit is a quantum state that can produce different measurement outcomes with probabilities set by its state and by how it is measured. Superposition is not simply a classical bit secretly holding both answers.",
    boundary: "A spinning coin is only a teaching analogy. A qubit is not a tiny coin physically spinning between 0 and 1.",
    choices: ["Yes, it is always secretly 0 or 1", "No, its measurement probabilities depend on its quantum state and measurement basis"],
    answer: 1,
    feedback: "A quantum state is not generally equivalent to a hidden classical bit. The measurement setup matters, and the outcome is probabilistic.",
    relatedEpisodes: [0, 3],
    terms: ["qubit", "superposition", "measurement", "no-cloning"],
  },
  {
    id: "entanglement",
    title: "Entanglement and steering",
    group: "Quantum correlations",
    source: "Lecture 3",
    question: "Can entanglement send a chosen message instantly?",
    idea: "Entangled systems can share correlations that cannot be described as independent states. A measurement choice can change the conditional description of a distant system, while the distant observer's local results alone do not reveal that choice.",
    boundary: "The correlation is real, but it cannot be controlled to send a faster-than-light message.",
    choices: ["Yes, the distant partner can read the sender's choice", "No, local results alone do not carry a controllable message"],
    answer: 1,
    feedback: "Entanglement creates strong joint correlations, but it does not let one person control the distant outcomes to communicate faster than light.",
    relatedEpisodes: [1],
    terms: ["entanglement", "steering", "no-signalling"],
  },
  {
    id: "bell",
    title: "Bell tests and the CHSH game",
    group: "Quantum correlations",
    source: "Lecture 4",
    question: "What does a Bell-test violation tell us?",
    idea: "Bell inequalities turn assumptions about local explanations into testable statistical limits. Experiments have violated these limits under carefully stated assumptions. The CHSH game makes one such correlation difference easier to picture.",
    boundary: "A Bell violation is not evidence of faster-than-light messaging, and it does not prove every assumption about reality false.",
    choices: ["The tested correlations exceed a local-model bound", "A usable message travelled faster than light"],
    answer: 0,
    feedback: "The experiment tests statistical correlations against a bound. It does not provide a way to send a controllable message faster than light.",
    relatedEpisodes: [1, 2],
    terms: ["Bell inequality", "CHSH"],
  },
  {
    id: "cryptography",
    title: "Quantum key distribution",
    group: "Quantum technologies",
    source: "Lecture 5",
    question: "What can a quantum cryptography protocol help users detect?",
    idea: "Quantum key distribution (QKD) uses quantum states together with authenticated classical communication to establish a shared key. In a defined protocol, eavesdropping can disturb the statistics and be detected during checks.",
    boundary: "Security depends on the protocol, implementation, authentication, devices, and security proof. QKD is not the same as post-quantum cryptography, and it does not make every message unhackable.",
    choices: ["Some evidence of eavesdropping in the protocol's checks", "A guarantee that every device and endpoint is secure"],
    answer: 0,
    feedback: "QKD can expose certain eavesdropping attempts under a protocol's assumptions. It cannot protect compromised devices or replace careful security analysis.",
    relatedEpisodes: [3],
    terms: ["QKD", "cryptography", "post-quantum cryptography"],
  },
  {
    id: "computing",
    title: "Quantum computing",
    group: "Quantum technologies",
    source: "Lecture 6",
    question: "Can a quantum computer read every possible answer at once?",
    idea: "Quantum gates change amplitudes. Interference can make some outcomes more likely and others less likely, helping particular algorithms. Measurement still gives limited output; quantum computers do not simply reveal every calculation at once.",
    boundary: "Quantum speedups depend on the task and algorithm. They do not imply a general speed advantage for every workload.",
    choices: ["Yes, all amplitudes can be read out directly", "No, useful algorithms shape probabilities before measurement"],
    answer: 1,
    feedback: "A quantum algorithm uses operations and interference to shape measurement probabilities. It cannot print all the amplitudes as ordinary readable answers.",
    relatedEpisodes: [],
    terms: ["quantum gate", "interference", "quantum computing"],
  },
  {
    id: "sensing",
    title: "Quantum sensing",
    group: "Quantum technologies",
    source: "Lecture 7",
    question: "Does using entanglement guarantee a better sensor?",
    idea: "Quantum sensors use prepared quantum states and measurements to estimate quantities such as time, acceleration, gravity, or magnetic fields. Entanglement can improve precision in some settings, but the full instrument and its noise matter.",
    boundary: "Noise, loss, imperfect preparation, and readout can remove a theoretical advantage. A quantum label alone does not guarantee a more useful sensor.",
    choices: ["Yes, entanglement always improves every measurement", "No, the conditions and noise determine whether an advantage survives"],
    answer: 1,
    feedback: "Quantum resources can help, but their advantage depends on the task and the real instrument's noise and losses.",
    relatedEpisodes: [],
    terms: ["quantum sensing", "standard quantum limit", "Heisenberg limit"],
  },
  {
    id: "popular",
    title: "Quantum ideas in popular culture",
    group: "Interpretation and popular claims",
    source: "Lecture 8",
    question: "What is quantum teleportation designed to transfer?",
    idea: "Quantum teleportation transfers a quantum state using shared entanglement and classical communication. The original state is consumed by the protocol; matter is not transported from one place to another.",
    boundary: "Teleportation cannot send a message faster than light. A story may use the word differently, so explain the difference when making a comparison.",
    choices: ["A quantum state, with classical communication as part of the protocol", "A person or object instantly appearing somewhere else"],
    answer: 0,
    feedback: "The protocol transfers state information using entanglement plus classical communication; it does not move matter or bypass light-speed limits.",
    relatedEpisodes: [],
    terms: ["quantum teleportation", "Schrödinger's cat", "interpretation"],
  },
  {
    id: "spacetime",
    title: "Relativity and spacetime",
    group: "Spacetime and information",
    source: "Lecture 9",
    question: "Can two observers measure different elapsed times and both be right?",
    idea: "Relativity predicts that elapsed time depends on motion and gravity. These are measured effects: precision clocks and satellite navigation account for relativistic clock-rate differences.",
    boundary: "“There is no universal now” is a shorthand about distant simultaneity, not the claim that local experiences or measurements do not exist.",
    choices: ["Yes, when their motion or gravitational situation differs", "No, every clock must always show identical elapsed time"],
    answer: 0,
    feedback: "Different paths through motion and gravity can produce different elapsed times. The comparison is physical and measurable.",
    relatedEpisodes: [],
    terms: ["spacetime", "special relativity", "general relativity"],
  },
  {
    id: "black-holes",
    title: "Black holes and information",
    group: "Spacetime and information",
    source: "Lecture 10",
    question: "What is an event horizon?",
    idea: "An event horizon is a causal boundary: signals from inside it cannot reach distant observers outside. Hawking's calculation predicts black-hole radiation, but radiation from astrophysical black holes has not been directly detected.",
    boundary: "The loader's black-hole image is an atmosphere, not a scientific diagram. The information paradox and proposed resolutions remain theoretical questions.",
    choices: ["A boundary beyond which signals cannot escape to distant observers", "A solid surface that has been photographed directly"],
    answer: 0,
    feedback: "The event horizon is a causal boundary, not a solid shell. Keep observed black-hole evidence separate from predictions about evaporation.",
    relatedEpisodes: [],
    terms: ["event horizon", "Hawking radiation", "information paradox"],
  },
  {
    id: "limits",
    title: "Physical limits of computation",
    group: "Spacetime and information",
    source: "Lecture 11",
    question: "Does physics prove that the universe is literally a computer?",
    idea: "Physics places limits on computation and motivates quantum simulation. The stronger claim that reality itself is a computer is an interpretation that needs precise definitions and testable predictions.",
    boundary: "A useful computational model is not the same as evidence that the universe literally runs on a computer.",
    choices: ["Yes, the idea has been experimentally established", "No, it is an interpretive proposal rather than an established result"],
    answer: 1,
    feedback: "Physical limits and quantum simulation are scientific topics. The claim that the universe is itself a computer remains a broader proposal.",
    relatedEpisodes: [],
    terms: ["Landauer's principle", "quantum speed limit", "computational universe"],
  },
];

const groups = [
  "Information foundations",
  "Quantum correlations",
  "Quantum technologies",
  "Interpretation and popular claims",
  "Spacetime and information",
];

const glossaryDefinitions = {
  bit: "A unit representing one of two possible values, often written 0 and 1.",
  information: "A way to describe uncertainty, messages, and the resources needed to store or communicate them.",
  qubit: "A quantum system used to represent quantum information. Its measurement probabilities depend on its state and the measurement setup.",
  superposition: "A quantum state that can lead to different outcomes when measured; it is not simply a hidden classical value.",
  measurement: "A physical interaction that produces an outcome according to the quantum state and measurement setup.",
  entanglement: "A shared quantum state whose correlations cannot be described as independent states of each part.",
  steering: "A way one party's measurement choices affect the conditional quantum-state description of a distant system, without enabling communication faster than light.",
  "no-signalling": "The principle that quantum correlations do not let people send controllable messages faster than light.",
  "Bell inequality": "A statistical bound that follows from a specified set of assumptions about local explanations.",
  CHSH: "Clauser–Horne–Shimony–Holt: a Bell inequality and a related game used to compare classical and quantum correlations.",
  QKD: "Quantum key distribution: protocols that use quantum states and authenticated classical communication to establish shared keys under stated assumptions.",
  "post-quantum cryptography": "Classical cryptographic algorithms designed to resist attacks from known quantum algorithms.",
  "quantum gate": "An operation that changes a quantum state in a controlled way.",
  "quantum teleportation": "A protocol for transferring a quantum state using shared entanglement and classical communication; it does not transport matter.",
  "event horizon": "A causal boundary beyond which signals cannot reach distant observers outside a black hole.",
};

const getInitialProgress = () => {
  try {
    const stored = JSON.parse(localStorage.getItem("quantum-atlas-topics") || "[]");
    return { ids: Array.isArray(stored) ? stored : [], available: true };
  } catch {
    return { ids: [], available: false };
  }
};

function LoadingIntro({ onEnter }) {
  const reduced = useReducedMotion();
  const [entering, setEntering] = useState(false);
  const fallbackTimer = useRef(null);

  useEffect(() => () => window.clearTimeout(fallbackTimer.current), []);
  const finishEntry = () => {
    window.clearTimeout(fallbackTimer.current);
    onEnter();
  };
  const beginEntry = () => {
    if (entering) return;
    if (reduced) {
      onEnter();
      return;
    }
    setEntering(true);
    // This transition uses only the already-loaded artwork, so entry never waits on WebGL or a 3D bundle.
    fallbackTimer.current = window.setTimeout(finishEntry, 680);
  };

  useEffect(() => {
    if (!entering) return undefined;
    const skip = (event) => { if (event.key === "Escape") finishEntry(); };
    window.addEventListener("keydown", skip);
    return () => window.removeEventListener("keydown", skip);
  }, [entering]);

  return (
    <motion.section className={`loading-intro${reduced ? " is-reduced" : ""}`} aria-label="Quantum Atlas opening screen" initial={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.025 }} transition={{ duration: reduced ? 0 : 0.3, ease: "easeInOut" }}>
      <motion.img className="loader-scene" src={assetUrl("assets/black-hole-scene.png")} alt="" fetchPriority="high" loading="eager" animate={entering && !reduced ? { scale: 1.24, opacity: 0.72 } : { scale: 1 }} transition={{ duration: 0.68, ease: [0.72, 0, 0.25, 1] }} />
      <motion.img className="loader-ring" src={assetUrl("assets/accretion-ring.png")} alt="" fetchPriority="high" loading="eager" animate={entering && !reduced ? { x: "-50%", y: "-50%", scale: 1.75, rotate: 42, opacity: 0 } : { x: "-50%", y: "-50%", scale: 1, rotate: -8 }} transition={{ duration: 0.68, ease: [0.72, 0, 0.25, 1] }} />
      <div className="loader-vignette" aria-hidden="true" />
      <div className="loader-copy">
        <div className="launch-brand-block">
          <motion.p className="loader-brand" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }}>Quantum Atlas</motion.p>
          <motion.p className="loader-tagline" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.18, duration: 0.65 }}>Chart the unknown. Keep asking why.</motion.p>
        </div>
        <div className="launch-invitation">
          <p className="launch-coordinate">QUANTUM INFORMATION · 11 TOPICS</p>
          <p className="loader-status">A new universe of questions is waiting.</p>
          <p className="launch-support">Watch the films, explore the course map, or browse the art. No physics background needed.</p>
          <motion.button className="skip-loader" type="button" onClick={beginEntry} whileHover={reduced ? undefined : { y: -3, scale: 1.025 }} whileTap={reduced ? undefined : { scale: 0.97 }} autoFocus disabled={entering}>
            {entering ? "Entering…" : "Enter the Atlas"} <span aria-hidden="true">↗</span>
          </motion.button>
          {entering && <button className="entry-skip" type="button" onClick={finishEntry}>Skip animation</button>}
        </div>
      </div>
      <motion.img className="loader-qubi" src={assetUrl("assets/qubi-3d-clean-320.png")} alt="Qubi, your curious guide" animate={entering && !reduced ? { x: "-8vw", y: "-12vh", rotate: -10, scale: 0.72, opacity: 0 } : { y: [0, -5, 0], rotate: [0, 1.4, 0] }} transition={entering ? { duration: 0.85, ease: "easeIn" } : { duration: 4.2, repeat: Infinity, ease: "easeInOut" }} />
      <p className="launch-note">Press Enter or select “Enter the Atlas” to begin.</p>
    </motion.section>
  );
}

function Header({ active, progress, onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [
    ["home", "Home"],
    ["episodes", "Episodes"],
    ["story", "Story challenge"],
    ["atlas", "Atlas"],
    ["art", "Art"],
    ["credits", "Credits"],
  ];

  const choose = (view) => {
    onNavigate(view);
    setMenuOpen(false);
  };

  return (
    <header className="site-header">
      <motion.button className="wordmark" type="button" onClick={() => choose("home")} aria-label="Quantum Atlas home" whileHover={{ x: 2 }} whileTap={{ scale: 0.97 }}>
        <span>Quantum Atlas</span>
        <span className="wordmark-dot" aria-hidden="true" />
      </motion.button>
      <motion.button
        className="menu-toggle"
        type="button"
        aria-expanded={menuOpen}
        aria-controls="primary-navigation"
        onClick={() => setMenuOpen((open) => !open)}
        whileTap={{ scale: 0.95 }}
      >
        {menuOpen ? "Close menu" : "Menu"}
      </motion.button>
      <nav id="primary-navigation" className={`primary-nav${menuOpen ? " is-open" : ""}`} aria-label="Main navigation">
        {links.map(([view, label]) => (
          <motion.button
            className={`${active === view ? "nav-link is-active" : "nav-link"}${view === "story" ? " nav-link-story" : ""}`}
            type="button"
            key={view}
            onClick={() => choose(view)}
            aria-current={active === view ? "page" : undefined}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
          >
            {label}
          </motion.button>
        ))}
      </nav>
      <motion.button className="progress-pill" type="button" onClick={() => choose("atlas")} aria-label={`${progress} of 11 topics explored. Open the Atlas.`} whileHover={{ scale: 1.035 }} whileTap={{ scale: 0.97 }}>
        Topics <span>{progress}/11</span>
      </motion.button>
    </header>
  );
}

const qubiExpressionPositions = {
  happy: "0%",
  curious: "20%",
  surprised: "40%",
  thinking: "60%",
  excited: "80%",
  dizzy: "100%",
};

function QubiGuide({ mood = "curious", message, compact = false }) {
  const position = qubiExpressionPositions[mood] ?? qubiExpressionPositions.curious;
  return (
    <motion.aside className={`qubi-guide${compact ? " is-compact" : ""}`} aria-label="Qubi's note" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <motion.div
        key={mood}
        className="qubi-guide-image"
        role="img"
        aria-label={`Qubi's ${mood} expression`}
        style={{ backgroundPosition: `${position} 65%` }}
        initial={{ scale: 0.82, rotate: -6 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 360, damping: 20 }}
      />
      <p className="qubi-guide-message" aria-live="polite">{message}</p>
    </motion.aside>
  );
}

function Footer({ onNavigate }) {
  return (
    <footer className="site-footer">
      <p>Quantum Atlas · Chart the unknown. Keep asking why.</p>
      <div className="footer-links">
        <button type="button" onClick={() => onNavigate("glossary")}>Glossary</button>
        <button type="button" onClick={() => onNavigate("credits")}>About &amp; credits</button>
        <a href="https://www.w3.org/TR/WCAG22/" target="_blank" rel="noreferrer">Accessibility standard</a>
        <button type="button" onClick={() => onNavigate("credits")}>AI use</button>
      </div>
    </footer>
  );
}

function HomePage({ progress, onNavigate, onEpisode, onTopic, onStory }) {
  return (
    <main className="page-shell home-page">
      <motion.section className="home-intro" initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: "easeOut" }}>
        <div className="intro-copy">
          <p className="eyebrow">Your exploration begins here</p>
          <h1>Chart the unknown.<br /><span>Keep asking why.</span></h1>
          <p className="home-promise">Four short films and an illustrated guide to quantum information. No physics background needed.</p>
          <p className="route-label">Choose your route</p>
          <div className="door-actions">
            <motion.button className="route-door route-door-primary" type="button" onClick={() => onEpisode(0)} whileHover={{ y: -4, scale: 1.015 }} whileTap={{ scale: 0.985 }}>
              <span className="route-door-index">01 / WATCH</span><strong>Episode 1</strong><span>The Magic Box</span>
            </motion.button>
            <motion.button className="route-door" type="button" onClick={() => onNavigate("atlas")} whileHover={{ y: -4, scale: 1.015 }} whileTap={{ scale: 0.985 }}>
              <span className="route-door-index">02 / EXPLORE</span><strong>Topic map</strong><span>11 course ideas</span>
            </motion.button>
            <motion.button className="route-door" type="button" onClick={() => onNavigate("art")} whileHover={{ y: -4, scale: 1.015 }} whileTap={{ scale: 0.985 }}>
              <span className="route-door-index">03 / VIEW</span><strong>Artwork</strong><span>Images and meaning</span>
            </motion.button>
          </div>
          <p className="home-progress-note">{progress} of 11 topics marked explored · no scores, no locked paths</p>
        </div>
        <div className="home-mascot-wrap">
          <motion.img className="home-mascot" src={assetUrl("assets/qubi-3d-clean-512.png")} alt="Qubi, your curious guide" animate={{ y: [0, -7, 0], rotate: [0, 1.2, 0] }} transition={{ duration: 4.4, repeat: Infinity, ease: "easeInOut" }} />
          <p className="home-qubi-caption">Qubi is ready to explore with you.</p>
        </div>
      </motion.section>

      <motion.section className="story-teaser" aria-labelledby="story-teaser-title" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.48 }}>
        <div className="story-teaser-copy">
          <p className="eyebrow">Optional interactive sci-fi story</p>
          <h2 id="story-teaser-title">Want a story challenge?</h2>
          <p className="story-teaser-name">{storyUI.entryTitle}</p>
          <p>Two observatories share a strange pattern, but their records arrive at different times. Help Qubi decide what the evidence really says.</p>
        </div>
        <motion.button className="button button-primary story-teaser-cta" type="button" onClick={onStory} whileHover={{ y: -3 }} whileTap={{ scale: 0.97 }}>
          Play the story challenge <span aria-hidden="true">↗</span>
        </motion.button>
      </motion.section>

      <motion.section className="featured-episode" aria-labelledby="featured-heading" initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.18 }} transition={{ duration: 0.48 }}>
        <motion.div className="featured-player" whileHover={{ scale: 1.006 }} transition={{ duration: 0.25 }}>
          <iframe
            src="https://www.youtube-nocookie.com/embed/ZNNB-lHQsfI?cc_load_policy=1&rel=0"
            title="CCST9077 Episode 1 — The Magic Box"
            loading="lazy"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </motion.div>
        <div className="featured-copy">
          <p className="eyebrow">Featured episode</p>
          <h2 id="featured-heading">The Magic Box</h2>
          <p>What changes when we measure a quantum bit?</p>
          <p className="source-line">Course connection: qubits and measurement · Lecture 2</p>
          <div className="inline-actions">
            <button className="button button-primary" type="button" onClick={() => onEpisode(0)}>Watch episode</button>
            <button className="text-link" type="button" onClick={() => onTopic("qubits")}>Explore the idea</button>
          </div>
        </div>
      </motion.section>

      <motion.section className="topic-peek" aria-labelledby="topics-peek-heading" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.18 }} transition={{ duration: 0.42 }}>
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">A path through the course</p>
            <h2 id="topics-peek-heading">Eleven topics, one connected story</h2>
          </div>
          <button className="text-link" type="button" onClick={() => onNavigate("atlas")}>See all topics</button>
        </div>
        <div className="topic-peek-list">
          {topics.slice(0, 4).map((topic, index) => (
            <button className="topic-peek-item" type="button" key={topic.id} onClick={() => onTopic(topic.id)}>
              <span className="topic-peek-number">{String(index + 1).padStart(2, "0")}</span>
              <span>{topic.title}</span>
              <span className="peek-arrow" aria-hidden="true">Open</span>
            </button>
          ))}
        </div>
      </motion.section>

      <motion.section className="art-teaser" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.18 }} transition={{ duration: 0.42 }}>
        <div>
          <p className="eyebrow">A visual field guide</p>
          <h2>Ideas you can see, question, and revisit.</h2>
          <p>Explore the Qubi character sheet and the visual language behind the project.</p>
        </div>
        <button className="button button-secondary" type="button" onClick={() => onNavigate("art")}>Browse artwork</button>
      </motion.section>
    </main>
  );
}

function EpisodeIndex({ onOpenEpisode, onTopic }) {
  return (
    <main className="page-shell content-page">
      <div className="page-heading">
        <p className="eyebrow">The films</p>
        <h1>Episodes</h1>
        <p>Start with a story, then follow its topic links into the wider course.</p>
      </div>
      <QubiGuide mood="happy" message="Pick a film that makes you curious. The topic map is always open when you want to go deeper." compact />
      <div className="episode-list">
        {videos.map((episode, index) => (
          <motion.article className={`episode-row${index === 1 ? " episode-row-spooky" : ""}`} key={episode.id} whileHover={{ x: 4 }} transition={{ duration: 0.18 }}>
            <motion.button className="episode-number" type="button" onClick={() => onOpenEpisode(index)} aria-label={`Open episode ${index + 1}`} whileTap={{ scale: 0.92 }}>
              {String(index + 1).padStart(2, "0")}
            </motion.button>
            <div className="episode-row-main">
              <p className="eyebrow">{episode.forthcoming ? "Script supplied · video link needed" : episode.runtime}</p>
              <h2>{episode.title}</h2>
              <p>{episode.hook}</p>
              <div className="topic-chips" aria-label="Related topics">
                {episode.topics.map((id) => {
                  const topic = topics.find((item) => item.id === id);
                  return topic ? <button type="button" key={id} onClick={() => onTopic(id)}>{topic.title}</button> : null;
                })}
              </div>
            </div>
            <div className="episode-row-action">
              {episode.forthcoming ? (
                <button className="text-link" type="button" onClick={() => onOpenEpisode(index)}>Episode details</button>
              ) : (
                <button className="button button-secondary" type="button" onClick={() => onOpenEpisode(index)}>Watch</button>
              )}
            </div>
          </motion.article>
        ))}
      </div>
      <p className="release-note">Only three playable links are connected in this prototype. Add the fourth video URL before presenting the collection as four available films.</p>
    </main>
  );
}

function EpisodePage({ index, onBack, onTopic, onNext }) {
  const episode = videos[index];
  if (!episode) return null;
  if (episode.forthcoming) {
    return (
      <main className="page-shell content-page">
        <button className="back-link" type="button" onClick={onBack}>← Episodes</button>
        <div className="page-heading">
          <p className="eyebrow">Episode 4 · script supplied</p>
          <h1>{episode.title}</h1>
          <p>The video link has not been added yet. The topic pages are available now.</p>
        </div>
        <QubiGuide mood="thinking" message="This episode's script is ready; follow its questions into the related topic pages." compact />
        <div className="availability-panel">
          <h2>Explore the related ideas</h2>
          <p>No-cloning, quantum money, and quantum key distribution connect to these topics.</p>
          <div className="inline-actions">
            <button className="button button-primary" type="button" onClick={() => onTopic("qubits")}>Explore no-cloning</button>
            <button className="button button-secondary" type="button" onClick={() => onTopic("cryptography")}>Explore quantum key distribution</button>
          </div>
        </div>
      </main>
    );
  }

  const associated = episode.topics.map((id) => topics.find((topic) => topic.id === id)).filter(Boolean);
  const next = (index + 1) % 3;

  return (
    <main className={`page-shell content-page episode-page${index === 1 ? " is-spooky" : ""}`}>
      <button className="back-link" type="button" onClick={onBack}>← Episodes</button>
      <div className="page-heading episode-heading">
        <p className="eyebrow">Episode {index + 1}</p>
        <h1>{episode.title}</h1>
        <p>{episode.hook}</p>
        {episode.titleNote && <p className="science-note">{episode.titleNote}</p>}
      </div>
      <motion.div className={`episode-player${index === 1 ? " is-spooky" : ""}`} initial={{ opacity: 0, y: 16, scale: 0.985 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.42 }}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${episode.id}?cc_load_policy=1&rel=0`}
          title={`CCST9077 Episode ${index + 1} — ${episode.title}`}
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </motion.div>
      <p className="key-idea-line"><strong>Key question:</strong> {episode.hook}</p>
      {episode.scienceNote && <aside className="episode-science-note" aria-label="Science note"><strong>Science note</strong><p>{episode.scienceNote}</p></aside>}
      <div className="transcript-panel">
        <p className="eyebrow">Captions and transcript</p>
        <p>The player requests captions when the video provides them. The transcript below follows the script supplied by the team.</p>
        <a href={`https://www.youtube.com/watch?v=${episode.id}`} target="_blank" rel="noreferrer">Open this episode on YouTube</a>
      </div>
      {episodeTranscripts[episode.id] && <details className="episode-transcript">
        <summary>Read the transcript</summary>
        <pre>{episodeTranscripts[episode.id]}</pre>
      </details>}
      <QubiGuide mood={index === 1 ? "surprised" : "curious"} message={index === 1 ? "Spooky correlations can link the twins, but neither sends the other a message." : "What surprised you in the story? Follow a related topic to compare it with the lecture idea."} compact />
      <div className="course-connection">
        <p className="eyebrow">Related topics</p>
        {associated.map((topic) => (
          <article key={topic.id} className="connection-item">
            <h2>{topic.title}</h2>
            <button className="text-link" type="button" onClick={() => onTopic(topic.id)}>Open the explanation</button>
          </article>
        ))}
      </div>
      <div className="episode-end-card">
        <div>
          <p className="eyebrow">Continue exploring</p>
          <h2>{videos[next].title}</h2>
          <p>{videos[next].hook}</p>
        </div>
        <button className="button button-primary" type="button" onClick={() => onNext(next)}>Next episode</button>
      </div>
    </main>
  );
}

function AtlasPage({ progress, progressIds, onTopic }) {
  const groupsWithTopics = groups.map((group) => ({
    name: group,
    items: topics.filter((topic) => topic.group === group),
  }));

  return (
    <main className="page-shell content-page atlas-page">
      <div className="page-heading">
        <p className="eyebrow">Explore the course</p>
        <h1>Atlas</h1>
        <p>Five regions group the course ideas. Start with information foundations or roam freely; every topic stays open.</p>
        <p className="progress-summary">{progress} of 11 topics marked explored</p>
      </div>
      <div className="start-path">
        <span className="start-pin" aria-hidden="true">Start here</span>
        <div>
          <h2>Begin with the basics</h2>
          <p>Learn what information is, then see what makes quantum information different.</p>
        </div>
        <button className="button button-primary" type="button" onClick={() => onTopic("information")}>Start with Topic 1</button>
      </div>
      <QubiGuide mood="curious" message="Choose any region. Nothing is locked, and you can follow the map in your own order." compact />
      <div className="atlas-groups">
        {groupsWithTopics.map((group) => (
          <section className="atlas-group" key={group.name}>
            <div className="atlas-group-heading">
              <h2>{group.name}</h2>
              <span>{group.items.length} {group.items.length === 1 ? "topic" : "topics"}</span>
            </div>
            <div className="atlas-topic-list">
              {group.items.map((topic) => {
                const topicIndex = topics.findIndex((item) => item.id === topic.id);
                const explored = progressIds.includes(topic.id);
                return (
                  <button className={`atlas-topic${explored ? " is-explored" : ""}`} type="button" key={topic.id} onClick={() => onTopic(topic.id)} aria-label={`${topic.title}. ${topic.source}. ${explored ? "Marked explored" : "Not yet marked explored"}. Open topic.`}>
                    <span className="atlas-topic-count">{String(topicIndex + 1).padStart(2, "0")}</span>
                    <span className="atlas-topic-title">{topic.title}</span>
                    <span className="atlas-topic-source">{topic.source}</span>
                    <span className="atlas-topic-open">{explored ? "Explored" : "Open topic"}</span>
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
}

function InteractiveIdea({ text, terms = [] }) {
  const [activeTerm, setActiveTerm] = useState(null);
  const knownTerms = terms.filter((term) => glossaryDefinitions[term.toLowerCase()]);
  const pattern = knownTerms.length ? new RegExp(`(${knownTerms.sort((a, b) => b.length - a.length).map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi") : null;
  const pieces = pattern ? text.split(pattern) : [text];
  return (
    <p className="idea-copy">
      {pieces.map((piece, index) => {
        const matched = knownTerms.find((term) => term.toLowerCase() === piece.toLowerCase());
        if (!matched) return <span key={`text-${index}`}>{piece}</span>;
        const definition = glossaryDefinitions[matched.toLowerCase()];
        const open = activeTerm === matched;
        const tooltipId = `glossary-note-${matched.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
        return (
          <span className={`inline-term${open ? " is-open" : ""}`} key={`term-${index}`} onMouseEnter={() => setActiveTerm(matched)} onMouseLeave={() => setActiveTerm(null)}>
            <button type="button" aria-expanded={open} aria-describedby={open ? tooltipId : undefined} onFocus={() => setActiveTerm(matched)} onBlur={() => setActiveTerm(null)} onClick={() => setActiveTerm(matched)}>{piece}</button>
            <AnimatePresence>{open && <motion.span className="term-tooltip" id={tooltipId} role="tooltip" initial={{ opacity: 0, y: 5, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 4 }} transition={{ duration: 0.16 }}>{definition}</motion.span>}</AnimatePresence>
          </span>
        );
      })}
    </p>
  );
}

function TopicPage({ topic, progressIds, canSaveProgress, onMarkExplored, onNavigate, onTopic }) {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const alreadyMarked = progressIds.includes(topic.id);
  const topicIndex = topics.findIndex((item) => item.id === topic.id);
  const nextTopic = topics[topicIndex + 1];
  const qubiMood = alreadyMarked ? "happy" : revealed ? (selected === topic.answer ? "excited" : "thinking") : selected === null ? "curious" : "surprised";
  const qubiMessage = alreadyMarked
    ? nextTopic ? `Good work. The next topic is ${nextTopic.title}.` : "You've reached the end of the topic list. Let's look at the full Atlas."
    : revealed
      ? selected === topic.answer ? "You spotted the lecture's key idea. Keep asking why!" : "A useful prediction. Compare it with the explanation and try the next idea."
      : selected === null ? "Make a prediction when you're ready. This is for thinking, not scoring." : "Interesting choice. Ready to see what the lecture says?";

  useEffect(() => {
    setSelected(null);
    setRevealed(false);
  }, [topic.id]);

  return (
    <main className="page-shell content-page topic-page">
      <button className="back-link" type="button" onClick={() => onNavigate("atlas")}>← Atlas</button>
      <div className="topic-heading">
        <p className="eyebrow">{topic.group}</p>
        <h1>{topic.title}</h1>
        <p className="course-source">Course source: {topic.source}</p>
      </div>

      <section className="topic-explanation" aria-labelledby="key-question-heading">
        <p className="eyebrow">Key question</p>
        <h2 id="key-question-heading">{topic.question}</h2>
        <InteractiveIdea text={topic.idea} terms={topic.terms} />
        <aside className="boundary-note">
          <strong>What this example does not mean</strong>
          <p>{topic.boundary}</p>
        </aside>
      </section>

      <section className="prediction-panel" aria-labelledby="prediction-heading">
        <div className="prediction-heading">
          <div>
        <p className="eyebrow">Optional mission activity · no score</p>
            <h2 id="prediction-heading">Make a prediction</h2>
          </div>
          <span className="activity-step">Predict <span aria-hidden="true">→</span> Reveal <span aria-hidden="true">→</span> Explain</span>
        </div>
        <p className="prediction-question">Before reading the evidence, what do you think?</p>
        <QubiGuide mood={qubiMood} message={qubiMessage} compact />
        <div className="prediction-choices" role="group" aria-label="Choose your prediction">
          {topic.choices.map((choice, index) => (
            <button
              className={`prediction-choice${selected === index ? " is-selected" : ""}`}
              key={choice}
              type="button"
              onClick={() => { setSelected(index); setRevealed(false); }}
              aria-pressed={selected === index}
            >
              {choice}
            </button>
          ))}
        </div>
        <div className="prediction-actions">
          <button className="button button-primary" type="button" disabled={selected === null} onClick={() => setRevealed(true)}>Reveal the explanation</button>
          <span className="no-pressure">Your choice is for thinking, not grading.</span>
        </div>
        {revealed && (
          <div className="feedback-panel" role="status" aria-live="polite">
            <p className="eyebrow">What the lecture tells us</p>
            <p>{topic.feedback}</p>
          </div>
        )}
      </section>

      <section className="topic-related">
        <div>
          <p className="eyebrow">Related material</p>
          <h2>Keep following the idea</h2>
          {topic.relatedEpisodes.length ? (
            <div className="related-actions">
              {topic.relatedEpisodes.map((episodeIndex) => (
                <button className="text-link" key={episodeIndex} type="button" onClick={() => onNavigate("episode", episodeIndex)}>{videos[episodeIndex].title}</button>
              ))}
            </div>
          ) : (
            <p>Artwork and a short film for this topic can be added as the team finishes its media.</p>
          )}
        </div>
        <button className="button button-secondary" type="button" onClick={() => onNavigate("art")}>Browse artwork</button>
      </section>

      <section className="topic-marking">
        <div>
          <p className="eyebrow">Progress</p>
          <p>{alreadyMarked ? "You marked this topic explored." : "After reading, you can mark this topic explored."}</p>
          {!canSaveProgress && <p className="storage-note">Progress is not being saved on this device. You can still explore all topics.</p>}
        </div>
        <div className="topic-progress-actions">
          <button className="button button-secondary" type="button" disabled={alreadyMarked} onClick={() => onMarkExplored(topic.id)}>
            {alreadyMarked ? "Marked explored" : "Mark topic explored"}
          </button>
          {alreadyMarked && (nextTopic ? (
            <button className="button button-primary" type="button" onClick={() => onTopic(nextTopic.id)}>
              Next topic: {nextTopic.title} <span aria-hidden="true">→</span>
            </button>
          ) : (
            <button className="button button-primary" type="button" onClick={() => onNavigate("atlas")}>
              Return to the topic map <span aria-hidden="true">→</span>
            </button>
          ))}
        </div>
      </section>
      <p className="source-line">The course lecture is the primary source. This short explanation is a prototype draft for team science review.</p>
    </main>
  );
}

function ArtPage() {
  const reduced = useReducedMotion();
  const emotions = [
    { name: "Happy", position: "0%", use: "Welcoming a visitor or celebrating a small discovery." },
    { name: "Curious", position: "20%", use: "Inviting the visitor to ask a question." },
    { name: "Surprised", position: "40%", use: "Reacting to an unexpected result." },
    { name: "Thinking", position: "60%", use: "Pausing before an explanation or prediction." },
    { name: "Excited", position: "80%", use: "Sharing an energetic moment of discovery." },
    { name: "Dizzy", position: "100%", use: "A playful expression for uncertainty; not a depiction of superposition." },
  ];
  const [activeArtwork, setActiveArtwork] = useState(0);
  const [activeEmotion, setActiveEmotion] = useState(1);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [lightboxArtwork, setLightboxArtwork] = useState(null);
  const [copiedPrompt, setCopiedPrompt] = useState(null);
  const lightboxRef = useRef(null);
  const changeArtwork = (step) => setActiveArtwork((current) => (current + step + conceptArt.length) % conceptArt.length);
  const copyPrompt = async (item) => {
    try {
      await navigator.clipboard.writeText(item.prompt);
      setCopiedPrompt(item.id);
      window.setTimeout(() => setCopiedPrompt(null), 1800);
    } catch {
      setCopiedPrompt(`unavailable-${item.id}`);
      window.setTimeout(() => setCopiedPrompt(null), 2400);
    }
  };
  const renderPromptDetails = (item) => (
    <details className="art-prompt-details">
      <summary>View the NanoBanana Pro prompt</summary>
      <div className="art-prompt-body">
        <p>{item.prompt}</p>
        <button className="button button-secondary" type="button" onClick={() => copyPrompt(item)}>
          {copiedPrompt === item.id ? "Prompt copied" : copiedPrompt === `unavailable-${item.id}` ? "Copy unavailable in this browser" : "Copy full prompt"}
        </button>
      </div>
    </details>
  );
  const artwork = conceptArt[activeArtwork];
  const emotion = emotions[activeEmotion];

  useEffect(() => {
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePlaybackPreference = () => setIsPlaying(!motionPreference.matches);
    updatePlaybackPreference();
    motionPreference.addEventListener("change", updatePlaybackPreference);
    return () => motionPreference.removeEventListener("change", updatePlaybackPreference);
  }, []);

  useEffect(() => {
    if (!isPlaying || isHovered || isFocused) return undefined;
    const timer = window.setInterval(() => setActiveArtwork((current) => (current + 1) % conceptArt.length), 7000);
    return () => window.clearInterval(timer);
  }, [isPlaying, isHovered, isFocused]);

  useEffect(() => {
    if (!lightboxArtwork) return undefined;
    const dialog = lightboxRef.current;
    if (dialog && !dialog.open) dialog.showModal();
    return () => {
      if (dialog?.open) dialog.close();
    };
  }, [lightboxArtwork]);

  return (
    <main className="page-shell content-page art-page">
      <div className="page-heading">
        <p className="eyebrow">Images and ideas</p>
        <h1>Artwork</h1>
        <p>Twenty-two cinematic concept-art variations trace eleven ideas from the CCST9077 lectures. Explore the image first, then open its science note and the exact prompt behind it.</p>
      </div>
      <section className="art-carousel" aria-label="Featured artwork slideshow">
        <motion.div
          className="art-carousel-stage"
          aria-live={isPlaying && !isHovered && !isFocused ? "off" : "polite"}
          aria-atomic="true"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onFocus={() => setIsFocused(true)}
          onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setIsFocused(false); }}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <motion.button className="art-carousel-image-button" type="button" onClick={() => setLightboxArtwork(artwork)} aria-label={`View ${artwork.title} full size`} whileHover={{ scale: 1.012 }} whileTap={{ scale: 0.995 }}>
            <AnimatePresence initial={false}>
              <motion.img className="art-transition-image" key={artwork.filename} src={assetUrl(`assets/concept-art/${artwork.filename}`)} alt={artwork.alt} initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={reduced ? undefined : { opacity: 0 }} transition={{ duration: reduced ? 0 : 1, ease: "easeInOut" }} fetchPriority={activeArtwork === 0 ? "high" : "auto"} />
            </AnimatePresence>
            <span className="art-fullsize-hint">Open full-size artwork ↗</span>
          </motion.button>
          <div className="art-carousel-copy">
            <p className="eyebrow">Featured image · {String(activeArtwork + 1).padStart(2, "0")} / {String(conceptArt.length).padStart(2, "0")}</p>
            <p className="art-topic-reference">{artwork.lecture} · {artwork.variant}</p>
            <h2>{artwork.title}</h2>
            <p className="art-carousel-description">{artwork.caption} <strong>What the image cannot show:</strong> {artwork.boundary}</p>
            <p className="image-credit">AI-generated with {artwork.tool}</p>
          </div>
        </motion.div>
        <div className="art-carousel-controls" aria-label="Slideshow controls">
          <button className="button button-secondary" type="button" onClick={() => changeArtwork(-1)} aria-label="Previous artwork">← Previous</button>
          <button className="button button-secondary" type="button" onClick={() => setIsPlaying((playing) => !playing)} aria-pressed={isPlaying}>
            {isPlaying ? "Pause slideshow" : "Play slideshow"}
          </button>
          <label className="art-slide-picker">
            <span>Slide {String(activeArtwork + 1).padStart(2, "0")} of {conceptArt.length}</span>
            <input type="range" min="0" max={conceptArt.length - 1} value={activeArtwork} aria-label="Choose a featured artwork" onChange={(event) => setActiveArtwork(Number(event.target.value))} />
          </label>
          <button className="button button-secondary" type="button" onClick={() => changeArtwork(1)} aria-label="Next artwork">Next →</button>
        </div>
      </section>

      <section className="prototype-art" aria-labelledby="all-art-title">
        <div className="prototype-art-heading">
          <p className="eyebrow">The full collection</p>
          <h2 id="all-art-title">Eleven ideas · twenty-two variations</h2>
          <p>Every image stays in the collection. Browse by lecture topic, compare the two visual takes, and open “View the NanoBanana Pro prompt” for the generation prompt used for that topic.</p>
        </div>
        <nav className="art-topic-index" aria-label="Jump to an artwork topic">
          {conceptArtTopics.map((topic) => <a key={topic.id} href={`#art-topic-${topic.id}`}>{topic.title}</a>)}
        </nav>
        <div className="art-topic-list">
          {conceptArtTopics.map((topic) => (
            <section className="art-topic-group" id={`art-topic-${topic.id}`} key={topic.id} aria-labelledby={`art-topic-title-${topic.id}`}>
              <div className="art-topic-heading">
                <div>
                  <p className="eyebrow">{topic.lecture}</p>
                  <h3 id={`art-topic-title-${topic.id}`}>{topic.title}</h3>
                </div>
                <p>{topic.caption}</p>
              </div>
              <div className="artwork-grid">
                {topic.images.map((item) => (
                  <motion.article className="artwork-card spotlight-card" key={item.id} onPointerMove={(event) => { const bounds = event.currentTarget.getBoundingClientRect(); event.currentTarget.style.setProperty("--spot-x", `${event.clientX - bounds.left}px`); event.currentTarget.style.setProperty("--spot-y", `${event.clientY - bounds.top}px`); }} whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
                    <button className="artwork-open" type="button" onClick={() => setLightboxArtwork(conceptArt.find((entry) => entry.id === item.id))} aria-label={`View ${item.title} full size`}>
                      <img src={assetUrl(`assets/concept-art/${item.filename}`)} alt={item.alt} loading="lazy" decoding="async" />
                      <span className="artwork-overlay">
                        <span className="artwork-overlay-kicker">{topic.lecture} · {item.variant}</span>
                        <span className="artwork-overlay-title">{item.title}</span>
                        <span className="artwork-overlay-copy">{item.alt}</span>
                        <span className="artwork-overlay-copy"><strong>Science note:</strong> {topic.boundary}</span>
                        <span className="artwork-overlay-action">Open full image ↗</span>
                      </span>
                    </button>
                    <div className="artwork-card-copy">
                      <p className="image-credit">AI-generated with {item.tool}</p>
                      {renderPromptDetails({ ...item, prompt: topic.prompt })}
                    </div>
                  </motion.article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>

      {lightboxArtwork && (
        <dialog
          ref={lightboxRef}
          className="art-lightbox"
          aria-labelledby="art-lightbox-title"
          onClose={() => setLightboxArtwork(null)}
          onClick={(event) => { if (event.target === event.currentTarget) event.currentTarget.close(); }}
        >
          <div className="art-lightbox-content">
            <button className="art-lightbox-close" type="button" onClick={() => lightboxRef.current?.close()} aria-label="Close full-size artwork">Close <span aria-hidden="true">×</span></button>
            <img src={assetUrl(`assets/concept-art/${lightboxArtwork.filename}`)} alt={lightboxArtwork.alt} />
            <div className="art-lightbox-caption">
              <div>
                <p className="eyebrow">{lightboxArtwork.lecture} · {lightboxArtwork.variant}</p>
                <h2 id="art-lightbox-title">{lightboxArtwork.title}</h2>
                <p>{lightboxArtwork.alt}</p>
              </div>
              <p className="image-credit">AI-generated with {lightboxArtwork.tool}</p>
            </div>
          </div>
        </dialog>
      )}

      <section className="art-emotions" aria-labelledby="qubi-emotions-title">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">Qubi's character</p>
            <h2 id="qubi-emotions-title">Six ways Qubi reacts</h2>
          </div>
          <p>Use these expressions as friendly story cues, not as literal pictures of quantum states.</p>
        </div>
        <div className="emotion-grid">
          {emotions.map((emotionItem, index) => (
            <button className={`emotion-card${activeEmotion === index ? " is-selected" : ""}`} key={emotionItem.name} type="button" aria-pressed={activeEmotion === index} onClick={() => setActiveEmotion(index)}>
              <div className="emotion-image" role="img" aria-label={`Qubi's ${emotionItem.name.toLowerCase()} expression`} style={{ backgroundPosition: `${emotionItem.position} 65%` }} />
              <span className="emotion-card-title">{emotionItem.name}</span>
              <span className="emotion-card-copy">{emotionItem.use}</span>
            </button>
          ))}
        </div>
        <QubiGuide mood={emotion.name.toLowerCase()} message={emotion.use} compact />
        <p className="metaphor-note"><strong>Metaphor note:</strong> Qubi's “Dizzy” expression is playful character art. Superposition is a quantum state, not a feeling or a visible spinning face.</p>
      </section>
    </main>
  );
}

function GlossaryPage() {
  const glossary = useMemo(() => Object.entries(glossaryDefinitions).sort(([a], [b]) => a.localeCompare(b)), []);

  const [query, setQuery] = useState("");
  const filtered = glossary.filter(([term, definition]) => `${term} ${definition}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <motion.main className="page-shell content-page glossary-page" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
      <div className="page-heading">
        <p className="eyebrow">Field Guide</p>
        <h1>Glossary</h1>
        <p>Plain-language definitions for terms used across Quantum Atlas.</p>
      </div>
      <label className="search-label" htmlFor="glossary-search">Find a term</label>
      <input id="glossary-search" className="glossary-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the glossary" />
      <dl className="glossary-list">
        {filtered.map(([term, definition], index) => (
          <motion.div className="glossary-entry" key={term} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.25, delay: Math.min(index * 0.025, 0.2) }}>
            <dt>{term}</dt>
            <dd>{definition}</dd>
          </motion.div>
        ))}
      </dl>
      {!filtered.length && <p>No matching terms. Try a shorter word.</p>}
    </motion.main>
  );
}

function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const reduced = useReducedMotion();
  return <motion.div className={`scroll-progress${reduced ? " is-reduced" : ""}`} style={{ scaleX: reduced ? 0 : scrollYProgress }} aria-hidden="true" />;
}

function ConfettiBurst({ active }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    if (!active || !canvasRef.current || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    let cancelled = false;
    let scope;
    void import("animejs").then(({ animate, createScope: makeScope }) => {
    if (cancelled || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(window.innerWidth * dpr);
    canvas.height = Math.round(window.innerHeight * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const colors = ["#45e85d", "#8298ff", "#ffc06a", "#f5f2ea", "#ff76c8"];
    const particles = Array.from({ length: 64 }, () => {
      const angle = Math.random() * Math.PI * 2;
      const distance = 160 + Math.random() * Math.min(window.innerWidth, 500) * 0.4;
      return {
        x: window.innerWidth / 2,
        y: window.innerHeight * 0.42,
        endX: window.innerWidth / 2 + Math.cos(angle) * distance,
        endY: window.innerHeight * 0.42 + Math.sin(angle) * distance + 180,
        rotation: 0,
        endRotation: (Math.random() - 0.5) * 12,
        opacity: 1,
        size: 3 + Math.random() * 6,
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    });
    scope = makeScope({ root: canvas });
    const draw = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      particles.forEach((particle) => {
        ctx.save();
        ctx.globalAlpha = particle.opacity;
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.rotation);
        ctx.fillStyle = particle.color;
        ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size * 1.65);
        ctx.restore();
      });
    };
    scope.add(() => {
      animate(particles, {
        x: (particle) => particle.endX,
        y: (particle) => particle.endY,
        rotation: (particle) => particle.endRotation,
        opacity: 0,
        duration: (particle, index) => 850 + (index % 10) * 35,
        ease: "out(4)",
        onUpdate: draw,
        onComplete: () => ctx.clearRect(0, 0, window.innerWidth, window.innerHeight),
      });
    });
    });
    return () => { cancelled = true; scope?.revert(); };
  }, [active]);
  return <canvas ref={canvasRef} className="cast-confetti" aria-hidden="true" />;
}

const projectMilestones = [
  {
    date: "23 September 2026",
    title: "The first spark",
    detail: "Damian proposed a website with short videos explaining quantum ideas. The project began with Damian and Riyaan; Markus joined the team later.",
    people: ["Damian", "Riyaan"],
  },
  {
    date: "5 October 2026",
    title: "A multimedia project",
    detail: "The instructor confirmed that the project could take a multimedia direction, opening the way for a website, videos, and visual material to work together.",
    people: ["Team"],
  },
  {
    date: "7 October 2026",
    title: "Qubi gets a face and a name",
    detail: "Damian proposed a mascot and the team made its first design video. Riyaan came up with the name Qubi.",
    people: ["Damian", "Riyaan"],
  },
  {
    date: "9–15 October 2026",
    title: "Scripts, locations, and first roles",
    detail: "The team planned filming locations and divided the work. Markus became the on-camera speaker; Riyaan took on the website and camera; Damian led editing and wrote Scripts 1 and 2. The scripts and locations were revised before filming.",
    people: ["Damian", "Markus", "Riyaan"],
  },
  {
    date: "11–12 October 2026",
    title: "The first prototype and scripts",
    detail: "Riyaan published the first website prototype on GitHub. Damian joined the repository as a collaborator, and Scripts 1 and 2 were ready.",
    people: ["Damian", "Riyaan"],
    links: [{ label: "View the first prototype", href: "https://github.com/Riyaan-UNI/CCST9077-26-27-SemOne/tree/main" }],
  },
  {
    date: "16–19 October 2026",
    title: "First filming, first edit, and a reshoot decision",
    detail: "The team recorded the first two scripts. Riyaan ran the camera through multiple takes and introduced a teleprompter to help the speaker. Damian edited the early footage; camera shake led the team to agree on a reshoot.",
    people: ["Damian", "Markus", "Riyaan"],
  },
  {
    date: "20–30 October 2026",
    title: "The team becomes four",
    detail: "After group registration opened, Cynthia joined following tutorial discussions with the team. All four registered as Group 1. Cynthia helped refine the scripts and wrote Scripts 3 and 4.",
    people: ["Cynthia", "Damian", "Markus", "Riyaan"],
  },
  {
    date: "31 October 2026",
    title: "A second day on camera",
    detail: "The team filmed Script 1 with Markus, then Script 3 with Cynthia as Alice and Markus as Bob.",
    people: ["Cynthia", "Damian", "Markus", "Riyaan"],
  },
  {
    date: "2–4 November 2026",
    title: "Reshooting, editing, and publishing three videos",
    detail: "Damian updated the earlier ‘Four People, One Robot’ build and shared the reshot Episode 1 edit. Riyaan helped Damian edit and assemble Episode 3, added music to Episodes 2 and 3, and Damian added subtitles and Qubi. The three videos went to YouTube on 4 November.",
    people: ["Damian", "Riyaan"],
  },
  {
    date: "5–13 November 2026",
    title: "Trying many versions of the website",
    detail: "Riyaan explored several visual directions, revising the site until the experience felt right. The branch history records those experiments.",
    people: ["Riyaan"],
    links: [
      { label: "UI refresh", href: "https://github.com/Riyaan-UNI/CCST9077-26-27-SemOne/tree/ui-refresh" },
      { label: "Quantum sci-fi UI", href: "https://github.com/Riyaan-UNI/CCST9077-26-27-SemOne/tree/feature/quantum-scifi-ui-overhaul" },
      { label: "Quantum observatory", href: "https://github.com/Riyaan-UNI/CCST9077-26-27-SemOne/tree/feature/quantum-observatory-reskin" },
      { label: "Quantum lost and found", href: "https://github.com/Riyaan-UNI/CCST9077-26-27-SemOne/tree/concept/quantum-lost-found" },
    ],
  },
  {
    date: "13–14 November 2026",
    title: "Recording the fourth episode",
    detail: "The team settled the location and plan. Riyaan filmed Cynthia as host, while Damian voiced Qubi and ran the teleprompter. The raw recording was uploaded that day.",
    people: ["Cynthia", "Damian", "Riyaan"],
  },
  {
    date: "14–21 November 2026",
    title: "One more major design search",
    detail: "Riyaan continued refining the earlier site and settled on the ‘Quantum Bureau Field Journal’ direction. Wanting a more game-like experience, Riyaan started a fresh repository for Quantum Atlas on 20 November.",
    people: ["Riyaan"],
    links: [{ label: "Quantum Bureau Field Journal", href: "https://github.com/Riyaan-UNI/CCST9077-26-27-SemOne/tree/concept/quantum-bureau-field-journal" }],
  },
  {
    date: "20–21 November 2026",
    title: "Building Quantum Atlas together",
    detail: "Riyaan shaped the game-like site step by step, using the lecture materials and notes as science references, and generated and curated 22 concept-art images with Google NanoBanana Pro. Riyaan drafted the story prompt and worked with AI on refinements and scene ideas; the team’s creative choices and science review remain human responsibilities.",
    people: ["Team", "Riyaan"],
    links: [{ label: "Open the Quantum Atlas repository", href: "https://github.com/Riyaan-UNI/quantum-atlas" }],
  },
];

function CreditsPage() {
  const reduced = useReducedMotion();
  const [activeCrew, setActiveCrew] = useState(-1);
  const [finale, setFinale] = useState(false);
  const [revealDone, setRevealDone] = useState(Boolean(reduced));
  const [secondsLeft, setSecondsLeft] = useState(5);
  const [run, setRun] = useState(0);
  const teamMembers = [
    {
      name: "Riyaan",
      fullName: "Patan Mohammed Riyaan",
      roles: ["Website development", "Video editing", "Qubi mascot work"],
      newRoles: ["Quantum Atlas creative direction and iterative design", "Camera, teleprompter, and music work", "Concept-art prompts and gallery curation", "Plot prompt and story development"],
      evidence: "website",
    },
    {
      name: "Damian",
      fullName: "Lau Long Yat Damian",
      roles: ["Original project idea", "Scripts 1 and 2", "Qubi's voice and mascot design", "Video editing"],
      evidence: "mascot",
    },
    {
      name: "Markus",
      fullName: "Doelvik Markus Skjerstad",
      roles: ["On-camera speaker", "Bob in the CHSH game video"],
      evidence: "speaker",
    },
    {
      name: "Cynthia",
      fullName: "Sun Siyan",
      roles: ["Scripts 3 and 4", "Alice in the CHSH game video", "Episode 4 host"],
      evidence: "scripts",
    },
  ];
  const releasedVideos = videos.filter((video) => !video.forthcoming);

  useEffect(() => {
    if (reduced) {
      setRevealDone(true);
      setActiveCrew(-1);
      setFinale(false);
      return undefined;
    }
    setRevealDone(false);
    setActiveCrew(0);
    setFinale(false);
    setSecondsLeft(5);
  }, [run, reduced]);

  useEffect(() => {
    if (reduced || revealDone || finale || activeCrew < 0) return undefined;
    const duration = 5000;
    const startedAt = Date.now();
    setSecondsLeft(5);
    const countdown = window.setInterval(() => {
      const remaining = Math.ceil((duration - (Date.now() - startedAt)) / 1000);
      setSecondsLeft(Math.max(1, remaining));
    }, 200);
    const advance = window.setTimeout(() => {
      if (activeCrew < teamMembers.length - 1) setActiveCrew(activeCrew + 1);
      else setFinale(true);
    }, duration);
    return () => {
      window.clearInterval(countdown);
      window.clearTimeout(advance);
    };
  }, [activeCrew, finale, reduced, revealDone, run]);

  useEffect(() => {
    if (!finale || reduced) return undefined;
    const timer = window.setTimeout(() => setRevealDone(true), 5000);
    return () => window.clearTimeout(timer);
  }, [finale, reduced, run]);

  const memberEvidence = (member) => {
    if (member.evidence === "website") return <img className="crew-reveal-art" src={assetUrl("assets/black-hole-scene.png")} alt="The black-hole artwork used for the website experience." />;
    if (member.evidence === "mascot") return <img className="crew-reveal-art crew-reveal-mascot" src={assetUrl("assets/qubi-reference-sheet.png")} alt="The Qubi model and expression sheet." />;
    if (member.evidence === "speaker") return <div className="crew-reveal-video-strip">{releasedVideos.map((video) => <img key={video.id} src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`} alt={`Video still from ${video.title}`} />)}</div>;
    return <div className="crew-reveal-script"><span>EPISODE SCRIPT · QUBI</span><blockquote>“Ooh, I love secrets!”</blockquote><small>Dialogue · science story · spoken performance</small></div>;
  };
  const advanceCrew = () => {
    if (activeCrew < 0) return;
    if (activeCrew < teamMembers.length - 1) setActiveCrew((current) => current + 1);
    else setFinale(true);
  };
  const skipReveal = () => { setRevealDone(true); setFinale(false); setActiveCrew(-1); };

  return (
    <main className="page-shell content-page credits-page">
      <AnimatePresence>
        {!revealDone && (
          <motion.div className="crew-reveal-overlay" key="crew-reveal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.42 }} aria-label="Introducing the project team">
            <div className="crew-reveal-stack" aria-hidden="true"><i /><i /><i /><i /></div>
            {!finale && activeCrew >= 0 && (
              <AnimatePresence mode="wait">
                <motion.article className="crew-reveal-card" key={teamMembers[activeCrew].name} initial={{ opacity: 0, y: 28, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, x: 100, y: -30, rotate: 3, scale: 0.98 }} transition={{ duration: 0.72, ease: [0.22, 0.8, 0.25, 1] }} aria-live="polite">
                  <p className="eyebrow">Crew member {String(activeCrew + 1).padStart(2, "0")} / 04</p>
                  <div className="crew-reveal-evidence">{memberEvidence(teamMembers[activeCrew])}</div>
                  <h2>{teamMembers[activeCrew].name}</h2>
                  <p>{teamMembers[activeCrew].fullName}</p>
                  <span className="crew-reveal-role">{[...teamMembers[activeCrew].roles, ...(teamMembers[activeCrew].newRoles ?? [])].join(" · ")}</span>
                </motion.article>
              </AnimatePresence>
            )}
            {finale && <motion.h2 className="crew-final-title" initial={{ opacity: 0, scale: 0.58, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: "spring", stiffness: 180, damping: 15 }}>Well, that was our cast.</motion.h2>}
            {finale && <ConfettiBurst active />}
            {!finale && activeCrew >= 0 && <div className="crew-reveal-controls">
              <p className="crew-countdown">Next reveal in <strong>{secondsLeft}</strong> {secondsLeft === 1 ? "second" : "seconds"}</p>
              <button className="crew-reveal-next" type="button" onClick={advanceCrew}>
                {activeCrew === teamMembers.length - 1 ? "Finish reveal" : "Next crew member"} <span aria-hidden="true">→</span>
              </button>
            </div>}
            <button className="crew-reveal-skip" type="button" onClick={skipReveal}>Skip introduction</button>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="page-heading">
        <p className="eyebrow">The people behind the project</p>
        <h1>About &amp; credits</h1>
        <p>Quantum Atlas is a four-person CCST9077 multimedia project about quantum information for non-specialists.</p>
      </div>
      <motion.section className="crew-finale" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <p className="eyebrow">A four-person production</p>
        <h2>Well, that was our cast.</h2>
        <p>Four different kinds of work came together to make Quantum Atlas.</p>
        <button className="button button-secondary" type="button" onClick={() => setRun((value) => value + 1)}>Replay the crew reveal</button>
      </motion.section>
      <section className="crew-board" aria-labelledby="crew-board-title">
        <div className="crew-board-heading">
          <div>
            <p className="eyebrow">A project made by four people</p>
            <h2 id="crew-board-title">Follow the work to the crew</h2>
          </div>
          <p>Each card pairs a real project artifact with the contribution behind it. The first row carries over the previous record; additions for this build are marked separately.</p>
        </div>
        <div className="crew-grid">
          {teamMembers.map((member, index) => (
            <motion.article className={`crew-card crew-card-${member.evidence}`} key={member.name} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.42, delay: index * 0.06 }}>
              <div className="crew-evidence">
                {member.evidence === "website" && (
                  <div className="crew-site-preview">
                    <img src={assetUrl("assets/black-hole-scene.png")} alt="The dark cinematic black-hole scene used in the Quantum Atlas experience." />
                    <div className="crew-site-window" aria-hidden="true">
                      <span>QUANTUM ATLAS</span>
                      <strong>Chart the unknown.</strong>
                      <small>Keep asking why.</small>
                    </div>
                  </div>
                )}
                {member.evidence === "mascot" && (
                  <img className="crew-mascot-sheet" src={assetUrl("assets/qubi-reference-sheet.png")} alt="The team's Qubi model sheet, showing mascot poses and six expressions." />
                )}
                {member.evidence === "speaker" && (
                  <div className="crew-video-strip" aria-label="The three released episode videos">
                    {releasedVideos.map((video) => (
                      <a key={video.id} href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noreferrer" aria-label={`Watch ${video.title}`}>
                        <img src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`} alt={`Episode image: ${video.title}`} loading="lazy" />
                      </a>
                    ))}
                    <span className="crew-evidence-label">ON CAMERA</span>
                  </div>
                )}
                {member.evidence === "scripts" && (
                  <div className="crew-script-page">
                    <p className="script-page-kicker">FROM THE EPISODE SCRIPT</p>
                    <blockquote>“Qubi: Ooh, I love secrets!”</blockquote>
                    <span>Dialogue · science story · spoken performance</span>
                  </div>
                )}
              </div>
              <div className="crew-card-copy">
                <p className="crew-index">CREW MEMBER {String(index + 1).padStart(2, "0")}</p>
                <h3>{member.name}</h3>
                <p className="crew-full-name">{member.fullName} · {member.name}</p>
                <div className="crew-role-group">
                  <p className="crew-role-label">Previous build</p>
                  <div className="crew-role-chips" aria-label={`${member.name}'s contributions carried over from the previous build`}>
                    {member.roles.map((role) => <span key={role}>{role}</span>)}
                  </div>
                </div>
                {member.newRoles?.length > 0 && <div className="crew-role-group">
                  <p className="crew-role-label">Added in this build</p>
                  <div className="crew-role-chips crew-role-chips-new" aria-label={`${member.name}'s added contributions in this build`}>
                    {member.newRoles.map((role) => <span key={role}>{role}</span>)}
                  </div>
                </div>}
              </div>
            </motion.article>
          ))}
        </div>
        <p className="crew-record-note">Previous-build roles are carried forward as provided. Current-build additions are marked separately where the contribution is documented.</p>
      </section>
      <section className="project-timeline" aria-labelledby="project-timeline-title">
        <header className="project-timeline-heading">
          <div>
            <p className="eyebrow">The work behind the finished experience</p>
            <h2 id="project-timeline-title">From first spark to Quantum Atlas</h2>
            <p>A record of the ideas, filming days, revisions, and people that shaped the project.</p>
          </div>
          <div className="timeline-facts" aria-label="Project duration and tracked hours">
            <p><strong>23 Sep–21 Nov 2026</strong><span>About eight and a half weeks</span></p>
            <p><strong>Hours not tracked</strong><span>We won’t invent a total from calendar dates.</span></p>
          </div>
        </header>
        <ol className="project-timeline-list">
          {projectMilestones.map((milestone, index) => (
            <motion.li className="timeline-milestone" key={`${milestone.date}-${milestone.title}`} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.35, delay: Math.min(index % 4, 3) * 0.05 }}>
              <div className="timeline-marker" aria-hidden="true"><span>{String(index + 1).padStart(2, "0")}</span></div>
              <article className="timeline-entry">
                <p className="timeline-date">{milestone.date}</p>
                <h3>{milestone.title}</h3>
                <p>{milestone.detail}</p>
                <p className="timeline-people"><span>Involved</span> {milestone.people.join(" · ")}</p>
                {milestone.links?.length > 0 && <details className="timeline-evidence">
                  <summary>Explore project evidence <span aria-hidden="true">↗</span></summary>
                  <ul>{milestone.links.map((link) => <li key={link.href}><a href={link.href} target="_blank" rel="noreferrer">{link.label}</a></li>)}</ul>
                </details>}
              </article>
            </motion.li>
          ))}
        </ol>
        <p className="timeline-closing">The current site is the latest chapter in a project shaped by repeated experiments, shared production work, and a lot of care.</p>
      </section>
      <section className="credits-section" id="ai-use">
        <h2>AI use</h2>
        <p>ChatGPT assisted with research and planning, design exploration, website coding and debugging, language edits, and refining Riyaan’s story prompt and scene ideas. Google NanoBanana Pro generated the concept-art images. The team set the creative direction, wrote and revised its project scripts, selected the final outputs, and takes responsibility for fact-checking the science.</p>
      </section>
      <section className="credits-section" aria-labelledby="technology-credits-title">
        <h2 id="technology-credits-title">Libraries and technologies</h2>
        <ul className="technology-credits">
          <li><strong>React 19</strong><span>Website interface</span></li>
          <li><strong>Vite 6</strong><span>Local development and production build</span></li>
          <li><strong>Motion for React</strong><span>Page, component, and interaction animation</span></li>
          <li><strong>Anime.js</strong><span>Small credits and story celebration effects</span></li>
          <li><strong>Animate.css</strong><span>Credits artifact entrance</span></li>
          <li><strong>Google Fonts</strong><span>Atkinson Hyperlegible and Space Grotesk</span></li>
          <li><strong>JavaScript, HTML, and CSS</strong><span>Application behavior, structure, and visual design</span></li>
          <li><strong>Cloudflare Workers</strong><span>Static-asset delivery and client-route fallback in the Sites deployment</span></li>
        </ul>
      </section>
      <section className="credits-section">
        <h2>Sources and media</h2>
        <p>The team’s CCST9077 lecture slides are the primary source for the course explanations. The art gallery’s concept-art content has been reviewed by the team.</p>
        <p>Three episode embeds are linked to the team’s supplied YouTube videos. The first three episode pages include transcripts based on the scripts used for those videos. Episode 4’s script is available, but its video link has not been supplied yet.</p>
      </section>
      <section className="credits-section">
        <h2>Story draft credit</h2>
        <p>The script draft and parts of the prompt material for “The Letter That Arrives Late” are credited to Patan Mohammed Riyaan (Riyaan). The team will rewrite the dialogue and verify the science against the course slides.</p>
      </section>
      <section className="credits-section">
        <h2>Accessibility</h2>
        <p>The site supports keyboard focus, reduced-motion preferences, and readable transcripts for Episodes 1–3. The player requests caption tracks when available; track availability and the full screen-size and zoom review are not verified here.</p>
      </section>
    </main>
  );
}

export function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [view, setView] = useState("home");
  const [topicId, setTopicId] = useState(null);
  const [episodeIndex, setEpisodeIndex] = useState(null);
  const [progressState, setProgressState] = useState(getInitialProgress);
  const [saveAvailable, setSaveAvailable] = useState(progressState.available);
  const progressIds = progressState.ids;

  const navigate = (nextView, nextEpisode = null) => {
    setTopicId(null);
    setEpisodeIndex(nextView === "episode" ? nextEpisode : null);
    setView(nextView);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const openTopic = (id) => {
    setTopicId(id);
    setEpisodeIndex(null);
    setView("topic");
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const markExplored = (id) => {
    const ids = [...new Set([...progressState.ids, id])];
    let available = true;
    try {
      localStorage.setItem("quantum-atlas-topics", JSON.stringify(ids));
    } catch {
      available = false;
    }
    setSaveAvailable(available);
    setProgressState({ ids, available });
  };

  const resetProgress = () => {
    if (!window.confirm("Reset your topic progress on this device?")) return;
    try {
      localStorage.removeItem("quantum-atlas-topics");
      setSaveAvailable(true);
    } catch {
      setSaveAvailable(false);
    }
    setProgressState((current) => ({ ...current, ids: [] }));
  };

  const progress = progressIds.length;
  const currentTopic = topics.find((topic) => topic.id === topicId);
  const routeKey = view === "topic" ? `topic-${topicId}` : view === "episode" ? `episode-${episodeIndex}` : view;
  const route = view === "home"
    ? <HomePage progress={progress} onNavigate={navigate} onEpisode={(index) => navigate("episode", index)} onTopic={openTopic} onStory={() => navigate("story")} />
    : view === "episodes"
      ? <EpisodeIndex onOpenEpisode={(index) => navigate("episode", index)} onTopic={openTopic} />
      : view === "episode"
        ? <EpisodePage index={episodeIndex} onBack={() => navigate("episodes")} onTopic={openTopic} onNext={(index) => navigate("episode", index)} />
        : view === "atlas"
          ? <AtlasPage progress={progress} progressIds={progressIds} onTopic={openTopic} />
          : view === "topic" && currentTopic
            ? <TopicPage topic={currentTopic} progressIds={progressIds} canSaveProgress={saveAvailable} onMarkExplored={markExplored} onNavigate={navigate} onTopic={openTopic} />
            : view === "story"
              ? <StoryApp onExit={() => navigate("home")} />
            : view === "art"
              ? <ArtPage />
              : view === "glossary"
                ? <GlossaryPage />
                : <CreditsPage />;

  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.28, ease: "easeOut" }}>
      <AnimatePresence initial={false}>
        {showIntro && <LoadingIntro key="loading-intro" onEnter={() => setShowIntro(false)} />}
      </AnimatePresence>
      <motion.div className="app-frame" initial={{ opacity: 0 }} animate={{ opacity: showIntro ? 0 : 1 }} transition={{ duration: showIntro ? 0 : 0.52 }} aria-hidden={showIntro} inert={showIntro}>
          <Header active={view === "topic" ? "atlas" : view === "episode" ? "episodes" : view} progress={progress} onNavigate={navigate} />
          {!showIntro && <ScrollProgress />}
          <AnimatePresence mode="wait" initial={false}>
            {!showIntro && <motion.div className="route-transition" key={routeKey} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
              {route}
            </motion.div>}
          </AnimatePresence>
          <Footer onNavigate={navigate} />
          {view !== "credits" && <button className="credits-shortcut" type="button" onClick={() => navigate("credits")} aria-label="Behind the signal: open team credits">
            <span className="credits-shortcut-icon" aria-hidden="true">✦</span>
            <span>Behind the signal</span>
          </button>}
          <details className="progress-settings">
            <summary>Progress settings</summary>
            <p>This count records topics you choose to mark explored. It does not measure mastery.</p>
            <button className="text-link" type="button" onClick={resetProgress}>Reset topic progress</button>
          </details>
      </motion.div>
    </MotionConfig>
  );
}
