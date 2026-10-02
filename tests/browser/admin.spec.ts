import { test, expect } from "@playwright/test";
async function signIn(page: import("@playwright/test").Page) {
  await page.goto("/admin/login");
  await page.getByLabel("Email", { exact: true }).fill("browser@example.test");
  await page
    .getByLabel("Password", { exact: true })
    .fill(process.env.BROWSER_TEST_PASSWORD!);
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await expect(page).toHaveURL("/admin");
}
test("private pages and API reject anonymous access", async ({
  page,
  request,
}) => {
  await page.goto("/admin/manage/suppliers");
  await expect(page).toHaveURL("/admin/login");
  expect((await request.get("/api/admin/suppliers")).status()).toBe(401);
  expect((await request.get("/api/admin/templates/catalog")).status()).toBe(
    401,
  );
});
test("login, Arabic admin, supplier CRUD, and logout", async ({ page }) => {
  await signIn(page);
  await page.getByRole("button", { name: "العربية", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(
    page.getByRole("heading", { name: "إدارة محتوى المنصة" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "English", exact: true }).click();
  await page.goto("/admin/manage/suppliers");
  await page.getByRole("button", { name: "Add record" }).click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Stable key").fill(`browser-supplier-${Date.now()}`);
  await dialog
    .getByLabel("Name · English", { exact: true })
    .fill("Browser Test Supplier");
  await dialog.getByLabel("Name · Arabic", { exact: true }).fill("مورد اختبار");
  await dialog.getByRole("button", { name: "Save changes" }).click();
  await expect(page.getByRole("status")).toHaveText("Changes saved.");
  await expect(
    page.getByText("Browser Test Supplier", { exact: true }),
  ).toBeVisible();
  const row = page
    .getByRole("row")
    .filter({ hasText: "Browser Test Supplier" });
  await row.getByRole("button", { name: "Edit", exact: true }).click();
  await page
    .getByRole("dialog")
    .getByLabel("Description · English", { exact: true })
    .fill("Updated supplier");
  await page
    .getByRole("dialog")
    .getByRole("button", { name: "Save changes" })
    .click();
  page.once("dialog", (d) => d.accept());
  await row.getByRole("button", { name: "Delete", exact: true }).click();
  await expect(
    page.getByText("Browser Test Supplier", { exact: true }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Sign out", exact: true }).click();
  await expect(page).toHaveURL("/admin/login");
  expect((await page.request.get("/api/admin/suppliers")).status()).toBe(401);
});
test("manual Arabic page, dynamic demo quote, and database content updates", async ({
  page,
}) => {
  await page.goto("/ar");
  await expect(page.locator("html")).toHaveAttribute("lang", "ar");
  await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "تبدأ القصة",
  );
  await page.goto("/en");
  await page.locator("#demo input[type=checkbox]").first().check();
  await page.getByRole("button", { name: "Generate Demo Quote →" }).click();
  await expect(page.locator("[data-quote-sheet]")).toBeVisible();
  await expect(page.locator("[data-quote-sheet]")).toContainText(
    "Demo Quotation",
  );
  await expect(page.locator("[data-quote-sheet]")).toContainText("51.75");
  await signIn(page);
  const result = await page.request.get("/api/admin/texts");
  const texts = await result.json();
  const hero = texts.find((t: { key: string }) => t.key === "hero.text.003");
  const save = await page.request.post("/api/admin/texts", {
    headers: { Origin: "http://localhost:3100" },
    data: {
      originalKey: hero.key,
      data: { ...hero, en: "Updated public headline" },
    },
  });
  expect(save.ok()).toBe(true);
  await page.goto("/en");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Updated public headline",
  );
  await page.request.post("/api/admin/texts", {
    headers: { Origin: "http://localhost:3100" },
    data: { originalKey: hero.key, data: hero },
  });
});
test("Excel preview, confirmed import, and private PDF upload/download", async ({
  page,
}) => {
  await signIn(page);
  await page.goto("/admin/imports");
  const template = await page.request.get("/api/admin/templates/suppliers");
  expect(template.ok()).toBe(true);
  await page
    .getByLabel("Filename", { exact: true })
    .setInputFiles({
      name: "suppliers.xlsx",
      mimeType:
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      buffer: await template.body(),
    });
  await page.getByRole("button", { name: "Upload & preview" }).click();
  await expect(
    page.getByRole("button", { name: "Confirm import" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Confirm import" }).click();
  await expect(
    page.getByRole("button", { name: "Confirm import" }),
  ).toHaveCount(0);
  await page.goto("/admin/manage/suppliers");
  await expect(
    page.getByText("Example Supplier", { exact: true }),
  ).toBeVisible();
  await page.goto("/admin/documents");
  await page.getByLabel("Supplier", { exact: true }).selectOption("smartinbox");
  await page
    .getByLabel("Filename", { exact: true })
    .setInputFiles({
      name: "sample.pdf",
      mimeType: "application/pdf",
      buffer: Buffer.from("%PDF-1.4\n%%EOF"),
    });
  await page.getByRole("button", { name: "Upload file", exact: true }).click();
  const row = page.getByRole("row").filter({ hasText: "sample.pdf" });
  await expect(
    row.getByRole("link", { name: "Download", exact: true }),
  ).toBeVisible();
  const href = await row
    .getByRole("link", { name: "Download" })
    .getAttribute("href");
  const download = await page.request.get(href!);
  expect(download.ok()).toBe(true);
  expect((await download.body()).toString()).toContain("%PDF-");
  await page.getByRole("button", { name: "Sign out", exact: true }).click();
  expect((await page.request.get(href!)).status()).toBe(401);
});
