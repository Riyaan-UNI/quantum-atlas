export const STORY_STORAGE_KEY = "quantum-atlas-letter-story-v2";

export const initialStoryState = {
  scene: "arrival",
  letter: "inTransit",
  returnLetter: "inTransit",
  branchId: null,
  predictions: {},
  lockedPredictions: {},
  ledger: [],
};

export function storyReducer(state, action) {
  switch (action.type) {
    case "GO":
      return { ...state, scene: action.scene };
    case "LETTER":
      return { ...state, letter: action.value };
    case "OPEN_BRANCH":
      if (state.letter === "branchOpen") return state;
      return {
        ...state,
        returnLetter: state.letter,
        letter: "branchOpen",
        branchId: action.branchId,
      };
    case "CLOSE_BRANCH":
      return {
        ...state,
        letter: state.returnLetter || "inTransit",
        branchId: null,
      };
    case "PREDICT":
      return {
        ...state,
        predictions: { ...state.predictions, [action.id]: action.value },
        lockedPredictions: { ...state.lockedPredictions, [action.id]: Boolean(action.locked) },
      };
    case "LEARN":
      if (state.ledger.some((entry) => entry.id === action.entry.id)) return state;
      return { ...state, ledger: [...state.ledger, action.entry] };
    case "RESET":
      return { ...initialStoryState, predictions: {}, lockedPredictions: {}, ledger: [] };
    default:
      return state;
  }
}

export function restoreStoryState(storage = null) {
  try {
    const target = storage ?? globalThis.sessionStorage;
    const saved = target?.getItem(STORY_STORAGE_KEY);
    if (!saved) return initialStoryState;
    const parsed = JSON.parse(saved);
    return {
      ...initialStoryState,
      ...parsed,
      predictions: parsed.predictions ?? {},
      lockedPredictions: parsed.lockedPredictions ?? {},
      ledger: Array.isArray(parsed.ledger) ? parsed.ledger : [],
    };
  } catch {
    return initialStoryState;
  }
}

export function persistStoryState(state, storage = null) {
  try {
    const target = storage ?? globalThis.sessionStorage;
    target?.setItem(STORY_STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch {
    return false;
  }
}
