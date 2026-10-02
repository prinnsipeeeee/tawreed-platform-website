import { test } from "node:test";
import assert from "node:assert/strict";
import { totals, feeFor } from "../src/lib/pricing";
import { resources, resourceSchema } from "../src/lib/resources";
import {
  uploadSpec,
  validateFile,
  EXCEL_TYPE,
} from "../src/lib/file-validation";
import defaults from "../src/seed/landing-default.json";
test("halala calculations round VAT exactly", () => {
  assert.deepEqual(
    totals(
      [
        { priceHalalas: 4500, qty: 2 },
        { priceHalalas: 25, qty: 1 },
      ],
      1500,
    ),
    { subtotal: 9025, vat: 1354, total: 10379 },
  );
});
test("fee boundaries are consistent at SAR 10,000 and 50,000", () => {
  const tiers = [
    { minimumHalalas: 0, feeHalalas: 3500 },
    { minimumHalalas: 1000000, feeHalalas: 7500 },
    { minimumHalalas: 5000000, feeHalalas: 15000 },
  ];
  assert.equal(feeFor(999999, tiers), 3500);
  assert.equal(feeFor(1000000, tiers), 7500);
  assert.equal(feeFor(4999999, tiers), 7500);
  assert.equal(feeFor(5000000, tiers), 15000);
});
test("content defaults have Arabic translations and unique keys", () => {
  assert.ok(defaults.texts.length > 100);
  assert.equal(
    new Set(defaults.texts.map((t) => t.key)).size,
    defaults.texts.length,
  );
  assert.ok(defaults.texts.every((t) => t.en && t.ar));
  assert.equal(defaults.divisions.length, 6);
  assert.equal(defaults.scenes.length, 5);
});
test("links reject script URLs and protocol-relative URLs", () => {
  const schema = resourceSchema(resources.nav);
  for (const href of [
    "javascript:alert(1)",
    "//evil.test",
    "http://example.com",
  ])
    assert.equal(
      schema.safeParse({ key: "test", label: "Test", labelAr: "", href })
        .success,
      false,
    );
  assert.equal(
    schema.safeParse({ key: "test", label: "Test", href: "#hero" }).success,
    true,
  );
});
test("prices must be nonnegative integer halalas and keys cannot contain paths", () => {
  const schema = resourceSchema(resources.catalog);
  const data = {
    key: "test",
    supplierKey: "supplier",
    categoryKey: "general",
    nameEn: "Item",
    unitEn: "m²",
    priceHalalas: 4500,
  };
  assert.equal(schema.safeParse(data).success, true);
  assert.equal(schema.safeParse({ ...data, priceHalalas: -1 }).success, false);
  assert.equal(schema.safeParse({ ...data, priceHalalas: 1.5 }).success, false);
  assert.equal(schema.safeParse({ ...data, key: "../test" }).success, false);
});
test("file size and signature validation rejects disguised uploads", () => {
  assert.equal(uploadSpec("file.pdf", 1024).contentType, "application/pdf");
  assert.throws(() => uploadSpec("file.pdf", 21 * 1024 * 1024));
  assert.throws(() => uploadSpec("file.exe", 100));
  assert.throws(() => validateFile(Buffer.from("not pdf"), "application/pdf"));
  assert.throws(() => validateFile(Buffer.from("PK"), EXCEL_TYPE));
  validateFile(Buffer.from("%PDF-1.4\n%%EOF"), "application/pdf");
});
