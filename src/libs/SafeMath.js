export function AddFloats(a, b, precision) {
  const multiplier = Math.pow(10, precision);
  const MaxSafe = Number.MAX_SAFE_INTEGER / multiplier;
  if (a > MaxSafe || b > MaxSafe) return Math.round(a + b, precision);
  const x = Math.round(a * multiplier);
  const y = Math.round(b * multiplier);
  const z = Math.round(x + y) / multiplier;
  return z;
}

export function Rounded(x, precision) {
  const multiplier = Math.pow(10, precision);
  const z = Math.round(x / multiplier) * multiplier;
  return z;
}
