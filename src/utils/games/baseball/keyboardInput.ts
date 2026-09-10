export type BaseballKeyboardAction =
  | "PRIMARY"
  | "AIM_LEFT"
  | "AIM_RIGHT"
  | "AIM_UP"
  | "AIM_DOWN";

export interface BaseballKeyboardInput {
  code: string;
  key: string;
  repeat: boolean;
  isComposing: boolean;
  altKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
  shiftKey: boolean;
  interactiveTarget: boolean;
  primaryEnabled: boolean;
  aimEnabled: boolean;
}

export interface BaseballKeyboardResolution {
  preventDefault: boolean;
  action: BaseballKeyboardAction | null;
}

const NO_KEYBOARD_ACTION: BaseballKeyboardResolution = Object.freeze({
  preventDefault: false,
  action: null,
});

const AIM_ACTIONS: Readonly<Record<string, BaseballKeyboardAction>> = Object.freeze({
  ArrowLeft: "AIM_LEFT",
  ArrowRight: "AIM_RIGHT",
  ArrowUp: "AIM_UP",
  ArrowDown: "AIM_DOWN",
});

/**
 * Keeps gameplay shortcuts deterministic and separates browser-scroll blocking
 * from whether the current presentation phase accepts an action.
 */
export function resolveBaseballKeyboardInput(
  input: BaseballKeyboardInput,
): BaseballKeyboardResolution {
  if (input.interactiveTarget || input.isComposing) return NO_KEYBOARD_ACTION;

  const isSpace = input.code === "Space" || input.key === " ";
  if (isSpace) {
    if (input.altKey || input.ctrlKey || input.metaKey) return NO_KEYBOARD_ACTION;

    return {
      preventDefault: true,
      action: !input.repeat && !input.shiftKey && input.primaryEnabled
        ? "PRIMARY"
        : null,
    };
  }

  if (
    input.repeat
    || input.altKey
    || input.ctrlKey
    || input.metaKey
    || input.shiftKey
    || !input.aimEnabled
  ) {
    return NO_KEYBOARD_ACTION;
  }

  const action = AIM_ACTIONS[input.key] ?? null;
  return action ? { preventDefault: true, action } : NO_KEYBOARD_ACTION;
}
