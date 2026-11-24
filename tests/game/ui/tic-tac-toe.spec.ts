import { expect, test } from "playwright/test";

test.use({ baseURL: process.env.BASE_URL });

test.afterEach(async ({ page }) => {
  if (process.env.QA_VIDEO === "1") await page.waitForTimeout(1500);
});

async function play(page: import("playwright/test").Page, row: number, column: number) {
  await page.getByRole("button", { name: `Row ${row}, column ${column}, empty` }).click();
}

test("initial game state shows nine empty cells and X starts", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Tic Tac Toe" })).toBeVisible();
  await expect(page.getByText("X's turn", { exact: true })).toBeVisible();
  await expect(page.getByRole("group", { name: "Game board" }).getByRole("button")).toHaveCount(9);
  await expect(page.getByRole("button", { name: /empty$/ })).toHaveCount(9);
});

test("valid moves alternate marks and turn status", async ({ page }) => {
  await page.goto("/");
  await play(page, 1, 1);
  await expect(page.getByRole("button", { name: "Row 1, column 1, X" })).toBeVisible();
  await expect(page.getByText("O's turn", { exact: true })).toBeVisible();
  await play(page, 2, 1);
  await expect(page.getByRole("button", { name: "Row 2, column 1, O" })).toBeVisible();
  await expect(page.getByText("X's turn", { exact: true })).toBeVisible();
});

test("an occupied cell cannot be overwritten", async ({ page }) => {
  await page.goto("/");
  await play(page, 1, 1);
  await expect(page.getByText("O's turn", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Row 1, column 1, X" })).toBeDisabled();
  await expect(page.getByText("O's turn", { exact: true })).toBeVisible();
});

test("a horizontal line wins and finished games reject further moves", async ({ page }) => {
  await page.goto("/");
  await play(page, 1, 1);
  await play(page, 2, 1);
  await play(page, 1, 2);
  await play(page, 2, 2);
  await play(page, 1, 3);
  await expect(page.getByText("X wins!", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Play again" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Row 3, column 3, empty" })).toBeDisabled();
  await expect(page.getByText("X wins!", { exact: true })).toBeVisible();
});

test("vertical and diagonal lines produce a win", async ({ page }) => {
  await page.goto("/");
  await play(page, 1, 1);
  await play(page, 1, 2);
  await play(page, 2, 1);
  await play(page, 2, 2);
  await play(page, 3, 1);
  await expect(page.getByText("X wins!", { exact: true })).toBeVisible();

  await page.getByRole("button", { name: "Play again" }).click();
  await play(page, 1, 1);
  await play(page, 1, 2);
  await play(page, 2, 2);
  await play(page, 1, 3);
  await play(page, 3, 3);
  await expect(page.getByText("X wins!", { exact: true })).toBeVisible();
});

test("a full board without a winning line is a draw", async ({ page }) => {
  await page.goto("/");
  for (const [row, column] of [[1, 1], [1, 2], [1, 3], [2, 2], [2, 1], [3, 1], [3, 2], [2, 3], [3, 3]] as const) {
    await play(page, row, column);
  }
  await expect(page.getByText("It's a draw!", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Play again" })).toBeVisible();
});

test("restarting an unfinished game clears the board and starts with X", async ({ page }) => {
  await page.goto("/");
  await play(page, 2, 2);
  await play(page, 1, 1);
  await page.getByRole("button", { name: "Restart game" }).click();
  await expect(page.getByText("X's turn", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: /empty$/ })).toHaveCount(9);
});

test("playing again after a win resets the finished board", async ({ page }) => {
  await page.goto("/");
  await play(page, 1, 1);
  await play(page, 2, 1);
  await play(page, 1, 2);
  await play(page, 2, 2);
  await play(page, 1, 3);
  await page.getByRole("button", { name: "Play again" }).click();
  await expect(page.getByText("X's turn", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: /empty$/ })).toHaveCount(9);
  await expect(page.getByRole("button", { name: "Restart game" })).toBeVisible();
});
