export const SWITCH_START_SEED = 20261121;
export const SWITCH_ROUNDS = 400;
export const QUANTUM_ROUNDS = 200;

export const ALICE = [0, Math.PI / 4];
export const BOB = [Math.PI / 8, -Math.PI / 8];
export const QUANTUM_WIN_RATE = Math.cos(Math.PI / 8) ** 2;

export function mulberry32(seed) {
  let value = seed >>> 0;
  return () => {
    value = (value + 0x6d2b79f5) >>> 0;
    let mixed = value;
    mixed = Math.imul(mixed ^ (mixed >>> 15), mixed | 1);
    mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61);
    return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
  };
}

// Bell pair |Phi+>: each local outcome is balanced and P(equal) = cos²(alpha - beta).
export function samplePair(random, angleAlice, angleBob) {
  const outcomeAlice = random() < 0.5 ? 0 : 1;
  const equal = random() < Math.cos(angleAlice - angleBob) ** 2;
  return [outcomeAlice, equal ? outcomeAlice : 1 - outcomeAlice];
}

export function quantumRound(random, questionAlice, questionBob) {
  const [answerAlice, answerBob] = samplePair(
    random,
    ALICE[questionAlice],
    BOB[questionBob],
  );
  return {
    questionAlice,
    questionBob,
    answerAlice,
    answerBob,
    won: (answerAlice ^ answerBob) === (questionAlice & questionBob),
  };
}

export function bestClassicalWinRate() {
  let bestWins = 0;
  for (let alicePlan = 0; alicePlan < 4; alicePlan += 1) {
    for (let bobPlan = 0; bobPlan < 4; bobPlan += 1) {
      let wins = 0;
      for (const questionAlice of [0, 1]) {
        for (const questionBob of [0, 1]) {
          const answerAlice = (alicePlan >> questionAlice) & 1;
          const answerBob = (bobPlan >> questionBob) & 1;
          if ((answerAlice ^ answerBob) === (questionAlice & questionBob)) wins += 1;
        }
      }
      bestWins = Math.max(bestWins, wins);
    }
  }
  return bestWins / 4;
}

export function runQuantumGame(seed = SWITCH_START_SEED, rounds = QUANTUM_ROUNDS) {
  const random = mulberry32(seed);
  let wins = 0;
  const trials = Array.from({ length: rounds }, (_, index) => {
    const questionAlice = random() < 0.5 ? 0 : 1;
    const questionBob = random() < 0.5 ? 0 : 1;
    const trial = quantumRound(random, questionAlice, questionBob);
    if (trial.won) wins += 1;
    return { id: index, ...trial, source: "simulation", seed };
  });

  return {
    wins,
    rounds,
    rate: rounds ? wins / rounds : 0,
    expectedRate: QUANTUM_WIN_RATE,
    seed,
    trials,
  };
}

export function makeSwitchTrials(seed = SWITCH_SEED, rounds = SWITCH_ROUNDS) {
  const random = mulberry32(seed);
  return Array.from({ length: rounds }, (_, id) => {
    const settingAlice = random() < 0.5 ? 0 : 1;
    const settingBob = random() < 0.5 ? 0 : 1;
    const [outcomeAlice, outcomeBob] = samplePair(
      random,
      ALICE[settingAlice],
      BOB[settingBob],
    );
    return {
      id,
      settingAlice,
      settingBob,
      outcomeAlice,
      outcomeBob,
      source: "simulation",
      seed,
    };
  });
}

export function localOneRate(trials, remoteSetting) {
  const group = trials.filter((trial) => trial.settingBob === remoteSetting);
  if (!group.length) return 0;
  return group.filter((trial) => trial.outcomeAlice === 1).length / group.length;
}

export function switchDifference(trials) {
  const groups = [0, 1].map((setting) => trials.filter((trial) => trial.settingBob === setting));
  const rates = groups.map((group) => (
    group.length ? group.filter((trial) => trial.outcomeAlice === 1).length / group.length : 0
  ));
  const standardError = Math.sqrt(groups.reduce((sum, group, index) => {
    const n = group.length;
    const p = rates[index];
    return n ? sum + (p * (1 - p)) / n : sum;
  }, 0));
  return { groups, rates, difference: Math.abs(rates[0] - rates[1]), standardError };
}

// Start at 20261121; increment until the simulated local-rate difference is <= 1 SE(diff).
// This freezes a visually ordinary teaching sample without claiming the two finite bars are identical.
export function chooseSwitchSeed(startSeed = SWITCH_START_SEED, rounds = SWITCH_ROUNDS) {
  let seed = startSeed;
  while (true) {
    const difference = switchDifference(makeSwitchTrials(seed, rounds));
    if (difference.difference <= difference.standardError) return seed;
    seed += 1;
  }
}

export const SWITCH_SEED = chooseSwitchSeed();

export function sameSettingTrials(seed = SWITCH_SEED, rounds = SWITCH_ROUNDS) {
  const random = mulberry32(seed);
  return Array.from({ length: rounds }, (_, id) => {
    const [outcomeAlice, outcomeBob] = samplePair(random, ALICE[0], ALICE[0]);
    return {
      id,
      settingAlice: "A",
      settingBob: "A",
      outcomeAlice,
      outcomeBob,
      source: "simulation",
      seed,
    };
  });
}

export function makeChshTrials(seed = SWITCH_START_SEED, rounds = SWITCH_ROUNDS) {
  const random = mulberry32(seed);
  return Array.from({ length: rounds }, (_, id) => {
    const questionAlice = random() < 0.5 ? 0 : 1;
    const questionBob = random() < 0.5 ? 0 : 1;
    const trial = quantumRound(random, questionAlice, questionBob);
    return { id, ...trial, source: "simulation", seed };
  });
}
