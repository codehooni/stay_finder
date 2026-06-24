export function formatMoney(amount: string | number, currency: string) {
  const numericAmount = Number(amount);

  if (Number.isNaN(numericAmount)) {
    return `${amount} ${currency}`;
  }

  return new Intl.NumberFormat('en', {
    style: 'currency',
    currency,
    maximumFractionDigits: currency === 'KRW' ? 0 : 2,
  }).format(numericAmount);
}

export function formatReviewScore(score: string | number) {
  const numericScore = Number(score);

  if (Number.isNaN(numericScore)) {
    return String(score);
  }

  return numericScore.toFixed(1);
}
