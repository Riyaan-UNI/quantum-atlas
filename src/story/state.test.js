import assert from "node:assert/strict";
import test from "node:test";
import {
  STORY_STORAGE_KEY,
  initialStoryState,
  persistStoryState,
  restoreStoryState,
  storyReducer,
} from "./state.js";

test("new cases begin in Act I at Scene 1", () => {
  assert.equal(initialStoryState.scene, "arrival");
});

test("LEARN adds an evidence entry once per id", () => {
  const entry = { id: "switch-test", kind: "simulation", text: "A seeded result." };
  const first = storyReducer(initialStoryState, { type: "LEARN", entry });
  const second = storyReducer(first, { type: "LEARN", entry: { ...entry, text: "Duplicate." } });
  assert.equal(first.ledger.length, 1);
  assert.equal(second.ledger.length, 1);
  assert.equal(second.ledger[0].text, entry.text);
});

test("predictions and ledger round-trip through session storage", () => {
  const values = new Map();
  const storage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  };
  const predicted = storyReducer(initialStoryState, { type: "PREDICT", id: "switchTest", value: "H2" });
  const learned = storyReducer(predicted, {
    type: "LEARN",
    entry: { id: "local-record", kind: "known", text: "Local outcomes do not disclose the remote setting." },
  });

  assert.equal(persistStoryState(learned, storage), true);
  assert.equal(values.has(STORY_STORAGE_KEY), true);
  assert.deepEqual(restoreStoryState(storage), learned);
});

test("storage failures fall back to a playable initial story", () => {
  const blocked = {
    getItem() { throw new Error("storage blocked"); },
    setItem() { throw new Error("storage blocked"); },
  };
  assert.deepEqual(restoreStoryState(blocked), initialStoryState);
  assert.equal(persistStoryState(initialStoryState, blocked), false);
});

test("Locked Room trips preserve the story and restore the letter state", () => {
  const predicted = storyReducer(initialStoryState, { type: "PREDICT", id: "switchTest", value: "unsure" });
  const inRoom = storyReducer(predicted, { type: "OPEN_BRANCH", branchId: "computing" });
  const returned = storyReducer(inRoom, { type: "CLOSE_BRANCH" });
  assert.equal(inRoom.letter, "branchOpen");
  assert.equal(returned.letter, "inTransit");
  assert.equal(returned.predictions.switchTest, "unsure");
  assert.equal(returned.branchId, null);
});
