const UINT32_RANGE = 0x1_0000_0000;
const GOLDEN_RATIO_32 = 0x9e37_79b9;
const FNV_OFFSET_BASIS_32 = 0x811c_9dc5;
const FNV_PRIME_32 = 0x0100_0193;

export interface Uint32RandomState {
  /** Immutable root seed for this stream. */
  seed: number;
  /** Number of values already consumed. Kept as uint32 for JSON-safe replay. */
  cursor: number;
}

export interface RandomStep<T> {
  value: T;
  state: Uint32RandomState;
}

export type SeedPart = number | string;

export function toUint32(value: number): number {
  return Number.isFinite(value) ? Math.trunc(value) >>> 0 : 0;
}

/**
 * One-way 32-bit avalanche used by every baseball random stream.
 * It is deliberately stateless so a saved `{ seed, cursor }` reproduces exactly.
 */
export function mixUint32(value: number): number {
  let mixed = (toUint32(value) + GOLDEN_RATIO_32) >>> 0;
  mixed = Math.imul(mixed ^ (mixed >>> 16), 0x21f0_aaad) >>> 0;
  mixed = Math.imul(mixed ^ (mixed >>> 15), 0x735a_2d97) >>> 0;
  return (mixed ^ (mixed >>> 15)) >>> 0;
}

export function hashSeedPart(value: SeedPart): number {
  if (typeof value === "number") {
    return mixUint32(toUint32(value) ^ 0x4e55_4d42);
  }

  let hash = FNV_OFFSET_BASIS_32;
  // Include a type marker so numeric 12 and string "12" never share a namespace.
  hash = Math.imul(hash ^ 0x53, FNV_PRIME_32) >>> 0;
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index);
    hash = Math.imul(hash ^ (code & 0xff), FNV_PRIME_32) >>> 0;
    hash = Math.imul(hash ^ (code >>> 8), FNV_PRIME_32) >>> 0;
  }
  return mixUint32(hash);
}

/**
 * Derives a consumption-order-independent child namespace without consuming the parent stream.
 * Callers should use stable labels (for example `pitch:location`) so adding a new
 * visual roll cannot change an already-authoritative gameplay roll.
 */
export function deriveSeed(rootSeed: number, ...parts: readonly SeedPart[]): number {
  let derived = mixUint32(toUint32(rootSeed) ^ 0x4241_5345);
  for (let index = 0; index < parts.length; index += 1) {
    derived = mixUint32(
      derived
      ^ hashSeedPart(parts[index])
      ^ Math.imul(index + 1, GOLDEN_RATIO_32),
    );
  }
  return derived >>> 0;
}

export function createRandomState(seed: number, cursor = 0): Uint32RandomState {
  return { seed: toUint32(seed), cursor: toUint32(cursor) };
}

export function randomUint32At(seed: number, cursor = 0): number {
  const offset = Math.imul((toUint32(cursor) + 1) >>> 0, GOLDEN_RATIO_32);
  return mixUint32((toUint32(seed) + offset) >>> 0);
}

export function randomFloatAt(seed: number, cursor = 0): number {
  return randomUint32At(seed, cursor) / UINT32_RANGE;
}

export function nextRandomUint32(state: Uint32RandomState): RandomStep<number> {
  const normalized = createRandomState(state.seed, state.cursor);
  return {
    value: randomUint32At(normalized.seed, normalized.cursor),
    state: {
      seed: normalized.seed,
      cursor: (normalized.cursor + 1) >>> 0,
    },
  };
}

export function nextRandomFloat(state: Uint32RandomState): RandomStep<number> {
  const step = nextRandomUint32(state);
  return {
    value: step.value / UINT32_RANGE,
    state: step.state,
  };
}

export function nextRandomRange(
  state: Uint32RandomState,
  minimum: number,
  maximum: number,
): RandomStep<number> {
  if (!Number.isFinite(minimum) || !Number.isFinite(maximum) || maximum < minimum) {
    throw new RangeError("Random range requires finite values with maximum >= minimum.");
  }
  const step = nextRandomFloat(state);
  return {
    value: minimum + (maximum - minimum) * step.value,
    state: step.state,
  };
}

export function forkRandomState(
  parent: Uint32RandomState,
  ...namespace: readonly SeedPart[]
): Uint32RandomState {
  const normalized = createRandomState(parent.seed, parent.cursor);
  return createRandomState(
    deriveSeed(normalized.seed, "fork", normalized.cursor, ...namespace),
  );
}
