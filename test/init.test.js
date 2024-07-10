import { init } from "../src/init";

describe("countdown initialization", () => {
  test("check initial countdown value", () => {
    expect(init()).toBe("10:42:24");
  });
});
