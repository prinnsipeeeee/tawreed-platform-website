import { inflateRawSync } from "node:zlib";
import { AppError } from "./errors";
export const EXCEL_TYPE =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
export function uploadSpec(filename: string, size: number) {
  if (!Number.isInteger(size) || size <= 0) throw new AppError("invalidFile");
  const extension = filename.toLowerCase().split(".").pop();
  const max =
    extension === "xlsx"
      ? 5 * 1024 * 1024
      : extension === "pdf"
        ? 20 * 1024 * 1024
        : 0;
  if (!max || size > max) throw new AppError("fileLimit");
  const safe = filename.replace(/[^\p{L}\p{N}._ -]/gu, "_").slice(-150);
  return {
    filename: safe,
    contentType: extension === "xlsx" ? EXCEL_TYPE : "application/pdf",
    max,
  };
}
export function validateFile(bytes: Buffer, type: string) {
  if (type === "application/pdf") {
    if (bytes.subarray(0, 5).toString() !== "%PDF-")
      throw new AppError("invalidFile");
  } else {
    if (bytes.length < 46) throw new AppError("invalidFile");
    if (bytes.readUInt32LE(0) !== 0x04034b50) throw new AppError("invalidFile");
    // Bound expansion before ExcelJS unzips the workbook.
    let total = 0,
      count = 0;
    for (let i = 0; i < bytes.length - 46; i++)
      if (bytes.readUInt32LE(i) === 0x02014b50) {
        const declared = bytes.readUInt32LE(i + 24);
        const compressed = bytes.readUInt32LE(i + 20);
        const offset = bytes.readUInt32LE(i + 42);
        const method = bytes.readUInt16LE(i + 10);
        if (
          offset + 30 > bytes.length ||
          bytes.readUInt32LE(offset) !== 0x04034b50
        )
          throw new AppError("invalidFile");
        const start =
          offset +
          30 +
          bytes.readUInt16LE(offset + 26) +
          bytes.readUInt16LE(offset + 28);
        if (start + compressed > bytes.length)
          throw new AppError("invalidFile");
        if (declared + total > 50 * 1024 * 1024)
          throw new AppError("fileLimit");
        try {
          const packed = bytes.subarray(start, start + compressed);
          const expanded =
            method === 0
              ? packed
              : method === 8
                ? inflateRawSync(packed, {
                    maxOutputLength: 50 * 1024 * 1024 - total,
                  })
                : null;
          if (!expanded || expanded.length !== declared)
            throw new AppError("invalidFile");
        } catch (error) {
          if (error instanceof AppError) throw error;
          throw new AppError("invalidFile");
        }
        total += declared;
        count++;
        if (total > 50 * 1024 * 1024 || count > 2000)
          throw new AppError("fileLimit");
        i +=
          45 +
          bytes.readUInt16LE(i + 28) +
          bytes.readUInt16LE(i + 30) +
          bytes.readUInt16LE(i + 32);
      }
    if (!count) throw new AppError("invalidFile");
  }
}
