/*
FORMAT NUMBER TO CLEAN DECIMALS from '1000.00' to '1000'
*/
export function formatNumber(data: number): number {
  return Number(data.toFixed());
}

export function formatNumberWith2Decimals(data: number): number {
  const result = (data / 100)
    .toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })
    .replace(/,/g, '');

  return parseFloat(result);
}
export function formatMoney(data: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(data / 100);
}

// export const { format: formatMoney } = new Intl.NumberFormat('pt-BR', {
//   style: 'currency',
//   currency: 'BRL'
// });
