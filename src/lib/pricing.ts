export function totals(
  items: { priceHalalas: number; qty: number }[],
  vatBasisPoints: number,
) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.priceHalalas * item.qty,
    0,
  );
  const vat = Math.round((subtotal * vatBasisPoints) / 10000);
  return { subtotal, vat, total: subtotal + vat };
}
export function feeFor(
  valueHalalas: number,
  tiers: { minimumHalalas: number; feeHalalas: number }[],
) {
  return (
    [...tiers]
      .sort((a, b) => b.minimumHalalas - a.minimumHalalas)
      .find((t) => valueHalalas >= t.minimumHalalas)?.feeHalalas ?? 0
  );
}
