import { useEffect, useMemo, useState } from "react";

const videos = [
  {
    id: "ZNNB-lHQsfI",
    title: "The Magic Box",
    hook: "What changes when we measure a quantum bit?",
    runtime: "Video",
    topics: ["qubits", "measurement"],
  },
  {
    id: "vdufocF6Mjs",
    title: "Spooky Twins, No Messages",
    hook: "How can distant particles show linked results without sending a message?",
    runtime: "Video",
    topics: ["entanglement", "bell"],
  },
  {
    id: "8QNQDiFKVyg",
    title: "The Game Show That Broke Reality",
    hook: "Can a team win a game more often by using quantum correlations?",
    runtime: "Video",
    topics: ["bell"],
    titleNote: "The title is playful; the episode does not claim that experiments literally break reality.",
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

const getInitialProgress = () => {
  try {
    const stored = JSON.parse(localStorage.getItem("quantum-atlas-topics") || "[]");
    return { ids: Array.isArray(stored) ? stored : [], available: true };
  } catch {
    return { ids: [], available: false };
  }
};

function LoadingIntro({ onEnter }) {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);
    const update = () => setReduced(query.matches);
    query.addEventListener?.("change", update);
    return () => query.removeEventListener?.("change", update);
  }, []);

  return (
    <section className={`loading-intro${reduced ? " is-reduced" : ""}`} aria-label="Quantum Atlas opening screen">
      <img className="loader-scene" src="/assets/black-hole-scene.png" alt="" fetchPriority="high" loading="eager" />
      <img className="loader-ring" src="/assets/accretion-ring.png" alt="" fetchPriority="high" loading="eager" />
      <div className="loader-vignette" aria-hidden="true" />
      <div className="loader-copy">
        <div className="launch-brand-block">
          <p className="loader-brand">Quantum Atlas</p>
          <p className="loader-tagline">Chart the unknown. Keep asking why.</p>
        </div>
        <div className="launch-invitation">
          <p className="launch-coordinate">QUANTUM INFORMATION · 11 TOPICS</p>
          <p className="loader-status">A new universe of questions is waiting.</p>
          <p className="launch-support">Watch the films, explore the course map, or browse the art. No physics background needed.</p>
          <button className="skip-loader" type="button" onClick={onEnter} autoFocus>
            Enter the Atlas <span aria-hidden="true">↗</span>
          </button>
        </div>
      </div>
      <img className="loader-qubi" src="/assets/qubi-3d-clean-320.png" alt="Qubi, your curious guide" />
      <p className="launch-note">Press Enter or select “Enter the Atlas” to begin.</p>
    </section>
  );
}

function Header({ active, progress, onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [
    ["home", "Home"],
    ["episodes", "Episodes"],
    ["atlas", "Atlas"],
    ["art", "Art"],
  ];

  const choose = (view) => {
    onNavigate(view);
    setMenuOpen(false);
  };

  return (
    <header className="site-header">
      <button className="wordmark" type="button" onClick={() => choose("home")} aria-label="Quantum Atlas home">
        <span>Quantum Atlas</span>
        <span className="wordmark-dot" aria-hidden="true" />
      </button>
      <button
        className="menu-toggle"
        type="button"
        aria-expanded={menuOpen}
        aria-controls="primary-navigation"
        onClick={() => setMenuOpen((open) => !open)}
      >
        {menuOpen ? "Close menu" : "Menu"}
      </button>
      <nav id="primary-navigation" className={`primary-nav${menuOpen ? " is-open" : ""}`} aria-label="Main navigation">
        {links.map(([view, label]) => (
          <button
            className={active === view ? "nav-link is-active" : "nav-link"}
            type="button"
            key={view}
            onClick={() => choose(view)}
            aria-current={active === view ? "page" : undefined}
          >
            {label}
          </button>
        ))}
      </nav>
      <button className="progress-pill" type="button" onClick={() => choose("atlas")} aria-label={`${progress} of 11 topics explored. Open the Atlas.`}>
        Topics <span>{progress}/11</span>
      </button>
    </header>
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

function HomePage({ progress, onNavigate, onEpisode, onTopic }) {
  return (
    <main className="page-shell home-page">
      <section className="home-intro">
        <div className="intro-copy">
          <p className="eyebrow">Your exploration begins here</p>
          <h1>Chart the unknown.<br /><span>Keep asking why.</span></h1>
          <p className="home-promise">Four short films and an illustrated guide to quantum information. No physics background needed.</p>
          <p className="route-label">Choose your route</p>
          <div className="door-actions">
            <button className="route-door route-door-primary" type="button" onClick={() => onEpisode(0)}>
              <span className="route-door-index">01 / WATCH</span><strong>Episode 1</strong><span>The Magic Box</span>
            </button>
            <button className="route-door" type="button" onClick={() => onNavigate("atlas")}>
              <span className="route-door-index">02 / EXPLORE</span><strong>Topic map</strong><span>11 course ideas</span>
            </button>
            <button className="route-door" type="button" onClick={() => onNavigate("art")}>
              <span className="route-door-index">03 / VIEW</span><strong>Artwork</strong><span>Images and meaning</span>
            </button>
          </div>
          <p className="home-progress-note">{progress} of 11 topics marked explored · no scores, no locked paths</p>
        </div>
        <div className="home-mascot-wrap">
          <img className="home-mascot" src="/assets/qubi-3d-clean-512.png" alt="Qubi, your curious guide" />
        </div>
      </section>

      <section className="featured-episode" aria-labelledby="featured-heading">
        <div className="featured-player">
          <iframe
            src="https://www.youtube-nocookie.com/embed/ZNNB-lHQsfI?cc_load_policy=1&rel=0"
            title="CCST9077 Episode 1 — The Magic Box"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
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
      </section>

      <section className="topic-peek" aria-labelledby="topics-peek-heading">
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
      </section>

      <section className="art-teaser">
        <div>
          <p className="eyebrow">A visual field guide</p>
          <h2>Ideas you can see, question, and revisit.</h2>
          <p>Explore the Qubi character sheet and the visual language behind the project.</p>
        </div>
        <button className="button button-secondary" type="button" onClick={() => onNavigate("art")}>Browse artwork</button>
      </section>
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
      <div className="episode-list">
        {videos.map((episode, index) => (
          <article className="episode-row" key={episode.id}>
            <button className="episode-number" type="button" onClick={() => onOpenEpisode(index)} aria-label={`Open episode ${index + 1}`}>
              {String(index + 1).padStart(2, "0")}
            </button>
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
          </article>
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
    <main className="page-shell content-page episode-page">
      <button className="back-link" type="button" onClick={onBack}>← Episodes</button>
      <div className="page-heading episode-heading">
        <p className="eyebrow">Episode {index + 1}</p>
        <h1>{episode.title}</h1>
        <p>{episode.hook}</p>
        {episode.titleNote && <p className="science-note">{episode.titleNote}</p>}
      </div>
      <div className="episode-player">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${episode.id}?cc_load_policy=1&rel=0`}
          title={`CCST9077 Episode ${index + 1} — ${episode.title}`}
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      </div>
      <p className="key-idea-line"><strong>Key question:</strong> {episode.hook}</p>
      <div className="transcript-panel">
        <p className="eyebrow">Captions and transcript</p>
        <p>Use the caption controls in the player when a caption track is available. The team should add and verify the transcript before final submission.</p>
        <a href={`https://www.youtube.com/watch?v=${episode.id}`} target="_blank" rel="noreferrer">Open this episode on YouTube</a>
      </div>
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

function TopicPage({ topic, progressIds, canSaveProgress, onMarkExplored, onNavigate, onTopic }) {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const alreadyMarked = progressIds.includes(topic.id);

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
        <p className="idea-copy">{topic.idea}</p>
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
        <button className="button button-secondary" type="button" disabled={alreadyMarked} onClick={() => onMarkExplored(topic.id)}>
          {alreadyMarked ? "Marked explored" : "Mark topic explored"}
        </button>
      </section>
      <p className="source-line">The course lecture is the primary source. This short explanation is a prototype draft for team science review.</p>
    </main>
  );
}

function ArtPage() {
  return (
    <main className="page-shell content-page art-page">
      <div className="page-heading">
        <p className="eyebrow">Images and ideas</p>
        <h1>Artwork</h1>
        <p>See how the project uses visual storytelling to introduce quantum information.</p>
      </div>
      <article className="art-feature">
        <img src="/assets/qubi-reference-sheet.png" alt="Qubi character sheet showing front, three-quarter, side, and back views, with happy, curious, surprised, thinking, excited, and dizzy expressions." />
        <div className="art-feature-copy">
          <p className="eyebrow">Character reference</p>
          <h2>Meet Qubi</h2>
          <p>The supplied model sheet is the visual reference for Qubi's cream CRT head, dark screen, green pixel face, and forest-green shirt.</p>
          <p className="image-credit">Provided by the project team · Original Qubi reference sheet</p>
        </div>
      </article>
      <section className="prototype-art" aria-labelledby="prototype-art-title">
        <div className="prototype-art-heading">
          <p className="eyebrow">Prototype visuals</p>
          <h2 id="prototype-art-title">Images that shape the interface</h2>
          <p>These are website assets, not course diagrams. Their tools and prompts are listed openly. The upcoming lecture-art series is still for the team to create with Google NanoBanana.</p>
        </div>
        <article className="prototype-art-entry">
          <img src="/assets/black-hole-scene.png" alt="A dark event horizon with a luminous amber and blue accretion ring against a star field; used as atmosphere for the website's loading animation." />
          <div>
            <h3>Black-hole loading scene</h3>
            <p className="image-credit">Generated with OpenAI Image Generation · interface atmosphere, not a scientific diagram.</p>
            <details className="prompt-disclosure">
              <summary>View the prompt</summary>
              <p>A cinematic but restrained black-hole scene: large central dark event horizon, horizontal tilted luminous accretion ring with amber and cool blue bands, subtle gravitational lensing, deep navy-black starfield with restrained stars. Keep the black hole centered and leave the upper and lower center relatively quiet for later live website text and controls. The image is a decorative loading-screen atmosphere, not a scientific diagram or a claim that a black hole is a portal. No beams that suggest messages travel through the hole. Compose to crop gracefully on wide desktop and vertical mobile, keeping the dark center visible.</p>
            </details>
          </div>
        </article>
        <article className="prototype-art-entry">
          <img className="ring-preview" src="/assets/accretion-ring.png" alt="A tilted amber-and-blue accretion ring on a transparent background, layered over the black-hole loading scene." />
          <div>
            <h3>Accretion-ring layer</h3>
            <p className="image-credit">Generated with OpenAI Image Generation · animation layer for the loading scene.</p>
            <details className="prompt-disclosure">
              <summary>View the prompt</summary>
              <p>A luminous, thin tilted oval accretion-ring streak with amber and cool blue light, matching the black-hole loading scene. Transparent background including the interior of the oval and all surrounding space; no black disk, stars, landscape, text, Qubi, symbols, border, or frame. Long directional streaks, modest brightness, crisp edges, overlaid on dark navy. This is interface art, not a scientific diagram.</p>
            </details>
          </div>
        </article>
        <article className="prototype-art-entry">
          <img className="qubi-preview" src="/assets/qubi-3d-clean-512.png" alt="A friendly 3D-style Qubi render based on the supplied model sheet, wearing the green shirt and raising one hand." />
          <div>
            <h3>Qubi 3D-style prototype render</h3>
            <p className="image-credit">Generated with OpenAI Image Generation from the team's supplied character reference.</p>
            <details className="prompt-disclosure">
              <summary>View the prompt</summary>
              <p>Create one full-body 3D-style mascot render of Qubi for Quantum Atlas, matching the supplied character sheet: rounded vintage cream CRT head, dark screen, bright green pixel eyes and smile, small green indicator button, short rounded arms and legs, deep forest-green shirt marked HKU, and white rounded gloves and shoes. Use a friendly curious three-quarter pose with one hand raised. Preserve the reference proportions and simple expression; add no antennae, armor, or accessories. Render as a polished soft 3D toy with warm diffuse light and transparent background.</p>
            </details>
          </div>
        </article>
      </section>
      <div className="art-collection-note">
        <h2>The lecture-art gallery is ready for the team's images</h2>
        <p>As the team creates its NanoBanana artwork, each image can include a short caption, its lecture connection, a visible Google NanoBanana credit, and the full prompt.</p>
      </div>
    </main>
  );
}

function GlossaryPage() {
  const glossary = useMemo(() => {
    const definitions = {
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
    return Object.entries(definitions).sort(([a], [b]) => a.localeCompare(b));
  }, []);

  const [query, setQuery] = useState("");
  const filtered = glossary.filter(([term, definition]) => `${term} ${definition}`.toLowerCase().includes(query.toLowerCase()));

  return (
    <main className="page-shell content-page glossary-page">
      <div className="page-heading">
        <p className="eyebrow">Field Guide</p>
        <h1>Glossary</h1>
        <p>Plain-language definitions for terms used across Quantum Atlas.</p>
      </div>
      <label className="search-label" htmlFor="glossary-search">Find a term</label>
      <input id="glossary-search" className="glossary-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the glossary" />
      <dl className="glossary-list">
        {filtered.map(([term, definition]) => (
          <div className="glossary-entry" key={term}>
            <dt>{term}</dt>
            <dd>{definition}</dd>
          </div>
        ))}
      </dl>
      {!filtered.length && <p>No matching terms. Try a shorter word.</p>}
    </main>
  );
}

function CreditsPage() {
  return (
    <main className="page-shell content-page credits-page">
      <div className="page-heading">
        <p className="eyebrow">The people behind the project</p>
        <h1>About &amp; credits</h1>
        <p>Quantum Atlas is a four-person CCST9077 multimedia project about quantum information for non-specialists.</p>
      </div>
      <section className="credits-section">
        <h2>Team contributions</h2>
        <p>Replace these prompts with each member's actual name and substantial contribution before submission.</p>
        <ul className="contribution-list">
          <li><strong>Team member 1</strong><span>Add name and specific contribution.</span></li>
          <li><strong>Team member 2</strong><span>Add name and specific contribution.</span></li>
          <li><strong>Team member 3</strong><span>Add name and specific contribution.</span></li>
          <li><strong>Team member 4</strong><span>Add name and specific contribution.</span></li>
        </ul>
      </section>
      <section className="credits-section" id="ai-use">
        <h2>AI use</h2>
        <p>AI tools assisted with the website prototype and with the Qubi and black-hole interface visuals shown here. The team must add its complete, accurate statement covering all tools used for the submitted videos, scripts, artwork, and writing.</p>
      </section>
      <section className="credits-section">
        <h2>Sources and media</h2>
        <p>CCST9077 lecture slides are the primary source for course explanations. Add the team's permitted lecture-slide citations and public research references before final submission.</p>
        <p>Three episode embeds are linked to the team's supplied YouTube videos. Add the fourth video URL when available.</p>
      </section>
      <section className="credits-section">
        <h2>Accessibility</h2>
        <p>The prototype is designed for keyboard use, reduced motion, and responsive reflow. Caption tracks and team-reviewed transcripts need to be confirmed for every published video before final release.</p>
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
    window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };

  const openTopic = (id) => {
    setTopicId(id);
    setEpisodeIndex(null);
    setView("topic");
    window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
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

  return (
    <>
      {showIntro ? (
        <LoadingIntro onEnter={() => setShowIntro(false)} />
      ) : (
        <div className="app-frame">
          <Header active={view === "topic" ? "atlas" : view === "episode" ? "episodes" : view} progress={progress} onNavigate={navigate} />
          {view === "home" && <HomePage progress={progress} onNavigate={navigate} onEpisode={(index) => navigate("episode", index)} onTopic={openTopic} />}
          {view === "episodes" && <EpisodeIndex onOpenEpisode={(index) => navigate("episode", index)} onTopic={openTopic} />}
          {view === "episode" && <EpisodePage index={episodeIndex} onBack={() => navigate("episodes")} onTopic={openTopic} onNext={(index) => navigate("episode", index)} />}
          {view === "atlas" && <AtlasPage progress={progress} progressIds={progressIds} onTopic={openTopic} />}
          {view === "topic" && currentTopic && <TopicPage topic={currentTopic} progressIds={progressIds} canSaveProgress={saveAvailable} onMarkExplored={markExplored} onNavigate={navigate} onTopic={openTopic} />}
          {view === "art" && <ArtPage />}
          {view === "glossary" && <GlossaryPage />}
          {view === "credits" && <CreditsPage />}
          <Footer onNavigate={navigate} />
          <details className="progress-settings">
            <summary>Progress settings</summary>
            <p>This count records topics you choose to mark explored. It does not measure mastery.</p>
            <button className="text-link" type="button" onClick={resetProgress}>Reset topic progress</button>
          </details>
        </div>
      )}
    </>
  );
}
