export function formatLongString(data: string): string {
  return data
    .substr(0, 80)
    .replace(/[^\w\s]/gi, '')
    .replace(/\s/g, '');
}
