import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  QUANTUM_ROUNDS,
  QUANTUM_WIN_RATE,
  SWITCH_ROUNDS,
  SWITCH_SEED,
  bestClassicalWinRate,
  makeChshTrials,
  makeSwitchTrials,
  runQuantumGame,
  sameSettingTrials,
} from "../sim/bell.js";
import {
  gameScene,
  lockedRooms,
  predictionLockScene,
  scene1Draft,
  scene2Draft,
  scene3Draft,
  scene7Draft,
  scene8Draft,
  storyActs,
  storyUI,
  switchTestScene,
} from "./scenes.js";
import { SceneArt } from "./SceneArt.jsx";
import {
  initialStoryState,
  persistStoryState,
  restoreStoryState,
  storyReducer,
} from "./state.js";

const gameSeed = 20261121;
const storyScenes = {
  arrival: scene1Draft,
  copyRoom: scene2Draft,
  preparedPair: scene3Draft,
  predictionLock: predictionLockScene,
  switchTest: switchTestScene,
  theGame: gameScene,
  report: scene7Draft,
  letter: scene8Draft,
};

function Dialogue({ line }) {
  if (!line) return null;
  return (
    <p className={`story-line${line.speaker === "Visitor" ? " is-visitor" : ""}`}>
      <strong>{line.speaker}</strong>
      <span>{line.text}</span>
    </p>
  );
}

function QubiNote({ text, mood = "curious" }) {
  const reduced = useReducedMotion();
  return (
    <motion.aside
      className="story-qubi-note"
      aria-label={`${storyUI.qubiLabel}: ${text}`}
      key={mood}
      initial={reduced ? false : { opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: reduced ? 0 : 0.22 }}
    >
      <span className={`story-qubi-face is-${mood}`} aria-hidden="true" />
      <p>{text}</p>
    </motion.aside>
  );
}

function EvidenceLedger({ entries }) {
  return (
    <aside className="story-ledger" aria-labelledby="story-ledger-title">
      <div className="story-ledger-heading">
        <p className="story-eyebrow">{storyUI.ledgerKicker}</p>
        <h2 id="story-ledger-title">{storyUI.ledgerTitle}</h2>
      </div>
      {entries.length === 0 ? (
        <p className="story-ledger-empty">{storyUI.ledgerEmpty}</p>
      ) : (
        <ol className="story-ledger-list">
          {entries.map((entry) => (
            <li key={entry.id}>
              <span className={`story-ledger-kind kind-${entry.kind}`}>{entry.label}</span>
              <p>{entry.text}</p>
            </li>
          ))}
        </ol>
      )}
    </aside>
  );
}

function SceneHeader({ scene, onExit, onReset, progress }) {
  return (
    <header className="story-heading">
      <div className="story-heading-copy">
        <p className="story-eyebrow">{scene.eyebrow}</p>
        <nav className="story-flow-nav" aria-label={storyUI.flowLabel}>
          <ol className="story-flow-steps">
            {storyActs.map((act) => (
              <li key={act.id} className={act.id < scene.act ? "is-complete" : ""} aria-current={act.id === scene.act ? "step" : undefined}>
                <span className="story-flow-number">{act.id}</span>
                <span><strong>{act.label}</strong><small>{act.scenes}</small></span>
              </li>
            ))}
          </ol>
        </nav>
        <p className="story-progress">{storyUI.storyProgress.replace("{current}", String(scene.number)).replace("{total}", "8")}</p>
                <h1 id="story-title" tabIndex={-1}>{scene.title}</h1>
        <p className="story-source"><span>{storyUI.sourceLabel}:</span> {scene.source}</p>
      </div>
      <div className="story-heading-actions">
        <button type="button" className="story-button story-button-quiet" onClick={onReset}>{storyUI.resetAction}</button>
        <button type="button" className="story-button story-button-quiet" onClick={onExit}>{storyUI.leaveAction}</button>
      </div>
      <progress className="story-progress-bar" value={scene.number} max="8" aria-label={progress} />
    </header>
  );
}

function OpeningScene({ scene, nextScene, dispatch }) {
  const [choiceId, setChoiceId] = useState("");
  const choice = scene.choices.find((item) => item.id === choiceId);
  const continueStory = () => {
    if (!choice) return;
    dispatch({ type: "LEARN", entry: { ...scene.ledger, label: storyUI.ledgerTypeKnown } });
    dispatch({ type: "GO", scene: nextScene });
  };

  return (
    <>
      <div className="story-dialogue">
        {scene.passages.map((line, index) => <Dialogue key={`${line.speaker}-${index}`} line={line} />)}
      </div>
      <fieldset className="story-scene-choice" aria-describedby="opening-scene-boundary">
        <legend>{scene.choiceHeading}</legend>
        <div className="story-scene-choice-list">
          {scene.choices.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`story-scene-choice-button${choiceId === option.id ? " is-selected" : ""}`}
              aria-pressed={choiceId === option.id}
              onClick={() => setChoiceId(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </fieldset>
      {choice && <div className="story-dialogue"><Dialogue line={{ speaker: "Qubi", text: choice.response }} /></div>}
      <p id="opening-scene-boundary" className="story-boundary-note">{scene.boundary}</p>
      <button type="button" className="story-button story-button-primary" disabled={!choice} onClick={continueStory}>
        {storyUI.continueAction}
      </button>
    </>
  );
}

function ReportScene({ ledger, dispatch }) {
  const [claimId, setClaimId] = useState("");
  const [filed, setFiled] = useState(false);
  const claim = scene7Draft.claims.find((item) => item.id === claimId);
  const requiredEntries = claim?.requiredEntries.map((id) => ledger.find((entry) => entry.id === id)) ?? [];
  const supported = Boolean(claim && requiredEntries.every(Boolean));
  const fileReport = () => {
    if (!claim) return;
    dispatch({
      type: "LEARN",
      entry: {
        ...scene7Draft.ledger,
        label: storyUI.ledgerTypeKnown,
        values: { claimId: claim.id, supported },
        text: `${claim.text} ${supported ? claim.verdict : scene7Draft.missingEvidenceVerdict}`,
      },
    });
    setFiled(true);
  };

  return (
    <>
      <div className="story-dialogue"><Dialogue line={scene7Draft.passages[0]} /></div>
      <fieldset className="story-report-claims">
        <legend>{scene7Draft.claimHeading}</legend>
        {scene7Draft.claims.map((item) => (
          <label className="story-report-claim" key={item.id}>
            <input type="radio" name="report-claim" value={item.id} checked={claimId === item.id} onChange={() => { setClaimId(item.id); setFiled(false); }} />
            <span>{item.text}</span>
          </label>
        ))}
      </fieldset>
      {claim && (
        <section className="story-evidence-check" aria-live="polite">
          <h2>{scene7Draft.evidenceHeading}</h2>
          <ul>
            {claim.requiredEntries.map((id, index) => (
              <li key={id} className={requiredEntries[index] ? "is-present" : "is-missing"}>
                <strong>{requiredEntries[index]?.label ?? scene7Draft.missingCardLabel}</strong>
                <span>{requiredEntries[index]?.text ?? scene7Draft.missingCardText}</span>
              </li>
            ))}
          </ul>
          <p className="story-report-verdict"><strong>{supported ? claim.verdict : scene7Draft.missingEvidenceVerdict}</strong> {claim.response}</p>
        </section>
      )}
      {!filed ? (
        <button type="button" className="story-button story-button-primary" disabled={!claim} onClick={fileReport}>{scene7Draft.fileAction}</button>
      ) : (
        <>
          <div className="story-dialogue"><Dialogue line={scene7Draft.passages[2]} /></div>
          <p className="story-status-note" role="status">{scene7Draft.filedStatus}</p>
          <button type="button" className="story-button story-button-primary" onClick={() => dispatch({ type: "GO", scene: "letter" })}>{scene7Draft.deliverAction}</button>
        </>
      )}
      <p className="story-boundary-note">{scene7Draft.boundary}</p>
    </>
  );
}

function LetterScene({ dispatch }) {
  return (
    <>
      <div className="story-dialogue">{scene8Draft.passages.map((line, index) => <Dialogue key={`${line.speaker}-${index}`} line={line} />)}</div>
      <p className="story-boundary-note">{scene8Draft.boundary}</p>
      <button type="button" className="story-button story-button-primary" onClick={() => dispatch({ type: "RESET" })}>{scene8Draft.closingAction}</button>
    </>
  );
}

function LockedRoomDialog({ state, dispatch, launchRef }) {
  const dialogRef = useRef(null);
  const selected = lockedRooms.find((room) => room.id === state.branchId);

  useEffect(() => {
    if (state.letter === "branchOpen" && dialogRef.current && !dialogRef.current.open) {
      dialogRef.current.showModal();
    }
  }, [state.letter]);

  const restoreFocus = () => {
    dispatch({ type: "CLOSE_BRANCH" });
    requestAnimationFrame(() => launchRef.current?.focus());
  };

  if (!selected) return null;

  return (
    <dialog ref={dialogRef} className="story-branch-dialog" aria-labelledby="story-branch-title" onClose={restoreFocus}>
      <p className="story-eyebrow">{selected.lecture}</p>
      <h2 id="story-branch-title">{selected.title}</h2>
      <p>{selected.description}</p>
      <p className="story-boundary-note">{storyUI.branchStub}</p>
      <button type="button" className="story-button story-button-primary" onClick={() => dialogRef.current?.close()}>
        {storyUI.branchCloseAction}
      </button>
    </dialog>
  );
}

function PredictionLock({ state, dispatch, launchRef }) {
  const prediction = state.predictions.switchTest ?? "";
  const locked = Boolean(state.lockedPredictions.switchTest);
  const selectedOption = predictionLockScene.prediction.options.find((option) => option.id === prediction);

  const savePrediction = () => {
    if (!selectedOption) return;
    dispatch({ type: "PREDICT", id: "switchTest", value: selectedOption.id, locked: true });
    dispatch({
      type: "LEARN",
      entry: {
        id: "switch-prediction",
        kind: "prediction",
        label: storyUI.ledgerTypePrediction,
        text: `${predictionLockScene.ledger.text} ${selectedOption.label}`,
      },
    });
  };

  const openBranch = (event, room) => {
    launchRef.current = event.currentTarget;
    dispatch({ type: "OPEN_BRANCH", branchId: room.id });
  };

  const goToRecord = (letterState) => {
    dispatch({ type: "LETTER", value: letterState });
    dispatch({ type: "GO", scene: "switchTest" });
  };

  return (
    <>
      <div className="story-dialogue">
        {predictionLockScene.passages.slice(0, locked ? 5 : 3).map((line, index) => (
          <Dialogue key={`${line.speaker}-${index}`} line={line} />
        ))}
      </div>
      <p className="story-status-note" role="status">{storyUI.recordInTransit}</p>

      <fieldset className="story-choice-fieldset" disabled={locked}>
        <legend>{predictionLockScene.prediction.label}</legend>
        {predictionLockScene.prediction.options.map((option) => (
          <label className="story-choice" key={option.id}>
            <input
              type="radio"
              name="switch-test-prediction"
              value={option.id}
              checked={prediction === option.id}
              onChange={() => dispatch({ type: "PREDICT", id: "switchTest", value: option.id, locked: false })}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </fieldset>

      <p className="story-boundary-note">{predictionLockScene.boundary}</p>
      <div className="story-action-row">
        {!locked && (
          <button type="button" className="story-button story-button-primary" disabled={!selectedOption} onClick={savePrediction}>
            {storyUI.lockPredictionAction}
          </button>
        )}
        {locked && <p className="story-inline-status" role="status">{storyUI.predictionLocked}</p>}
        {state.letter === "inTransit" && (
          <button type="button" className="story-button story-button-secondary" onClick={() => goToRecord("arrived")}>
            {storyUI.waitAction}
          </button>
        )}
        {state.letter === "inTransit" && (
          <button type="button" className="story-button story-button-text" onClick={() => dispatch({ type: "LETTER", value: "skipped" })}>
            {storyUI.skipAction}
          </button>
        )}
        {state.letter === "skipped" && (
          <>
            <p className="story-inline-status" role="status">{storyUI.recordSkipped}</p>
            <button type="button" className="story-button story-button-primary" onClick={() => goToRecord("arrived")}>
              {storyUI.skipToRecordAction}
            </button>
          </>
        )}
      </div>

      <section className="story-branches" aria-labelledby="story-branches-title">
        <div>
          <p className="story-eyebrow">{storyUI.branchKicker}</p>
          <h2 id="story-branches-title">{storyUI.branchHeading}</h2>
        </div>
        <p>{storyUI.branchDescription}</p>
        <div className="story-branch-list">
          {lockedRooms.map((room) => (
            <button key={room.id} type="button" className="story-branch-button" onClick={(event) => openBranch(event, room)}>
              <span>{room.title}</span><small>{room.lecture}</small>
            </button>
          ))}
        </div>
      </section>
    </>
  );
}

function SwitchChart({ trials }) {
  const groups = [0, 1].map((setting) => trials.filter((trial) => trial.settingBob === setting));
  const rates = groups.map((group) => group.length
    ? group.filter((trial) => trial.outcomeAlice === 1).length / group.length
    : 0);
  const margins = groups.map((group, index) => group.length
    ? 1.96 * Math.sqrt((rates[index] * (1 - rates[index])) / group.length)
    : 0);

  return (
    <figure className="story-chart" aria-labelledby="switch-chart-title">
      <figcaption id="switch-chart-title">{switchTestScene.chart.title}</figcaption>
      <div className="story-switch-bars" role="img" aria-label={storyUI.switchBarAlt}>
        {groups.map((group, index) => {
          const lower = Math.max(0, rates[index] - margins[index]);
          const upper = Math.min(1, rates[index] + margins[index]);
          return (
            <div className="story-switch-bar-column" key={index}>
              <div className="story-bar-track" aria-hidden="true">
                <span className="story-sampling-band" style={{ bottom: `${lower * 100}%`, height: `${(upper - lower) * 100}%` }} />
                <span className="story-data-bar" style={{ height: `${rates[index] * 100}%` }} />
              </div>
              <strong>{switchTestScene.chart.settingNames[index]}</strong>
              <span>{(rates[index] * 100).toFixed(1)}%</span>
              <small>{group.length} {storyUI.trialCount.toLowerCase()}</small>
            </div>
          );
        })}
      </div>
      <p className="story-chart-caption">{switchTestScene.chart.caption}</p>
      <p className="story-chart-note">{switchTestScene.chart.uncertainty}</p>
      <table className="story-sr-only">
        <caption>{storyUI.dataTableCaption}</caption>
        <thead><tr><th scope="col">{storyUI.settingColumn}</th><th scope="col">{storyUI.sampleSizeColumn}</th><th scope="col">{storyUI.fractionColumn}</th><th scope="col">{storyUI.samplingColumn}</th></tr></thead>
        <tbody>
          {groups.map((group, index) => (
            <tr key={index}>
              <th scope="row">{switchTestScene.chart.settingNames[index]}</th>
              <td>{group.length}</td>
              <td>{rates[index].toFixed(3)}</td>
              <td>{Math.max(0, rates[index] - margins[index]).toFixed(3)}–{Math.min(1, rates[index] + margins[index]).toFixed(3)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

function SameSettingPanel({ trials }) {
  const equalCount = trials.filter((trial) => trial.outcomeAlice === trial.outcomeBob).length;
  return (
    <figure className="story-chart story-pair-panel" aria-labelledby="same-setting-title">
      <figcaption id="same-setting-title">{switchTestScene.paired.title}</figcaption>
      <div className="story-pair-dots" aria-hidden="true">
        {trials.slice(0, 48).map((trial) => <span key={trial.id} className="story-pair-dot" />)}
      </div>
      <p className="story-pair-count">{equalCount} / {trials.length} {storyUI.agreementText}</p>
      <p className="story-chart-caption">{switchTestScene.paired.caption}</p>
      <p className="story-chart-note">{switchTestScene.paired.boundary}</p>
      <table className="story-sr-only">
        <caption>{switchTestScene.paired.title}</caption>
        <thead><tr><th scope="col">{storyUI.simulationType}</th><th scope="col">{storyUI.trialCount}</th><th scope="col">{storyUI.agreementColumn}</th></tr></thead>
        <tbody><tr><th scope="row">{switchTestScene.paired.caption}</th><td>{trials.length}</td><td>{equalCount / trials.length}</td></tr></tbody>
      </table>
    </figure>
  );
}

function EvidenceMap({ trials }) {
  const panels = [0, 1].flatMap((questionAlice) => [0, 1].map((questionBob) => {
    const group = trials.filter((trial) => trial.questionAlice === questionAlice && trial.questionBob === questionBob);
    const outcomes = [0, 1, 2, 3].map((pair) => group.filter((trial) => trial.answerAlice * 2 + trial.answerBob === pair).length);
    const agree = group.filter((trial) => trial.answerAlice === trial.answerBob).length;
    return { questionAlice, questionBob, group, outcomes, agree };
  }));

  return (
    <figure className="story-chart story-evidence-map" aria-labelledby="evidence-map-title">
      <figcaption id="evidence-map-title">{switchTestScene.map.title}</figcaption>
      <div className="story-map-grid" aria-hidden="true">
        {panels.map((panel) => (
          <section className="story-map-panel" key={`${panel.questionAlice}-${panel.questionBob}`}>
            <h3>{switchTestScene.map.questionNames[panel.questionAlice]} / {switchTestScene.map.questionNames[panel.questionBob]}</h3>
            <div className="story-outcome-lanes">
              {panel.outcomes.map((count, pair) => (
                <div className="story-outcome-lane" key={pair}>
                  <span className={`story-outcome-symbol outcome-${pair}`} />
                  <span>{count}</span>
                </div>
              ))}
            </div>
            <p>{panel.agree} / {panel.group.length} {storyUI.agreementShort}</p>
          </section>
        ))}
      </div>
      <ul className="story-map-legend" aria-label={storyUI.outcomePairLegend}>
        {switchTestScene.map.outcomeLabels.map((label, index) => <li key={label}><span className={`story-outcome-symbol outcome-${index}`} aria-hidden="true" />{label}</li>)}
      </ul>
      <p className="story-chart-caption">{switchTestScene.map.caption}</p>
      <p className="story-chart-note">{switchTestScene.map.pointCaption} {switchTestScene.map.summary}</p>
      <table className="story-sr-only">
        <caption>{storyUI.mapTableCaption}</caption>
        <thead><tr><th scope="col">{storyUI.questionPairLabel}</th>{switchTestScene.map.outcomeLabels.map((label) => <th key={label} scope="col">{label}</th>)}<th scope="col">{storyUI.agreementColumn}</th></tr></thead>
        <tbody>
          {panels.map((panel) => (
            <tr key={`${panel.questionAlice}-${panel.questionBob}`}>
              <th scope="row">{switchTestScene.map.questionNames[panel.questionAlice]} / {switchTestScene.map.questionNames[panel.questionBob]}</th>
              {panel.outcomes.map((count, index) => <td key={index}>{count}</td>)}
              <td>{panel.group.length ? `${(panel.agree / panel.group.length * 100).toFixed(1)}%` : "0%"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

function SwitchTest({ state, dispatch }) {
  const [revealed, setRevealed] = useState(false);
  const [paired, setPaired] = useState(false);
  const [mapVisible, setMapVisible] = useState(false);
  const [interpretation, setInterpretation] = useState("");
  const trials = useMemo(() => makeSwitchTrials(SWITCH_SEED, SWITCH_ROUNDS), []);
  const sameTrials = useMemo(() => sameSettingTrials(SWITCH_SEED, 64), []);
  const mapTrials = useMemo(() => makeChshTrials(SWITCH_SEED, SWITCH_ROUNDS), []);
  const groups = [0, 1].map((setting) => trials.filter((trial) => trial.settingBob === setting));
  const rates = groups.map((group) => group.length ? group.filter((trial) => trial.outcomeAlice === 1).length / group.length : 0);
  const margins = groups.map((group, index) => group.length ? 1.96 * Math.sqrt((rates[index] * (1 - rates[index])) / group.length) : 0);
  const storedPrediction = state.predictions.switchTest;

  const reveal = () => {
    setRevealed(true);
    dispatch({
      type: "LEARN",
      entry: {
        id: "switch-test",
        kind: "simulation",
        label: storyUI.ledgerTypeSimulation,
        seed: SWITCH_SEED,
        values: { n0: groups[0].length, n1: groups[1].length, p0: rates[0], p1: rates[1] },
        text: `${switchTestScene.ledger[0].text} ${switchTestScene.chart.settingNames[0]}: ${rates[0].toFixed(3)} (${groups[0].length} trials); ${switchTestScene.chart.settingNames[1]}: ${rates[1].toFixed(3)} (${groups[1].length} trials); seed ${SWITCH_SEED}.`,
      },
    });
  };

  const revealPairs = () => {
    setPaired(true);
    dispatch({ type: "LEARN", entry: { ...switchTestScene.ledger[1], label: storyUI.ledgerTypeSimulation, seed: SWITCH_SEED, values: { rounds: sameTrials.length } } });
  };

  const revealMap = () => {
    setMapVisible(true);
    dispatch({ type: "LEARN", entry: { ...switchTestScene.ledger[2], label: storyUI.ledgerTypeSimulation, seed: SWITCH_SEED, values: { rounds: mapTrials.length } } });
  };

  const prediction = predictionLockScene.prediction.options.find((option) => option.id === storedPrediction);
  const feedback = storedPrediction ? switchTestScene.predictionFeedback[storedPrediction] : switchTestScene.predictionFeedback.unsure;
  const switchFeedbackLine = interpretation === "signal" ? switchTestScene.passages[3] : switchTestScene.passages[4];

  return (
    <>
      <div className="story-dialogue">
        {switchTestScene.passages.slice(0, 2).map((line, index) => <Dialogue key={index} line={line} />)}
      </div>
      <p className="story-status-note" role="status">{storyUI.recordArrived}</p>
      <p className="story-boundary-note">{switchTestScene.boundary}</p>

      <section className="story-interaction" aria-labelledby="switch-activity-title">
        <div className="story-interaction-heading">
          <p className="story-eyebrow">{storyUI.simulationLabel}</p>
          <h2 id="switch-activity-title">{switchTestScene.chart.title}</h2>
        </div>
        <p>{storyUI.switchTestInstruction}</p>
        {revealed ? <SwitchChart trials={trials} /> : <p className="story-awaiting-data">{storyUI.dataHiddenMessage}</p>}
        {revealed && (
          <>
            {prediction && <p className="story-prediction-feedback"><strong>{storyUI.previousPredictionLabel}</strong> {prediction.label}<br />{feedback}</p>}
            <div className="story-action-row">
              <button type="button" className="story-button story-button-secondary" onClick={() => setInterpretation("signal")}>{storyUI.signalInterpretation}</button>
              <button type="button" className="story-button story-button-secondary" onClick={() => setInterpretation("noise")}>{storyUI.noiseInterpretation}</button>
            </div>
            {interpretation && <div className="story-dialogue"><Dialogue line={switchFeedbackLine} /><Dialogue line={switchTestScene.passages[5]} /><Dialogue line={switchTestScene.passages[6]} /></div>}
            {!paired && <button type="button" className="story-button story-button-primary" onClick={revealPairs}>{storyUI.pairedPanelAction}</button>}
          </>
        )}
        {!revealed && <button type="button" className="story-button story-button-primary" onClick={reveal}>{storyUI.localDataAction}</button>}
      </section>

      {paired && (
        <section className="story-interaction" aria-labelledby="paired-activity-title">
          <SameSettingPanel trials={sameTrials} />
          <div className="story-dialogue"><Dialogue line={switchTestScene.passages[7]} /><Dialogue line={switchTestScene.passages[8]} /></div>
          {!mapVisible && <button type="button" className="story-button story-button-primary" onClick={revealMap}>{storyUI.mapPanelAction}</button>}
        </section>
      )}

      {mapVisible && (
        <section className="story-interaction" aria-labelledby="evidence-map-title">
          <EvidenceMap trials={mapTrials} />
          <button type="button" className="story-button story-button-primary" onClick={() => dispatch({ type: "GO", scene: "theGame" })}>{storyUI.continueGameAction}</button>
        </section>
      )}

      <div aria-live="polite" className="story-sr-only">{revealed ? switchTestScene.chart.localSummary : ""}</div>
    </>
  );
}

function playerPlanWinCount(answers) {
  let wins = 0;
  for (const questionAlice of [0, 1]) {
    for (const questionBob of [0, 1]) {
      const answerAlice = Number(answers.mira[questionAlice]);
      const answerBob = Number(answers.sol[questionBob]);
      if ((answerAlice ^ answerBob) === (questionAlice & questionBob)) wins += 1;
    }
  }
  return wins;
}

function AnswerTable({ playerKey, title, answers, onChange }) {
  return (
    <fieldset className="story-answer-table">
      <legend>{title}</legend>
      <p>{gameScene.rules.progressHint}</p>
      <div className="story-answer-questions">
        {gameScene.rules.questions.map((question, index) => (
          <fieldset key={question} className="story-answer-question">
            <legend>{gameScene.rules.questionPrompt} {question}</legend>
            {gameScene.rules.answers.map((answer) => (
              <label key={answer}>
                <input
                  type="radio"
                  name={`${playerKey}-question-${question}`}
                  value={answer}
                  checked={answers[index] === answer}
                  onChange={() => onChange(index, answer)}
                />
                <span>{gameScene.rules.answerPrompt} {answer}</span>
              </label>
            ))}
          </fieldset>
        ))}
      </div>
    </fieldset>
  );
}

function GameScene({ dispatch, reduced }) {
  const [answers, setAnswers] = useState({ mira: ["", ""], sol: ["", ""] });
  const [planChecked, setPlanChecked] = useState(false);
  const [allChecked, setAllChecked] = useState(false);
  const [quantumResult, setQuantumResult] = useState(null);
  const [burst, setBurst] = useState(false);
  const verdictRef = useRef(null);
  const complete = answers.mira.every(Boolean) && answers.sol.every(Boolean);
  const displayedLines = quantumResult
    ? gameScene.passages.slice(0, 11)
    : allChecked
      ? [...gameScene.passages.slice(0, 4), gameScene.passages[5], gameScene.passages[6]]
      : planChecked
        ? [...gameScene.passages.slice(0, 5), gameScene.passages[5]]
        : gameScene.passages.slice(0, 4);

  const setAnswer = (player, index, answer) => {
    setAnswers((current) => ({ ...current, [player]: current[player].map((value, i) => i === index ? answer : value) }));
  };

  const checkPlan = () => {
    if (!complete) return;
    setPlanChecked(true);
  };

  const checkAll = () => {
    setAllChecked(true);
    const rate = bestClassicalWinRate();
    dispatch({ type: "LEARN", entry: { ...gameScene.ledger[0], label: storyUI.ledgerTypeKnown, rate } });
  };

  const playQuantum = async () => {
    const result = runQuantumGame(gameSeed, QUANTUM_ROUNDS);
    setQuantumResult(result);
    dispatch({
      type: "LEARN",
      entry: {
        ...gameScene.ledger[1],
        label: storyUI.ledgerTypeSimulation,
        seed: gameSeed,
        rate: result.rate,
        expectedRate: QUANTUM_WIN_RATE,
        wins: result.wins,
        rounds: result.rounds,
      },
    });
    if (reduced) return;
    try {
      const { animate } = await import("animejs");
      setBurst(true);
      animate(".game-spark", { opacity: [1, 0], translateY: [0, -14], duration: 420, ease: "outQuad" });
    } catch {
      setBurst(false);
    }
  };

  useEffect(() => {
    if (quantumResult) verdictRef.current?.focus();
  }, [quantumResult]);

  return (
    <>
      <div className="story-dialogue">
        {displayedLines.map((line, index) => <Dialogue key={`${line.speaker}-${index}`} line={line} />)}
      </div>
      <p className="story-boundary-note">{gameScene.boundary}</p>
      <p className="story-rule-note">{gameScene.rules.noSScore}</p>

      <div className="story-two-answer-tables">
        <AnswerTable playerKey="mira" title={gameScene.rules.playerAlice} answers={answers.mira} onChange={(index, answer) => setAnswer("mira", index, answer)} />
        <AnswerTable playerKey="sol" title={gameScene.rules.playerBob} answers={answers.sol} onChange={(index, answer) => setAnswer("sol", index, answer)} />
      </div>

      <div className="story-action-row">
        <button type="button" className="story-button story-button-secondary" onClick={checkPlan} disabled={!complete}>{storyUI.checkPlanAction}</button>
        <button type="button" className="story-button story-button-primary" onClick={checkAll}>{storyUI.checkAllPlansAction}</button>
      </div>
      {!complete && <p className="story-chart-note">{storyUI.enoughAnswersHint}</p>}
      {planChecked && complete && <p className="story-result-line"><strong>{storyUI.strategyResultLabel}:</strong> {playerPlanWinCount(answers)} / 4</p>}
      {allChecked && (
        <section className="story-game-result" aria-labelledby="all-plans-heading">
          <h2 id="all-plans-heading">{gameScene.rules.allPlansHeading}</h2>
          <p>{gameScene.rules.allPlansDetail}</p>
          <p><strong>{storyUI.allPlansResultLabel}:</strong> {bestClassicalWinRate() * 100}%</p>
        </section>
      )}

      <section className="story-quantum-play" aria-labelledby="quantum-play-title">
        <div className="story-interaction-heading">
          <p className="story-eyebrow">{storyUI.simulationLabel}</p>
          <h2 id="quantum-play-title">{storyUI.quantumGameTitle}</h2>
        </div>
        {!quantumResult ? (
          <button type="button" className="story-button story-button-primary" onClick={playQuantum}>{storyUI.playQuantumAction}</button>
        ) : (
          <>
            <h3 ref={verdictRef} tabIndex={-1} className="story-result-heading">{gameScene.rules.gameResultHeading}</h3>
            <div className="story-game-rates">
              <p><strong>{storyUI.gameRateLabel}:</strong> {quantumResult.wins} / {quantumResult.rounds} ({(quantumResult.rate * 100).toFixed(1)}%)</p>
              <p><strong>{gameScene.rules.expectedRateLabel}:</strong> {(quantumResult.expectedRate * 100).toFixed(1)}%</p>
            </div>
            <p>{gameScene.rules.gameExpectedExplanation}</p>
            <p className="story-chart-caption">{gameScene.rules.simulationCaption} {gameScene.rules.trialCount}: {quantumResult.rounds}; seed: {quantumResult.seed}.</p>
            {burst && <span className="game-spark spark-one" aria-hidden="true" />}
            {burst && <span className="game-spark spark-two" aria-hidden="true" />}
            <p className="story-wrap-up">{gameScene.boundary}</p>
          </>
        )}
      </section>
      <button type="button" className="story-button story-button-primary" onClick={() => dispatch({ type: "GO", scene: "report" })}>{storyUI.continueReportAction}</button>
    </>
  );
}

export function StoryApp({ onExit }) {
  const [state, dispatch] = useReducer(storyReducer, undefined, restoreStoryState);
  const reduced = useReducedMotion();
  const launchRef = useRef(null);
  const previousSceneRef = useRef(state.scene);
  const ledgerRef = useMemo(() => state.ledger.map((entry) => ({
    ...entry,
    label: entry.label || (entry.kind === "prediction" ? storyUI.ledgerTypePrediction : entry.kind === "simulation" ? storyUI.ledgerTypeSimulation : storyUI.ledgerTypeKnown),
  })), [state.ledger]);
  const activeScene = storyScenes[state.scene] ?? scene1Draft;

  useEffect(() => {
    persistStoryState(state);
  }, [state]);

  useEffect(() => {
    if (previousSceneRef.current === state.scene) return;
    previousSceneRef.current = state.scene;
    requestAnimationFrame(() => document.getElementById("story-title")?.focus());
  }, [state.scene]);

  const resetCase = () => dispatch({ type: "RESET" });

  return (
    <main className="page-shell content-page story-shell" aria-labelledby="story-title">
      <SceneHeader scene={activeScene} onExit={onExit} onReset={resetCase} progress={storyUI.storyNavProgress} />
      <p className="story-objective"><strong>{storyUI.objectiveLabel}:</strong> {activeScene.task}</p>
      <div className="story-layout">
        <div className="story-scene-column">
          <AnimatePresence mode="wait" initial={false}>
            <motion.section
              key={state.scene}
              className="story-scene-card"
              initial={reduced ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? undefined : { opacity: 0, y: -8 }}
              transition={{ duration: reduced ? 0 : 0.22 }}
              aria-label={activeScene.title}
            >
              <SceneArt key={activeScene.id} sceneId={activeScene.artId} />
              {state.scene === "arrival" ? (
                <OpeningScene scene={scene1Draft} nextScene="copyRoom" dispatch={dispatch} />
              ) : state.scene === "copyRoom" ? (
                <OpeningScene scene={scene2Draft} nextScene="preparedPair" dispatch={dispatch} />
              ) : state.scene === "preparedPair" ? (
                <OpeningScene scene={scene3Draft} nextScene="predictionLock" dispatch={dispatch} />
              ) : state.scene === "predictionLock" ? (
                <PredictionLock state={state} dispatch={dispatch} launchRef={launchRef} />
              ) : state.scene === "switchTest" ? (
                <SwitchTest state={state} dispatch={dispatch} />
              ) : state.scene === "theGame" ? (
                <GameScene dispatch={dispatch} reduced={Boolean(reduced)} />
              ) : state.scene === "report" ? (
                <ReportScene ledger={state.ledger} dispatch={dispatch} />
              ) : (
                <LetterScene dispatch={dispatch} />
              )}
            </motion.section>
          </AnimatePresence>
        </div>
        <EvidenceLedger entries={ledgerRef} />
      </div>
      <LockedRoomDialog state={state} dispatch={dispatch} launchRef={launchRef} />
      <p className="story-save-note" role="status">{storyUI.appStatus}</p>
    </main>
  );
}
