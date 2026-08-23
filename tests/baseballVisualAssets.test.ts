import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import test from "node:test";

const ASSET_DIRECTORY = new URL("../src/assets/games/", import.meta.url);
const TEN_FRAME_PITCH_ATLASES = [
  "baseball-pitch-fastball-10.png",
  "baseball-pitch-curve-10.png",
  "baseball-pitch-slider-10.png",
  "baseball-pitch-changeup-10.png",
] as const;

function pngDimensions(name: string) {
  const bytes = readFileSync(new URL(name, ASSET_DIRECTORY));
  assert.equal(bytes.toString("ascii", 1, 4), "PNG");
  return {
    width: bytes.readUInt32BE(16),
    height: bytes.readUInt32BE(20),
    size: bytes.byteLength,
  };
}

test("직구·커브·슬라이더·체인지업은 실제 10프레임 공 atlas를 유지한다", () => {
  for (const name of TEN_FRAME_PITCH_ATLASES) {
    const image = pngDimensions(name);
    assert.equal(image.width, image.height * 10, `${name}은 가로 10프레임이어야 한다`);
    assert.ok(image.height >= 128);
    assert.ok(image.size >= 100_000);
  }
});

test("야구 화면은 경기장·카메라·캐릭터·공을 포함한 실제 이미지 묶음을 유지한다", () => {
  const names = readdirSync(ASSET_DIRECTORY)
    .filter((name) => name.startsWith("baseball-") && name.endsWith(".png"));
  assert.ok(names.length >= 19);

  const required = [
    "baseball-ball-body-v2.png",
    "baseball-batter-actions-blue.png",
    "baseball-pitcher-actions-red.png",
    "baseball-fielder-actions-red.png",
    "baseball-catcher-actions-red.png",
    "baseball-camera-pitcher-empty.png",
    "baseball-camera-infield.png",
    "baseball-camera-home-run.png",
  ];
  for (const name of required) {
    assert.ok(names.includes(name), `${name} 누락`);
    assert.ok(statSync(new URL(name, ASSET_DIRECTORY)).size >= 100_000);
  }
});
