
export function calculateCompoundInterest(
  principal: number,
  rate: number,
  timesCompounded: number,
  years: number
): { total: number; interest: number } {
  const r = rate / 100; // convert percentage to decimal
  const total = principal * Math.pow(1 + r / timesCompounded, timesCompounded * years);
  const interest = total - principal;

  return {
    total: parseFloat(total.toFixed(2)),
    interest: parseFloat(interest.toFixed(2)),
  };
}
