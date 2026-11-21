import assert from "node:assert/strict";
import test from "node:test";
import {
  ALICE,
  BOB,
  QUANTUM_WIN_RATE,
  SWITCH_ROUNDS,
  SWITCH_SEED,
  bestClassicalWinRate,
  chooseSwitchSeed,
  makeSwitchTrials,
  mulberry32,
  runQuantumGame,
  sameSettingTrials,
  samplePair,
  switchDifference,
} from "./bell.js";

test("the deterministic local strategies reach at most 75%", () => {
  assert.equal(bestClassicalWinRate(), 0.75);
});

test("the lecture's quantum game win rate is cos squared of pi over eight", () => {
  assert.ok(Math.abs(QUANTUM_WIN_RATE - Math.cos(Math.PI / 8) ** 2) < 1e-9);
});

test("local marginals remain balanced for every CHSH angle pair", () => {
  const samples = 100_000;
  for (const angleAlice of ALICE) {
    for (const angleBob of BOB) {
      const random = mulberry32(20261121);
      let onesAlice = 0;
      let onesBob = 0;
      for (let index = 0; index < samples; index += 1) {
        const [a, b] = samplePair(random, angleAlice, angleBob);
        onesAlice += a;
        onesBob += b;
      }
      assert.ok(Math.abs(onesAlice / samples - 0.5) < 0.01);
      assert.ok(Math.abs(onesBob / samples - 0.5) < 0.01);
    }
  }
});

test("ideal same-setting trials agree in every simulated round", () => {
  const trials = sameSettingTrials(20261121, 10_000);
  assert.equal(trials.length, 10_000);
  assert.ok(trials.every((trial) => trial.outcomeAlice === trial.outcomeBob));
  assert.ok(trials.every((trial) => trial.source === "simulation"));
});

test("the selected Switch Test seed is frozen and reproducible", () => {
  assert.ok(SWITCH_SEED >= 20261121);
  assert.deepEqual(makeSwitchTrials(SWITCH_SEED), makeSwitchTrials(SWITCH_SEED));
  const measured = switchDifference(makeSwitchTrials(SWITCH_SEED));
  assert.ok(measured.difference <= measured.standardError);
  assert.equal(chooseSwitchSeed(20261121), SWITCH_SEED);
  assert.equal(makeSwitchTrials(SWITCH_SEED).length, SWITCH_ROUNDS);
});

test("the quantum game is reproducible for the same seed", () => {
  assert.deepEqual(runQuantumGame(20261121), runQuantumGame(20261121));
});
