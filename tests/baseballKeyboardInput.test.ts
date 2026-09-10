import assert from "node:assert/strict";
import test from "node:test";

import {
  resolveBaseballKeyboardInput,
  type BaseballKeyboardInput,
} from "../src/utils/games/baseball/keyboardInput.ts";

function input(overrides: Partial<BaseballKeyboardInput> = {}): BaseballKeyboardInput {
  return {
    code: "Space",
    key: " ",
    repeat: false,
    isComposing: false,
    altKey: false,
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,
    interactiveTarget: false,
    primaryEnabled: false,
    aimEnabled: false,
    ...overrides,
  };
}

test("게임 단계가 입력을 받지 않아도 스페이스 기본 스크롤은 차단한다", () => {
  assert.deepEqual(resolveBaseballKeyboardInput(input()), {
    preventDefault: true,
    action: null,
  });
});

test("실행 가능한 단계의 첫 스페이스 입력만 기본 동작을 막고 주 동작을 실행한다", () => {
  assert.deepEqual(resolveBaseballKeyboardInput(input({ primaryEnabled: true })), {
    preventDefault: true,
    action: "PRIMARY",
  });
  assert.deepEqual(resolveBaseballKeyboardInput(input({ primaryEnabled: true, repeat: true })), {
    preventDefault: true,
    action: null,
  });
});

test("Shift+Space도 페이지를 올리지 않지만 게임 동작은 중복 실행하지 않는다", () => {
  assert.deepEqual(resolveBaseballKeyboardInput(input({ primaryEnabled: true, shiftKey: true })), {
    preventDefault: true,
    action: null,
  });
});

test("입력 요소와 운영체제 조합키에서는 스페이스 기본 동작을 가로채지 않는다", () => {
  assert.deepEqual(resolveBaseballKeyboardInput(input({ interactiveTarget: true })), {
    preventDefault: false,
    action: null,
  });
  assert.deepEqual(resolveBaseballKeyboardInput(input({ ctrlKey: true })), {
    preventDefault: false,
    action: null,
  });
});

test("방향키는 조준 가능 단계에서만 조준 동작과 기본 스크롤 차단을 함께 반환한다", () => {
  assert.deepEqual(resolveBaseballKeyboardInput(input({
    code: "ArrowLeft",
    key: "ArrowLeft",
    aimEnabled: true,
  })), {
    preventDefault: true,
    action: "AIM_LEFT",
  });
  assert.deepEqual(resolveBaseballKeyboardInput(input({
    code: "ArrowLeft",
    key: "ArrowLeft",
    aimEnabled: false,
  })), {
    preventDefault: false,
    action: null,
  });
});
